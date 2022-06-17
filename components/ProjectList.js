import ProjectItem from './ProjectItem';
import styles from "../styles/ProjectList.module.css"
import item from "../styles/ProjectItem.module.css"
import { useCallback, useRef } from 'react';


// function formatTime(time) {
//   const auxSeconds = Math.floor(time / 1000);
  
//   const days =  Math.floor(auxSeconds / (60 * 60 * 24)); // 24h --> 1d
//   const hours =  Math.floor((auxSeconds / (60 * 60)) % 24); //60min -> 1h
//   const minutes =  Math.ceil((auxSeconds / 60) % 60) ; // 60s -> 1min



//   const dateString = `${days > 0 ? days + "d" : ""} `
//     + `${hours > 0 ? hours + "h" : ""} `
//     + `${minutes > 0 ? minutes + "min" : ""}`

//   return dateString;
// }

function computeStatus(project) {
  const startDate = new Date(project.projectStart);
  const endDate = new Date(project.projectEnd);

  const now = new Date();

  let status;
  if ( startDate < now && now < endDate ) {
    status = "activo";
  } else if (endDate < now) {
    status = "finalizado";
  } else {
    status = "pendiente";
  }

  return status;

}


export default function ProjectList({ projects, lastOnScreen, preventScroll}) {

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
    <div className={styles["list-container"]}>

      <div className={styles.list} >


        {projects.length ?
          //!!poner un spinner por si tarda la peticion

          projects.map((project, index) => {

            const status = computeStatus(project);


            const statusColors = {
              pendiente: "#fcc267",
              activo: "#63b179",
              finalizado: "#de4343"
            }
            const statusColor = statusColors[status];


            if (index === ( projects.length - 3)) {
              return <ProjectItem key={index} project={project} className={item.container} >
                {project => (

                  <div key={project.id} className={item.container} ref={lastElementRef} >

                    <div className='row justify-content-center'>
                      <div className={`${item.title} col `}>{project.title}</div>
                      <div className='col-1' style={{color: statusColor}}><abbr title={status}><i className="fas fa-circle"></i></abbr></div>
                    </div>
            

                    <div className={item.location}>
                      <i className={`${item.icon} fas fa-map-marker-alt`}></i>
                      <div className={item.ubi}>{project.location}</div>
                    </div>

                      <div className={styles["fields"]}>
                      {project.field.map(f => (
                       
                       <div className={styles["field-name"]}>{f}</div>))}
                      </div>



                    

                  </div>
                )}

              </ProjectItem>
            } else {
              return <ProjectItem key={index} project={project} className={item.container} >
                {project => (

                  <div key={project.id} className={item.container}>

                    <div className='row justify-content-center'>
                      <div className={`${item.title} col `}>{project.title}</div>
                      <div className='col-1' style={{color: statusColor}}><abbr title={status}><i className="fas fa-circle"></i></abbr></div>
                    </div>
                      

                    <div className={item.location}>
                      <i className={`${item.icon} fas fa-map-marker-alt`}></i>
                      <div className={item.ubi}>{project.location}</div>
                    </div>

                      <div className={styles["fields"]}>
                      {project.field.map(f => (
                       <div className={styles["field-name"]}>{f}</div>))}
                      </div>
                     
                  </div>
                )}

              </ProjectItem>
            }
          }


          )
          :
          <div className={styles["alert-container"]}>
            <div>Oh no!<i className={`bi bi-emoji-frown`}></i></div>
            <div>No se encuentran proyectos con esas características</div> 
          </div>
          

        }


      </div>

    </div>
  )
}
