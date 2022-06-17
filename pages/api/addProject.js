import {MongoClient} from "mongodb";

let uri = "mongodb://localhost:27017";

//crea un nuevo MongoClient
const client = new MongoClient(uri);

export default async function handler(req, res) {


  const connection = await client.connect();
  const db =  connection.db("citizen-science");
  const projects = db.collection("projects");
  
  

    if (req.method !== "POST") {
      res.status(404).json({message: "This endpoint only admits POST request"})
    }
    
    let insertProject = await projects.insertOne({
      title: req.body.title,
      description: req.body.description,
      startDate: req.body.startDate
    });
  
    res.status(200).json("Ok");
  }