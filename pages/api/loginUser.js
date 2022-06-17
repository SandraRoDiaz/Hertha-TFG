import {MongoClient} from "mongodb";
import md5 from 'md5';
import jwt from 'jsonwebtoken'

let uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);




export default async function loginUser(req, res) {


    if (req.method !== "POST") {
        res.status(404).json({message: "This endpoint only admits POST request"})
    }

    const connection = await client.connect();
    const db =  connection.db("citizen-science");
    const users = db.collection("users");

    if(req.body.email !=="" && req.body.password!==""){
        const  existentUser = await users.findOne({email: req.body.email});
        if(existentUser){
    
            const hashedPassword = md5(req.body.password + existentUser.salt)
    
            //si la contraseña introducida por el usuario tras encriptarla coincide con la contraseña encriptada de la DB
            //el usuario puede acceder a la plataforma
            if(existentUser.password === hashedPassword){
                
                //se le asigna un token al usuario para esta sesión
                const token = jwt.sign(existentUser, process.env.SECRET, {expiresIn: `4days`})
                existentUser.authorization = {
                    token
                }
                return res.json(existentUser)
                
            }else{
                //la contraseña introducida por el usuario no coincide con la contraseña guardada en la DB
                return res.status(400).json({
                    error: "Password error",
                    message: `Contraseña incorrecta`
                });
            }
    
        }else{
            //client error response
            return res.status(400).json({
                error: "Email doesn't exist",
                message: `El correo electrónico ${req.body.email} no existe en nuestra base de datos`
            });
        }
    }else{
        return res.status(500).json({
            error: "Empty fields",
            message: `Introduzca sus credenciales`
        });
    }
   

    

}
