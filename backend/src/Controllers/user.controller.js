import { User } from "../models/user.model.js"
import crypto from 'crypto'
import { encodeJWT } from "../utils/jwt.js"

export default class UserController{
    constructor(){

    }

    registerUser = async function(reqest, response) {
        try{
            const body = reqest.body

            let username = body.username
            let firstName = body.firstName
            let lastName = body.lastName
            let email = body.email
            let password = body.password
    
            if(!username || !firstName || !lastName || !email || !password){
                return response.status(400).json({message:'You did not send the required paramiters'})
            }

            const postojeciUser = await User.findOne({username: username})

            if(postojeciUser){
                return response.status(400).json({message:'This username is taken'})
            }

            password = hash(password)

            const user = await User.create({
                username,
                password,
                firstName,
                lastName,
                email
            })
            
            return response.status(200).json({message:'User succesfully created'})
        }catch(error){
            console.log(error);
            return response.status(500).json({message:'Unexpected server error'})
        }

    }

    loginUser = async function(request, response) {
        try{
            const username = request.body.username
            const password = request.body.password

            if(!username || !password) return response.status(500).json({message:'Username or password was not sent'})

            const user = await User.findOne({username: username})

            if(!user) return response.status(404).json({message:'User does not exist'})

            const hashedPassword = hash(password)

            if(hashedPassword != user.password) return response.status(400).json({message:'Wrong password'})

            console.log('User logged in')

            const token = encodeJWT({
                username: user.username,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName
            })

            return response.status(200).json(token)

        }catch(error){
            console.log(error)
            return response.status(500).json({message:'Unexpected server error'})
        }
    }

    /*getAllUserSounds = async function(request, response){
        try{
            const userId = request.params.id

            const user = await User.findById(userId).populate('sounds')

            response.status(200).json(user)
        }catch(error){
            console.log(error)
            return response.status(500).json({message:'Server error'})
        }
    }*/
}

function hash(data){
    return crypto.createHash('sha256').update(data).digest('hex')
}