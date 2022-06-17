import React, { useEffect, useState } from 'react'
import { useRouter } from "next/dist/client/router"
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import useAPI from '../hooks/useAPI'
import styles from '../styles/Home.module.css'
import image from '../images/homepage.svg'


export default function home() {

    const router = useRouter(); //Router hook de next.js
    const navigate = (path) => {
        router.push(path)
    }

    const fetchProjects = useAPI("./api/projects", true, "head");

    const [totalProjects, setTotalProjects] = useState()
   

    useEffect(()=>{
        if(fetchProjects.headers){
            const headers = fetchProjects.headers;
            setTotalProjects(headers["x-total-count"])
        }
       
    })

    return (
        <ProtectedRoute>
            <Layout>
                <div className={` ${styles.content} container-fluid`}>

                    <div className={`${styles.wrapper}  row `}>
                    <div className={`col-lg-6 col-sm-12 ${styles.text} m-auto`}> 
                        <p>
                        Descubre los <span className={styles["total-projects"]} onClick={() =>{navigate("/buscar")}}>{totalProjects} </span> proyectos de ciencia ciudadana disponibles en nuestro repositorio 
                        </p>
                    </div>
                    <img className={`col-lg-6 col-sm-12 m-auto ${styles.image}`} src={image.src} alt="Image"/>
                    </div>                   
                </div>
            </Layout>
        </ProtectedRoute>
            
        
    )
}
