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
const {User} = require('./models.js');

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
    res.json(req.user);
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

//404 error handling
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
})
