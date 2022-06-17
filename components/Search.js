import React, { useState } from 'react'
import styles from "../styles/Search.module.css"
import { useMobile } from "../hooks/useMobile"
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


export default function Search({ handleFilter }) {
    const isMobile = useMobile();
    const [toggleFilter, setToggleFilter] = useState(false)

    const [filter, setFilter] = useState({
        title: "",
        fields: [],
        location: ""
    })

    const handleChange = e => {
        setFilter({ ...filter, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFilter(filter)
    }

    const handleReset = (e) => {
        const reset = {
            title: "",
            fields: [],
            location: ""
        }
        setFilter(reset)
        handleFilter(reset)

    }

    const handleSelectChange = (val,extra) => {
        // setData({...data, [extra.name]: val.map(v=>v.value)})
        // setFilter({...filter, fields:[...filter.fields, ...val.map(v => v.value)]})
        setFilter({...filter, fields : val.map(v=>v.value)})
    }

    const selectedOptions = options.filter(element => filter.fields.includes(element.value))


    return (
        <>
        <button className={`${styles.toggle}`} onClick={() => { setToggleFilter(!toggleFilter) }}><i className={toggleFilter ? "fa fa-times" : "fa fa-search"}></i></button>
        {
            toggleFilter && 

             <form className={styles["filter-container"]} onSubmit={handleSubmit}>

            


            {/* <select className={`${styles.fields} col-1 input`} name="field" value={filter.field} onChange={handleChange}>
                <option value="">Vacío</option>
                <option value="Animales">Animales</option>
                <option value="Arqueología">Arqueología</option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Astronomía">Astronomía</option>
                <option value="Biología">Biología</option>
                <option value="Biotecnología">Biotecnología</option>
                <option value="Ciencias sociales">Ciencias sociales</option>
                <option value="Clima">Clima</option>
                <option value="Creación digital">Creación digital</option>
                <option value= "Cultura">Cultura</option>
                <option value="Educación">Educación</option>
                <option value="Energía">Energía</option>
                <option value="Humanidades">Humanidades</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Medioambiente">Medioambiente</option>
                <option value="Química">Química</option>
                <option value="Salud">Salud</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Otro">Otro</option>

            </select> */}

            <div className={styles.wrapper}>

            {/* Título o palabra clave */}

            <input
            className={`${styles.title} ${styles.input} col-10 `}
            type ="text"
            placeholder='¿Qué estás buscando?'
            name="title"
            onChange={handleChange}
            value={filter.title} />


           

            {/* Ámbitos  */}

            <Select  placeholder="Selecciona..." name="field" options={options} isMulti={true} value={selectedOptions} onChange={handleSelectChange} isOptionSelected /> 


              {/* Ubicación */}
           <input
            className= {`${styles.location} col-6 ${styles.input}`}
            type ="text"
            placeholder='¿Dónde?'
            name="location"
            onChange={handleChange}
            value={filter.location} />
            </div>

            
            <div className='row w-90'>
            
            <button className={`${styles.lupa}`}><i className="fa fa-search"></i></button>
            <button className={`${styles.icon} col-2`} type="reset" onClick={handleReset}><i className="fa fa-eraser"></i></button>
            </div>
            


            {/* {isMobile &&
            <div className={`row ${styles.buttons}`}>
                <button className='col-8' onClick={handleSubmit}><i className="fa fa-search"></i></button>
                <button className='col-2' onClick={handleReset}><i className="fa fa-eraser"></i></button>
            </div>
            } */}


        </form>
        }
        </>
        


       

    )

}
