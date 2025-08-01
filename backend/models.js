const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    tokenExpires: {
        type: Date,
    },  
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    friendsList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
        default: [],
    },
    friendRequests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "users",
        default: [],
    },
    timerSessions: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    customMessages: {
        hydration: {
        type: String,
        default: 'Time for hydration!',
        maxlength: 60
        },
        stretch: {
        type: String,
        default: 'Stretch it out!',
        maxlength: 60
        },
        stand: {
        type: String,
        default: 'Stand Up!',
        maxlength: 60
        },
        focusCompletion: {
        type: String,
        default: 'Good Job!',
        maxlength: 25
        }
    }
}, { timestamps: true });

const User = new mongoose.model("User", UserSchema)


// Timer schema (links to users)
const timerDiscriminator = { discriminatorKey: 'type', timestamps: true };

const TimerSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, timerDiscriminator);

const TimerSession = mongoose.model('TimerSession', TimerSessionSchema);

// FocusTimer-specific schema
const FocusSessionSchema = new mongoose.Schema({
  focusTime:     { type: Number, required: true },
  breakTime:     { type: Number, required: true },
  longBreakTime: { type: Number, required: true }
});

const FocusSession = TimerSession.discriminator('focus', FocusSessionSchema);

// PopupTimer-specific schema
const PopupSessionSchema = new mongoose.Schema({
  popupName:  { type: String,
                enum: ['hydration','stretch','stand'],
                required: true },
  popupCount: { type: Number, default: 0 }
});

const PopupSession = TimerSession.discriminator('popup', PopupSessionSchema);


module.exports = { User, TimerSession, FocusSession, PopupSession }