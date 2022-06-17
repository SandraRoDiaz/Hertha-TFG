import React from 'react'
import styles from "../styles/Menu.module.css"
import { useRouter } from "next/dist/client/router"
import image from '../images/logo.png'

//Custom Hook to select the current page

export default function Menu() {
    const router = useRouter(); //Router hook de next.js
    const currentPath = router.pathname;
    const navigate = (path) => {
        router.push(path)
    }


    const checkActive = (currentPath, target, options) => {
        if ((!options || options.exact) && currentPath === target) {
            return styles.active
        } else if (options && !options.exact) {
            return currentPath.split("/")[1] === target.split("/")[1] ? styles.active : "";

        }
        else {
            return ""
        }
    }
    return (

        <div style={{background: "#0e547a", height: "100%"}}>
            <img className={`${styles.logo}`} src={image.src} alt="Logo" onClick={() => navigate("/home")}/>
            {/* <div className={styles.logo} onClick={() => navigate("/home")}>LOGO</div> */}
            <ul className={styles.menu}>
                <li className={`${styles["menu-item"]} ${checkActive(currentPath, "/home")}`} onClick={() => navigate("/home")}>
                    <p className={styles.button} >Inicio</p>
                    <i className={`${styles.icon} bi bi-house-door`}></i>
                </li>

                <li className={`${styles["menu-item"]} ${checkActive(currentPath, "/buscar" || "/proyecto")}`} onClick={() => navigate("/buscar")}>
                    <p className={styles.button} >Búsqueda</p>
                    <i className={`${styles.icon} fas fa-globe-europe`}></i>
                </li>


                <li className={`${styles["menu-item"]} ${checkActive(currentPath, "/crear")}`} onClick={() => navigate("/crear")}>
                    <p className={styles.button} >Crear proyecto</p>
                    <i className={`${styles.icon} bi bi-plus-circle`}></i>
                </li>

                <li className={`${styles["menu-item"]} ${checkActive(currentPath, "/editar")}`} onClick={() => navigate("/editar")}>
                    <p className={styles.button}>Modificar proyecto</p>
                    <i className={`${styles.icon} bi bi-pencil-square`}></i>
                </li>
                {/* <div className={`${styles["menu-item"]} ${checkActive(currentPath, "/proyecto", {exact:false})}`} onClick={()=>navigate("/home")}>
                    <li>
                        <p className={styles.button} >Inicio</p>
                    </li>
                    <i className={`${styles.icon} bi bi-house-door`}></i>
                </div> */}
            </ul>
        </div>

    )
}
