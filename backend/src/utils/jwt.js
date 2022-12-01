import jwt from 'jsonwebtoken'

export const jwtSecret = 'ad312j3h1ijd'

export function authorizeUser(request, response, next){
    const authHeader = request.headers['authorization']

    if(!authHeader) return response.status(401).json({message:'Authorization header missing'})

    const token = authHeader///.split(" ")[1]

    if(!token) return response.status(401).json({message:'Token was not sent'})

    try{
        const dekodiraniPodaci = jwt.verify(token, jwtSecret)

        response.locals.user = dekodiraniPodaci

        next()
    }catch(error){
        console.log('JWT error')
        return response.status(401).json({message:'Token is not valid'})
    }
}

export function encodeJWT(data){
    return jwt.sign(data, jwtSecret)
}