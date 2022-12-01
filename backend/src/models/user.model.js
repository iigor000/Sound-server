import mongoose, { Schema } from "mongoose";
import { soundSchema } from '../models/sound.model.js'

export const userSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true},
    sounds: [{
        type: Schema.Types.ObjectId,
        ref: 'Sounds'
    }]
})

export const User = mongoose.model('User', userSchema)