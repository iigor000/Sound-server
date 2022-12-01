import express from 'express'
import mongoose from 'mongoose'
import { mainRouter } from './src/routes/main.router.js'
import { userRouter } from './src/routes/user.router.js'
import { fileURLToPath } from 'url'
import path from 'path'

async function main() {
    const app = express()

    const connetion = await (await mongoose.connect('mongodb://0.0.0.0:27017/hakaton'))

    console.log('Succesfully connected to the database')

    app.use(express.json())

    const dirname = path.dirname(fileURLToPath(import.meta.url))
    app.use('/public', express.static(dirname + '/public'))

    app.use('/user', userRouter)

    app.use(mainRouter)

    const PORT = 3000;

    app.listen(PORT, function () {
        console.log('Server is running on port:', PORT)
    })
}

main()