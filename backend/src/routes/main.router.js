import express from "express";
import { MainController } from "../Controllers/main.controller.js";
import { authorizeUser } from '../utils/jwt.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from "uuid";

function fileFilter(req, file, cb) {
    try {
        const extentions = ['.mp3', 'wav']

        const ext = extentions.includes(path.extname(file.originalname))

        if (ext) {
            return cb(null, true)
        } else {
            cb('Incorrect file type')
        }

    } catch (error) {
        console.log(error)
        cb('Error testing file')
    }
}

function filename(req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname))
}

const upload = multer({ storage: multer.diskStorage({ destination: 'public/sounds/', filename: filename, fileFilter: fileFilter }) })


const router = express.Router()

const mainController = new MainController()

router.post('/sound', authorizeUser, upload.single('sound'), mainController.addSound)

router.get('/sound/:id', mainController.getSound)

router.get('/sounds', mainController.getAllSounds)

router.delete('/sound/:id', authorizeUser, mainController.deleteSound)

router.patch('/sound/:id', mainController.updateSound)

export const mainRouter = router