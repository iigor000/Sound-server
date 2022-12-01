import { soundSchema, Sound } from "../models/sound.model.js"
import { User } from "../models/user.model.js"

export class MainController {

    addSound = async function (request, response, next) {
        try {
            const body = request.body
            const file = request.file

            const user = response.locals.user
            if (!user) return response.status(401).json({ message: 'You need to login to add sounds' })

            const title = body

            if (!title) return response.status(400).json({ message: 'Invalid body' })

            if (!file) return response.status(400).json({ message: 'File is missing' })

            const mongoUser = await User.findById(user.id)

            if (!mongoUser) return response.status(401).json({ message: 'Uknown user' })

            const sound = await Sound.create({
                title: body.title,
                likes: 0,
                filename: file.filename,
                path: `/public/photos/${file.filename}`,
                user: mongoUser
            })
            mongoUser.sounds.push(sound)
            await mongoUser.save()

            response.status(200).json({ message: 'Sound added' })
        } catch (error) {
            console.log(error)
            return response.status(401).json({ message: 'Error adding the sound' })
        }
    }

    getSound = async function (request, response, next) {
        try {
            const id = request.params.id

            if (!id) return response.status(400).json({ message: 'Missing sound id' })

            const sound = await Sound.findById(id).populate('user', '-password')

            if (!sound) return response.status(404).json({ message: 'Sound not found' })

            response.status(200).json(sound)
        } catch (error) {
            console.log(error)
            return response.status(401).json({ message: 'Error getting the sound' })
        }
    }

    getAllSounds = async function (request, response) {
        const sounds = await Sound.find().populate('user', '-password')

        response.status(200).json(sounds)
    }

    deleteSound = async function(request, response) {
        try {
            const id = request.params.id
            const user = response.locals.user

            if (!id) return response.status(400).json({ message: 'Missing sound id' })

            const sound = await Sound.findById(id).populate('user')

            if (!sound) return response.status(404).json({ message: 'Sound not found' })

            if(sound.user.id != user.id) return response.status(403).json({message:'You do not have the permition to delete this sound'})

            await sound.user.sounds.remove(sound.id)
            await sound.user.save()
            await Sound.deleteOne(sound)

            return response.status(200).json({message:'Sound succesfully deleted'})
        } catch (error) {
            console.log(error)
            return response.status(401).json({ message: 'Error deleting the sound' })
        }
    }

    updateSound = async function(request, response){
        try {
            const id = request.params.id
            const body = request.body

            if (!id) return response.status(400).json({ message: 'Missing sound id' })

            const likes = body
            
            const sound = await Sound.findOneAndUpdate(id,{likes: body.likes} )

            if (!sound) return response.status(404).json({ message: 'Sound not found' })

            response.status(200).json(sound)
        } catch (error) {
            console.log(error)
            return response.status(401).json({ message: 'Error getting the sound' })
        }
    }
}