
import { useEffect, useMemo } from 'react';
import styles from '../styles/Tasks.module.css'

function tasks({tasks, setTasks, isReadOnly}) {

    // Creamos el array de tareas
    //! Cambiar el estado a lifting the state up


    const addNewTask = (e) => {

        // tasks.push("")
        // setTasks([...tasks])

        setTasks([...tasks, ""]);
    }

    const editTask = (index, value) => {
        // tasks[index] = value;
        // setTasks([...tasks])
        setTasks(tasks.map((v, i) => i === index ? value : v));
    }

    const removeTask = (index) => {
        setTasks(tasks.filter((v, i) => i !== index));
    }


    const cleanTasks = () => {
        setTasks([]);
    }


    const tasksElements = useMemo(() => {

        return tasks.map((v, i) => {
            return (
                <div key={i} className={`${styles.tasks} row w-75 align-items-center`}>


                    <input
                        className ='form-control col'
                        value={v}
                        onChange={(e) => { editTask(i, e.target.value) }}
                        readOnly={isReadOnly}
                        />
                

                    { !isReadOnly &&
                         <i className={`${styles.remove} fas fa-times col-2`} onClick={(e) => {
                            removeTask(i)
                        }}></i>
                        
                    }
           
                </div>
            )
        })

    }, [tasks])

    return (
        <div>

           <div className="row align-items-center">
                <label htmlFor="projectTasks" className="form-label col-2 m-0">Tareas</label>
                {
                    !isReadOnly &&
                     <i  onClick={addNewTask} className={`${styles.button} bi bi-plus-circle-fill col-1`}></i>
                }
               
           </div>
                
           
            
            <ul className="d-flex flex-column align-items-center" >
                {
                    tasksElements
                }
            </ul>
            <div className="d-flex justify-content-end">
                {
                    (!isReadOnly && tasks != "") &&
                    <div className={`${styles["clean-button"]} `} onClick={(cleanTasks)}>Eliminar tareas</div>
                }
            
            </div>
            
        </div>
    )
}


export default tasks;