import React from 'react'
import styles from "../styles/Topbar.module.css"
import { useRouter } from "next/dist/client/router"
import authProvider from '../providers/authProvider';
import { useContext } from 'react'
import { useMobile } from "../hooks/useMobile"
import image from '../images/logo.png'

export default function Topbar() {

    const { user, removeUser } = useContext(authProvider)


    const router = useRouter(); //Router hook de next.js
    const navigate = (path) => {
        router.push(path)
    }

    const isMobile = useMobile();

    const exit = (e) => {

        removeUser();
        navigate("/login")
    }


    return (
        <div className={styles.topbar}>

            {isMobile &&

                <img className={`${styles.logo}`} src={image.src} alt="Logo" onClick={() => navigate("/home")} />

            }
            <div>{user ? user.username : null}</div>
            <div className={styles["close-session"]} onClick={exit}>Salir</div>



        </div>

    )
}
