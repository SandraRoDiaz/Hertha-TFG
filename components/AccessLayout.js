import React, {useState} from 'react'
import {useRouter} from "next/dist/client/router"
import Footer from './Footer';
import styles from "../styles/AccessLayout.module.css"
import { useMobile } from "../hooks/useMobile"
import image from '../images/logo.png'


export default function AccessLayout(prop) {
    const [toggleMenu, setToggleMenu] = useState(false)

    const router = useRouter(); //Router hook de next.js
    const navigate = (path) =>{
        router.push(path)
    }

    const isMobile = useMobile();
    
    return (
        <div className={styles["access-container"]}>
            <nav className={styles.navbarContainer}>
                <img className={`${styles.logo}`} src={image.src} alt="Logo" onClick={() => navigate("/")}/>
                <ul className={styles.items}>
                    <li>
                        <button className={styles.btn}onClick={()=>navigate("login")}>Inicia Sesión</button>
                    </li>

                    <li >
                        <button className={styles.btn} onClick={()=>navigate("register")}>Registrarse</button>
                    </li>
                </ul>
            </nav>

            
               
                {isMobile &&
                
                <div className={styles["mobile-nav"]}>
                    <img className={`${styles.logo}`} src={image.src} alt="Logo" onClick={() => navigate("/")}/>
                    <button className={styles["hamburguer-icon"]} onClick={()=>setToggleMenu(!toggleMenu)}>
                    {toggleMenu ?<i className="bi bi-x"></i> : <i className="bi bi-list"></i>} 
                    </button>
                    {toggleMenu && 
                        <div className={styles["mobile-menu-container"]}>
                           
                                <button className={styles["nav-links"]} onClick={()=>navigate("login")}>Inicia Sesión</button>
                                <button className={styles["nav-links"]} onClick={()=>navigate("register")}>Registrarse</button>

                            
                        </div>
                    }         
                        
                </div>      
                
            }
                
            <div className={styles["container"]}>{prop.children}</div> 
            <Footer></Footer>
        </div>
       
    )
}
