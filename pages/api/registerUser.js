import { MongoClient } from "mongodb";
import {generateSalt, encrypt, generateID} from "../../utils/cryptography.js"

let uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);


export default async function handler(req, res) {

    const body = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    const passwordRegex = RegExp(/^(?=.*[A-Z])(?=.*\d)[\w]{8,}/);


    if (!body || !Object.keys(body).length) {
        return res.status(400).json({ "error": "Se debe especificar el usuario que se quiere crear" })
    } else if (!body.email || !emailRegex.test(body.email)) {
        return res.status(400).json({ "error": "Se debe especificar un email válido" })
    } else if (!body.password || !passwordRegex.test(body.password)) {
        return res.status(400).json({ "error": "Se debe especificar una contraseña válida" })
    } else if (!body.username || body.username.length < 4) {
        return res.status(400).json({ "error": "Se debe especificar un nombre de usuario válido" })
    } 

        if (req.method !== "POST") {
            res.status(404).json({ message: "This endpoint only admits POST request" })
        }


        const connection = await client.connect();
        const db = connection.db("citizen-science");
        const users = db.collection("users");

        //comprobacion de si existe el usuario 
    
        const existentUser = await users.findOne({ email: req.body.email });

        if (existentUser) {
            return res.status(400).json({
                error: "Email taken",
                message: `El correo electrónico ${req.body.email} ya está en uso`
            });
        }

       //Unique id with 32 characters
        const userID = generateID()
        const salt = generateSalt();

        let registerUser = await users.insertOne({
            _id: encrypt(userID,salt),
            username: req.body.username,
            //hay que hashear la password primero, te guardas el encriptado nunca te guardar la string verdadera
            email: req.body.email,
            password: encrypt(req.body.password, salt),
            salt
        });

        if (registerUser) {
            return res.status(200).json({
                message: `Usuario ${req.body.username} registrado correctamente`
            })
        }
        //!hacer uno de error?
    




}