import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from "next/dist/client/router"
import ProjectItem from './ProjectItem';
// import item from "../styles/ProjectItem.module.css"
import item from "../styles/OwnProjects.module.css"
import styles from "../styles/ProjectList.module.css"
import authProvider from '../providers/authProvider';
import { ToastContainer, toast } from 'react-toastify'
import { Modal, Button } from 'react-bootstrap';
import useAPI from '../hooks/useAPI'


export default function ProjectListEditable({ projects, onDeleteProject , lastOnScreen}) {


  const projectAPI = useAPI("/api/projects", false)

  const router = useRouter(); //Router hook de next.js
  const currentPath = router.pathname;

  const navigate = (path) => {
      router.push(path)
  }

  const [show, setShow] = useState(false);
  const projectToDelete = useRef(null)

  const showModal = (e, project) => {
    e.stopPropagation()
    setShow(true)
    projectToDelete.current = project;
  }
  const handleCancel = (e) => {

    setShow(false)
  }

const removeProject = (e) =>{
  e.stopPropagation();

  projectAPI.trigger.delete({
    relativeTo: `/${projectToDelete.current._id}`
  })
  setShow(false)

}

useEffect(() => {
  if (projectAPI.data && !projectAPI.isLoading) {
      toast.success(projectAPI.data.message)
  }
}, [projectAPI.data])

useEffect(()=>{
if(projectAPI.data){
  onDeleteProject(projectToDelete.current._id);
  projectToDelete.current = null
}else if(projectAPI.error){
  projectToDelete.current = null
}

},[projectAPI.data,projectAPI.error])

  const observer = useRef();

  const lastElementRef = useCallback((element) => {

    if (observer.current) {
      observer.current.disconnect();
    }

    if (element) {
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          lastOnScreen();
        }
      })  
  
      observer.current.observe(element);
    }
  }, [projects]);


  return (

    <div className={item["own-project-container"]}>
      <div className={item["own-projects-grid"]}>

        {projects.length ?
          projects.map((project, index) =>

            <ProjectItem key={index} project={project} className={item.container} >
              {project => (

                <>
                  <div className={item.container} ref={index === projects.length - 3 ? lastElementRef : undefined} >
                    <div className={item.title}>{project.title}</div>

                    <div className={`${item["location-container"]} row`}>
                      <i className={`${item.icon} fas fa-map-marker-alt col-2`}></i>
                      <div className={`${item.location} col`}>{project.location}</div>
                    </div>
                    {/* <div>Comienza {project.project.projectStart}</div>   */}
                    {/*      <div className={item.date}>Comienza en {daysLeft} días</div> */}
                    {/* <div className={item.date}>Comienza en {daysLeft2} días</div> */}
                    <div className={item["fields"]}>
                        {project.field.map(f => (
                          <div className={item["field-name"]}>{f}</div>))}
                    </div>
                  </div>
                  <div className={item["container-fold"]}>
                    <button className={item["delete-project-btn"]} onClick={(e) => showModal(e, project)}>Borrar<i className="fas fa-trash"></i></button>
                  </div>
                </>


              )}

            </ProjectItem>
          )
          :
          <div  className={item.wrapper}>
             <div>Oh no!<i className={`bi bi-emoji-frown`}></i></div>
             <div>No tienes proyectos, prueba a compartir tu propio proyecto de ciencia ciudadana</div>
             <button onClick={()=>{navigate("/crear")}}>Aquí</button>
          </div>
       
          // "No tienes proyectos, create un proyecto"
        }
        <ToastContainer></ToastContainer>
      </div>

          <Modal show={show} onHide={handleCancel} keyboard={false} >
            <Modal.Header closeButton>
              <Modal.Title>¿Seguro que quieres borrar?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancel}>
                No
              </Button>
              <Button variant="primary" onClick={removeProject}>
                Sí
              </Button>
            </Modal.Footer>
          </Modal>
  

    </div>

  )


}