import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { JsonWebTokenError } from "jsonwebtoken"

const userschema = new mongoose.Schema({

    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: true,
        trim: true

    },
    fullname: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true

    },
    avatar: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String,
        required: true,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String,

    }

}, { timestamps: true })
userschema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})


userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


userschema.methods.generateAccessToken = function () {
    return JsonWebTokenError.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userschema.methods.generatRefreshToken = function () {
    return JsonWebTokenError.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const user = mongoose.model("user", userschema)

