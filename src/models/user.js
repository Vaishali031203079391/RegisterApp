const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
        validate(value) {
            var len = value.length
            var val = Number(value)
            if ((val === NaN) || (len > 10) || (len < 10)) {
                if (!validator.isNumeric(val)) {
                    throw new Error('Not a phone number')
                }
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
  },
    tokens: [{
        token: {
            type: String,
            required: true
        }
  }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" })

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// userSchema.methods.generateTokenUrl = async function () {
//   const user = this
//   const Otp = Math.floor(1000 + Math.random() * 9000);
//   const issuedAt = new Date();
//   const currentTime = new Date();
//   const expiry = new Date(currentTime.setSeconds(currentTime.getSeconds() + 60));
//   user.activeUrl = user.activeUrl.concat({
//     Otp,
//     issuedAt,
//     expiry
//   })
//   await user.save()

//   return Otp
// }

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
