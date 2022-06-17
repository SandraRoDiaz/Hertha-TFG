import {MongoClient} from "mongodb";
import jwt from "jsonwebtoken"
import { generateSalt, encrypt, generateID } from "../../../utils/cryptography";


let uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);


export default async function createProject(req, res) {
    
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];
    
    let authUser;
    try {
        
        authUser = await jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return res.status(403).json({error: "Invalid authentication"})
    }


    const connection = await client.connect();
    const db =  connection.db("citizen-science");
    const projects = db.collection("projects");

    const declareHeaders = async() =>{
        const totalProjects = await projects.count({})
        res.setHeader("X-Total-Count", totalProjects)
    }
    switch(req.method){


        case "POST":

        try{
            //Evitamos introducir tareas vacias
            let newTaskList = req.body.tasks.filter((v, i) => v !== "");

            //Unique id with 32 characters
            let projectID = generateID()
            const salt = generateSalt();

            if(req.body.title !== "" &&  req.body.field.length !== 0 && req.body.projectStart !=="" && req.body.projectEnd !=="" 
                && req.body.objective !=="" && req.body.location !=="" && req.body.description !==""){
                let addProject = await projects.insertOne({
                    _id : encrypt(projectID, salt),
                    title: req.body.title,
                    field : req.body.field,
                    projectStart : new Date(req.body.projectStart).toISOString(),
                    projectEnd : new Date(req.body.projectEnd).toISOString(),
                    location: req.body.location,
                    objective: req.body.objective,
                    manager: req.body.manager,
                    email: req.body.email,
                    phone: req.body.phone,
                    url: req.body.url,
                    tasks : newTaskList,
                    description: req.body.description,
                    author: authUser._id
                });
    
                if(addProject) {
                    return res.status(200).json( {
                    message: `El proyecto ${req.body.title} se ha registrado correctamente`
                 })
                }
            }else{
                return res.status(400).json( {
                    message: `Compruebe los campos requeridos`
                 })  
            }

            return res.status(500).json( {
                message: `Ha ocurrido un error, no se ha podido registrar el proyecto.`
             })

        }catch(error){
            return res.status(500).json( {
                message: `Ha ocurrido un error, no se ha podido registrar el proyecto.`
             })
        }
           
            break;
        case "GET":

            const filter = Object.entries(req.query).reduce((prev,curr)=>{
                if (curr[0] === "page") return prev; // Early return


                let filterExp;

                if(Array.isArray(curr[1])){
                    filterExp = { 
                        $all: curr[1]
                    }

                    // filterExp = curr[1]
                }else{
                    filterExp = new RegExp(curr[1], "i")
                     
                }
                return{...prev, [curr[0]]: filterExp}
            }, {})
            
             //Retornamos únicamente proyectos
            const numItems = 8;

            const page  = +req.query.page || 1;



            // const cursor = projects.find({})
            // let allValues = await cursor.toArray()
            let listProject = await projects.find(filter, {limit: numItems, skip: numItems * (page - 1)}).toArray()
            const totalDocuments = await projects.countDocuments(filter);

            const totalPages = Math.ceil(totalDocuments / numItems);

            let nextPage = null;

            if (page + 1 <= totalPages) {
                nextPage = page + 1;
            }

            let prevPage = null;

            if (page - 1 >= 1) {
                prevPage = page - 1;
            }
            const response = {
                projects: listProject,
                page,
                nextPage,
                prevPage
            }

            await declareHeaders()
           
            return res.json(response)
            
            break;
        case "HEAD": {
            await declareHeaders()
            return res.send()

            break;
        }
        default:
            res.status(405).json({message: "Invalid method"})
    }
   
}