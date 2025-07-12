if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// imports required modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const crypto = require('crypto')
const friendRoutes = require('./routes/friendRoutes');

//Models
const {User} = require('./models.js')
const { FocusSession } = require('./models');
const { PopupSession } = require('./models');

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password')
        done(null, user)
    } 
    catch (err) {
        done(err)
    }
})

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))
app.use(passport.initialize())
app.use(passport.session())

const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })
        if (!user) return done(null, false, { message: 'No user found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return done(null, false, { message: 'Incorrect password' })

        return done(null, user)
    } 
    catch (err) {
        return done(err)
    }
}))

const PORT = 5000

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

app.get('/', (req, res) => res.send('API running'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// only allows users to be routed to homepage if authenticated
app.get('/api/user', checkAuthenticated, (req, res) => {
    res.json(req.user)
})

app.get('/api/search-user', async (req, res) => {
    const { username } = req.query
    try {
        const searchUser = await User.findOne({ username })
        if (!searchUser) {
        return res.status(404).json({ message: 'User not found' })
        }
        res.json({ _id: searchUser._id })
    } 
    catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return next(err)
        }

        if(!user) {
            return res.status(401).json({ message: info.message || 'Login failed' })
        }

        req.logIn(user, (err) => {
            if(err) {
                return next(err)
            }
            // Login success
            return res.sendStatus(200)
        })
    })(req, res, next)
})

app.delete('/logout', (req, res) => {
    req.logOut(err => {
        if (err) return res.status(500).send("Logout failed")
        res.sendStatus(200)
    })
})

app.post('/signup', async (req, res) => {
    const { email, password, display_name, username } = req.body
    console.log('[SIGNUP REQUEST]', { email, username })

    try {
        const existing = await User.findOne({ email })
        if (existing) {
        console.log('[SIGNUP] User already exists')
        return res.status(400).send('User already exists')
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = new User({ email, password: hashed, display_name, username })

        await user.save()
        console.log('[SIGNUP] New user created:', user.email, user.username)
        res.sendStatus(201)
    } catch (err) {
        console.error('[SIGNUP ERROR]', err)
        res.status(500).send('Error signing up')
    }
})

app.get('/profile/:id', checkAuthenticated, async (req, res) => {
    try {
        const userId = req.params.id
        const viewingUser = await User.findById(userId)

        if (!viewingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ viewingUser })
        
    } catch (error) {
        console.error("Error fetching user profile:", error)
        res.status(409).json({ message: "Internal Server Error" })
    }
})

app.put('/edit-profile', checkAuthenticated, async (req, res) => {
    const { username, currentPassword, newPassword } = req.body

    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).send('User not found')
        }

        const correctPassword = await bcrypt.compare(currentPassword, user.password)
        if(!correctPassword) {
            return res.status(401).send('Incorrect current password')
        }

        if (username) {
            user.username = username
        }
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10)
        }

        await user.save()
        res.sendStatus(200)
    } 
    catch (err) {
        console.error('Error updating profile:', err)
        res.status(500).send('Error updating profile')
    }
})

//checks if user is authenticated
function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next()
    }
    res.status(401).json({ message: 'Not authenticated' })
}

//checks if user isnt authenticated
function checkNotAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return res.status(403).json({ message: 'Already authenticated' })
    }
    next()
}

app.use('/api/friends', friendRoutes);

// focus timer route
app.post(
  '/api/focus-session',
  checkAuthenticated,
  async (req, res) => {
    try {
      const { focusTime, breakTime, longBreakTime } = req.body;
      const session = await FocusSession.create({
        user: req.user._id,
        focusTime,
        breakTime,
        longBreakTime
      });
      res.status(201).json(session);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not save focus session' });
    }
  }
);

// popup timer route
app.post('/api/timers/popup', checkAuthenticated, async (req, res) => {
  try {
    const { popupName, popupCount } = req.body;
    const session = await PopupSession.create({
      user: req.user._id,
      popupName,
      popupCount
    });
    res.status(201).json(session);
  } catch (err) {
    console.error('Error saving popup session:', err);
    res.status(500).json({ message: 'Could not save popup session' });
  }
});

//404 error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})
