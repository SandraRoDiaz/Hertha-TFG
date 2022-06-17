import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken"

let uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
export default async function project(req, res) {

    try {

        const auth = req.headers.authorization;
        const token = auth.split(" ")[1];
        const authUser = await jwt.verify(token, process.env.SECRET);


        const connection = await client.connect();
        const db = connection.db("citizen-science");
        const projects = db.collection("projects");

        const { projectID } = req.query;
        const project = await projects.findOne({
            _id: projectID
        })

        // si la persona logeada es igual al autor del proyecto 
        //tiene permiso para borrar o actualizar el proyecto seleccionado
        if (authUser._id === project.author) {
            switch (req.method) {
                case "DELETE":
        
                    let removedProject = await projects.deleteOne({
                        _id: projectID
                    });


                    if (removedProject) {
                        return res.json({
                            message: `El proyecto se ha borrado correctamente`,
                            project: removedProject.value
                        })
                    }
                    break;

                case "PUT":
                    const body = req.body;

                    if (body.title!=="" && body.field!=="" && body.projectStart!=="" && body.projectEnd!=="" && body.objective!=="" && body.location!=="" && body.description!=="") {
                        let updatedProject = await projects.updateOne(
                            { _id: projectID },
                            {
                                $set: body
                            });

                        if (updatedProject) {
                            return res.json({
                                message: `El proyecto se ha actualizado correctamente`
                            })
                        }
                    } else {
                        return res.status(400).json({
                            message: `Comprueba los campos requeridos antes de modificar el proyecto`
                        })
                    }
                    break;

                default:

                    return res.status(405).json({ "error": "Method not allowed" })

            }
            return res.json({ ok: "Ok" })
        } else {
            return res.status(403).json({
                error: "No estas autorizado"
            })

        }
    } catch (e) {
        return res.status(401).json({
            error: "No estas autorizado"
        })
    }

}

