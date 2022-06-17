import React from 'react'
import {MongoClient} from "mongodb"
import Layout from '../../components/Layout'
import ProjectForm from '../../components/ProjectForm'
import ProtectedRoute from '../../components/ProtectedRoute'


export async function getServerSideProps(context) {
   
    let uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);
    
    const connection = await client.connect();
    const db =  connection.db("citizen-science");
    const projects = db.collection("projects");
    const project = await projects.findOne({_id: context.params.projectID});
    return {
      props: {project}, // will be passed to the page component as props
    }
  }

export default function Details({project}) {
    return (
      <ProtectedRoute>
         <Layout>
          <ProjectForm project = {project}></ProjectForm>
        </Layout>
      </ProtectedRoute>
       
    )
}
