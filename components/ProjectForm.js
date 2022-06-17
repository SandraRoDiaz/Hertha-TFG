import React, { useContext, useState, useEffect } from 'react'
import { useRouter } from "next/dist/client/router"
import styles from '../styles/ProjectForm.module.css'
import Tasks from "./Tasks";
import { ToastContainer, toast } from 'react-toastify'
import authProvider from '../providers/authProvider';
import useAPI from '../hooks/useAPI'
import Select from "react-select"

const options = [
    { value: 'Animales', label: 'Animales' },
    { value: 'Arqueología', label: 'Arqueología' },
    { value: 'Arquitectura', label: 'Arquitectura' },
    { value: 'Astronomía', label: 'Astronomía' },   
    { value: 'Biología', label: 'Biología' },
    { value: 'Biotecnología', label: 'Biotecnología' },
    { value: 'Ciencias sociales', label: 'Ciencias sociales' },
    { value: 'Clima', label: 'Clima' },
    { value: 'Creación digital', label: 'Creación digital' },
    { value: 'Cultura', label: 'Cultura' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Energía', label: 'Energía' },
    { value: 'Humanidades', label: 'Humanidades' },
    { value: 'Ingeniería', label: 'Ingeniería' },
    { value: 'Matemáticas', label: 'Matemáticas' },
    { value: 'Medioambiente', label: 'Medioambiente' },
    { value: 'Química', label: 'Química' },
    { value: 'Salud', label: 'Salud' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Otro', label: 'Otro' }
]


let MultiValueContainer = (props) => {
    return (
        <span style={{ backgroundColor: "white" }} title={props.label}>
            <span> {props.children[0]} </span>
        </span>
    );
};


function checkError(name, value) {
    // const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/
    const phoneRegex = /^(?:[6|8|9]{1})*[0-9]{8}$/
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+){1}$/;
    const urlRegex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    if (!value) {
        return true;
    }else if (name === "email") {
        return !emailRegex.test(value)
    }else if (name === "phone") {
        return !(value.length === 9 && phoneRegex.test(value))
    }else if(name === "url") {
        return !urlRegex.test(value)
    }
}

export default function ProjectForm({ project }) {

    const router = useRouter(); //Router hook de next.js
    const currentPath = router.pathname;
    const navigate = (path) => {
        router.push(path)
    }


    const projectAPI = useAPI("/api/projects", false);
    const { user } = useContext(authProvider);


    //LIFTING THE STATE UP 
    const [isReadOnly, setIsReadOnly] = useState(true)


    const [data, setData] = useState({
        title: "",
        field: [],
        projectStart: "",
        projectEnd: "",
        location: "",
        objective: "",
        description: "",
        // información persona o entidad responsable del proyecto
        manager: "",
        email: "",
        phone: "",
        url: "",
        tasks: [],
        author: ""
    })

    //validaciones
    const [errors, setErrors] = useState({
        email: false,
        phone: false, 
        url: false
    })

    //Clonamos la informacion del proyecto en el formulario
    useEffect(() => {

        const filled = { ...data }
        //aqui no entran las tasks
        for (const prop in project){
            if(prop === "projectStart" || prop === "projectEnd"){
                filled[prop] = project[prop].split('.')[0]
            }
            else if (project[prop] instanceof Array) {
                filled[prop] = [...project[prop]];
            } else {
                filled[prop] = project[prop] || ""
            }

        }
        //Guardamos los datos clonados en el estado
        setData(filled)

    }, [])

    useEffect(() => {
        if (!project || user._id === project.author) {
            setIsReadOnly(false);
        }
    }, [])

    useEffect(() => {
        
        if (projectAPI.data && !projectAPI.isLoading) {
            toast.success(projectAPI.data.message)
            setTimeout(()=>{navigate("/editar")}, 6000);
            
        } else if (projectAPI.error && !projectAPI.isLoading) {
            if (projectAPI.error.response.status === 400) {
                toast.warn(projectAPI.error.response.data.message)
            } else {
                toast.error(projectAPI.error.response.data.message)
            }
        }
    }, [projectAPI.isLoading])

    const handleChange = e => {
        const value = e.target.value;
        const name = e.target.name
        setData({ ...data, [name]: value })
        setErrors({ ...errors, [name]: checkError(name, value) })
    }

    const handleSelectChange = (val, extra) => {
        setData({ ...data, [extra.name]: val.map(v => v.value) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.title !== "" && data.objective !== "" && data.field.length !== 0 && data.location !== "" && data.description !== "" && data.projectStart !=="" && data.projectEnd !=="") {
            const payload = data; 
            if (project) {
                //put
                projectAPI.trigger.put(payload, {
                    relativeTo: `/${project._id}`
                })
                
            } else {
                //post
                projectAPI.trigger.post(payload)
                handleClean()
                
                
            }
        }else{
            toast.warn(`Comprueba los campos requeridos`)
        }

    }

    const setTasks = (tasks) => {
        setData({ ...data, tasks });
    }

    const handleClean = () => {

        const cleanData = {
            title: "",
            field: [],
            projectStart: "",
            projectEnd: "",
            location: "",
            objective: "",
            description: "",
            manager: "",
            email: "",
            phone: "",
            url: "",
            tasks: []
        }

        setData(cleanData);
    }


    const selectedOptions = options.filter(element => data.field.includes(element.value));

    let SingleValue = (props) => {
        return (
            <span style={{ backgroundColor: "blue" }} title={props.label}>
                <span> {props.children} </span>
            </span>
        );
    };




    return (


        <div className={styles["form-container"]}>


            {/* <form className="bg-light w-75 p-4 m-auto shadow rounded"  */}
            <form className={styles["form"]}
                onSubmit={handleSubmit}
                noValidate>
                <div className='row'>
                    {/* LADO IZQUIERDO */}
                    <div className='col-md-6'>

                        {/* Titulo */}
                        <div className='mb-3'>
                            <label htmlFor="title" className="form-label">Título <span className={styles["required-field"]}>*</span></label>
                            <input
                                className={`form-control ${styles.input}`}
                                type="text"
                                name="title"
                                noValidate
                                onChange={handleChange}
                                value={data.title}
                                required={true}
                                readOnly={isReadOnly}
                            />
                        </div>


                        {/* Ámbito*/}
                        <div className="mb-3" >

                            <label htmlFor="field" className="form-label">Ámbito <span className={styles["required-field"]}>*</span></label>
                            <Select className={styles.input} placeholder="Selecciona uno o más ámbitos" name="field" components={isReadOnly && { MultiValueContainer }} options={options} isMulti={true} value={selectedOptions} onChange={handleSelectChange} isOptionSelected isDisabled={isReadOnly} />
                        </div>

                        {/* Fechas */}

                        <div className={`row  ${styles.input}`}>


                            {/* Inicio */}
                            <div className='col-md-6'>
                                <label htmlFor="projectStart" className="form-label">Fecha de inicio <span className={styles["required-field"]}>*</span></label>
                                <input
                                    className={`form-control ${styles.input}`}
                                    type="datetime-local"
                                    name="projectStart"
                                    noValidate
                                    value={data.projectStart}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                />
                            </div>

                            {/* Termina */}
                            <div className='col-md-6'>
                                <label htmlFor="projectEnd" className="form-label">Finaliza en <span className={styles["required-field"]}>*</span></label>
                                <input
                                    className={`form-control ${styles.input}`}
                                    type="datetime-local"
                                    name="projectEnd"
                                    noValidate
                                    value={data.projectEnd}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                />
                            </div>

                        </div>

                        {/* Objetivo */}
                        <div >
                            <label htmlFor="objetive" className="form-label ">Objetivo <span className={styles["required-field"]}>*</span></label>
                            <input
                                className={`form-control ${styles.input}`}
                                type="text"
                                name="objective"
                                noValidate
                                value={data.objective}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                            />
                        </div>


                        {/* Tareas */}
                        <div  >

                            <Tasks tasks={data.tasks} setTasks={setTasks} isReadOnly={isReadOnly} />
                        </div>

                        {/*Ubicación*/}

                        <div>
                            <label htmlFor="location" className="form-label">Ubicación <span className={styles["required-field"]}>*</span></label>
                            <input
                                className={`form-control ${styles.input}`}
                                type="text"
                                name="location"
                                noValidate
                                value={data.location}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                            />
                        </div>


                           {/* URL del proyecto */}
                           <div className='mb-3'>
                            <label htmlFor="url" className="form-label">Página web</label>
                            { !isReadOnly 
                                ?
                                <input
                                className={`form-control ${styles.input}`}
                                type="text"
                                name="url"
                                noValidate
                                onChange={handleChange}
                                value={data.url}
                                required
                                readOnly={isReadOnly}
                            />
                            :
                            <div className="form-control" readOnly={isReadOnly}>
                                <a className={`${styles.link} ${styles.links}`} target="_blank" href={"http://" + data.url}>{data.url}</a>
                            </div>
                            
                            }
                        </div>
                        <div className={styles.validation}>
                                {errors.url ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>Ingresa una página de web válida</span></i> : ""}
                        </div>



                        <hr className={styles.line}></hr>
                        {/* Entidad o persona responsable del proyecto */}

                        
                            <label htmlFor="manager" className={`form-label ${styles["contact-info"]}`}>Entidad o persona responsable del proyecto</label>
                            <div className=''>
                                <label htmlFor="manager" className="form-label">Nombre</label>
                                <input
                                    className={`form-control ${styles.input}`}
                                    type="text"
                                    name="manager"
                                    noValidate
                                    value={data.manager}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                />
                            </div>
                           
                            <div className=''>
                                <label htmlFor="email" className="form-label">Email</label>
                                { !isReadOnly 
                                ?
                                <input
                                className={`form-control ${styles.input}`}
                                type="text"
                                name="email"
                                noValidate
                                onChange={handleChange}
                                value={data.email}
                                required
                                readOnly={isReadOnly}
                            />
                            :
                            <div className={`form-control ${styles.links} ${styles.input}`} readOnly={isReadOnly}>
                                <a className={styles.links} target="_blank" href={"mailTo:" + data.email}>{data.email}</a>
                            </div>
                            
                            }

                            </div>
                            <div className={styles.validation}>
                                {errors.email ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>Ingresa un correo electrónico válido</span></i> : ""}
                            </div>
                           
                            <div className=''>
                                <label htmlFor="phone" className="form-label font-weight-bold">Teléfono</label>
                                <input
                                    className={`form-control ${styles.input}`}
                                    type="tel"
                                    name="phone"
                                    noValidate
                                    value={data.phone}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                />
                            </div>
                            <div className={styles.validation}>
                                {errors.phone ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>Nombre inválida</span></i> : ""}
                            </div>
                        


                       
                     

                    </div>


                    

                    {/* LADO DERECHO */}
                    <div className='col-md-6'>
                        <div className='mb-3'>
                            <label htmlFor="description" className="form-label">Descripción <span className={styles["required-field"]}>*</span></label>
                            <textarea
                                className={`${styles.description} form-control`}
                                rows="10"
                                cols="50"
                                type="text"
                                name="description"
                                noValidate
                                value={data.description}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                            ></textarea>

                        </div>



                        {
                            (!isReadOnly)
                                ?
                                (!project)
                                    ?
                                    <div className={styles["button-container"]}>
                                        <button className={styles["cancel-button"]} type="button" onClick={()=>handleClean()}>Limpiar</button>
                                        <button className={`${styles.create}`} type="submit">Crear</button>
                                    </div>
                                    :
                                    <div className={styles["button-container"]}>
                                        <button className={styles["cancel-button"]} type="button" onClick={()=>navigate("/editar")}>Cancelar</button>
                                        <button className={`${styles.create}`} type="submit">Actualizar</button>
                                    </div>
                                :
                                null
                        }


                    </div>

                </div>

            </form>



            <ToastContainer></ToastContainer>
        </div>






    )
}
