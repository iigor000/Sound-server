import mongoose, { Schema } from "mongoose";
import { userSchema } from '../models/user.model.js'

export const soundSchema = new mongoose.Schema({
    title: String,
    filename: String,
    path: String,
    likes: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Sound = mongoose.model('Sound', soundSchema)