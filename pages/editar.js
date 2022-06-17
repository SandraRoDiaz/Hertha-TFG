import React, { useState, useEffect, useContext, useRef } from 'react'
import Layout from '../components/Layout'
import ProjectListEditable from '../components/ProjectListEditable';
import authProvider from '../providers/authProvider';
import ProtectedRoute from '../components/ProtectedRoute';
import useAPI from '../hooks/useAPI'
import styles from "../styles/OwnProjects.module.css"


export default function editar() {

        const { user } = useContext(authProvider)

        const fetchProjects = useAPI("./api/projects", false);

        const auxSpinner = useRef(true);

        const [projects, setProjects] = useState([]);

        const onDeleteProject = async (id) => {
                let filteredProjects = projects.filter(project => project._id !== id)
                setProjects(filteredProjects)
        }

        const fetchMyProjects = () => {
                if(!projects.length || fetchProjects.data?.nextPage){
                        const params = {
                                author: user._id, 
                                page: fetchProjects.data?.nextPage
                        }
                        fetchProjects.trigger.get(params)
                }
                
        }

        useEffect(async () => {

                //Por defecto coger la lista entera, sin filtros
                //si se ha identificado un usuario --> ha hecho login
                if (user) {
                       fetchMyProjects()
                }


        }, [user])

        useEffect(async ()=>{
        if (user && !fetchProjects.loading && fetchProjects.data) {
                setProjects([...projects, ...fetchProjects.data.projects])
                auxSpinner.current = false;
        }

        },[fetchProjects.data])


        const lastOnScreen = () => {
                fetchMyProjects()

	}


        if (fetchProjects.isLoading || auxSpinner.current) {
                return (
                        <ProtectedRoute>
                                <Layout>
                                        <div className={styles["spinner-container"]}>
                                                <div className={`spinner-border ${styles.spinner}`} role="status">
                                                        <span className="sr-only">Loading...</span>
                                                </div>
                                        </div>
                                </Layout>
                        </ProtectedRoute>
                )
        }
            
            

        return (
                <ProtectedRoute>
                        <Layout>
                                <ProjectListEditable onDeleteProject={onDeleteProject} projects={projects} lastOnScreen={lastOnScreen}></ProjectListEditable>
                        </Layout>
                </ProtectedRoute>


        )
}