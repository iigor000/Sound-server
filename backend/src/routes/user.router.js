import express from 'express';
import UserController from '../Controllers/user.controller.js';
import { authorizeUser } from '../utils/jwt.js';

const router = express.Router()

const userController = new UserController()

router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)

//router.get('/sounds/:id', userController.getAllUserSounds)

export const userRouter = router