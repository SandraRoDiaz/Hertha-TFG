import axios from 'axios'
import React, { useState, useRef, useEffect, useContext } from 'react'
import AccessLayout from '../components/AccessLayout'
import { ToastContainer, toast } from 'react-toastify';
import styles from "../styles/LoginForm.module.css"
import { useRouter } from 'next/router';
import authProvider from '../providers/authProvider';


function checkError(name, value) {

    const passwordRegex = RegExp(/^(?=.*[A-Z])(?=.*\d)[\w]{8,}/);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;


    if (!value) {
        return true;
    }
    if (name === "password") {
        return !passwordRegex.test(value)
    } else if (name === "email") {
        return !emailRegex.test(value)
    }
}

export default function login() {

    const { user, setUser } = useContext(authProvider)

    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        email: false,
        password: false,
    })
    

    const toggleRef = useRef(null);
    const passwordRef = useRef(null);
    const router = useRouter();

    //comprobamos si el usuario ya tiene un token guardado, si lo tiene no le mostramos la pagina de login directamente se le redirecciona a su cuenta
   useEffect(async()=>{
    if (!user){
        const storedAuth = localStorage.getItem("auth");

        if (storedAuth) {
            const auth = JSON.parse(storedAuth);
            if (auth && auth.token) {
                const {data: userLogged} = await axios.get("/api/logged", {
                    headers: {
                        "Authorization": `Bearer ${auth.token}`
                    }
                });
                setUser(userLogged)
                router.push("/home")
            }
        }
    }

   }, [user]);

    if(user){
        return null;
    }


    const handleChange = (e) => {

        const input = e.target.value;
        const name = e.target.name

        setUserData({ ...userData, [name]: input })
        setErrors({ ...errors, [name]: checkError(name, input) })

    }

    const handleSubmit = async (e) => {
        e.preventDefault(); //evita que la página se renderice de nuevo
        if (userData.email !== "" && userData.password != "") {
            const payload = { ...userData }

            try {
                const response = await axios.post('api/loginUser', payload);
                const { data } = response;
                setUser(data);
                router.push("./home")

            } catch (e) {
                const message = e.response.data.message
                toast.error(message)
            }

        } else {
            toast.warn("Revise los campos")
        }

    }


    const isShown = () => {
        passwordRef.current.type = passwordRef.current.type === "password" ? "text" : "password";
        toggleRef.current.className = `${styles.toggle} bi ` +
            (toggleRef.current.className.includes("bi-eye-fill") ? "bi-eye-slash-fill" : "bi-eye-fill")
    }

    return (

        <AccessLayout>

            <form className={`${styles.form} m-auto`} onSubmit={handleSubmit} noValidate>
                <h4 className={`${styles.title} mb-3`}>Bienvenido</h4>
                <div className="mb-3">
                    <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                    <input
                        className={styles.input}
                        // placeholder="username"
                        type="email"
                        name="email"
                        noValidate
                        onChange={handleChange}
                        value={userData.email}
                    />
                    <div className={styles.validation}>
                        {errors.email ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>Ingrese un correo electrónico válido, por ejemplo: usuario@gmail.es</span></i> : ""}
                    </div>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password" className={styles.label}>Contraseña</label>
                    <div className={styles["password-container"]}>
                        <input
                            ref={passwordRef}
                            type="password"
                            className={styles.input}
                            // placeholder="contraseña"
                            name="password"
                            noValidate
                            onChange={handleChange}
                            value={userData.password}
                        />

                        <i ref={toggleRef} className={`${styles.toggle} bi bi-eye-fill`} onClick={isShown}></i>

                    </div>
                    <div className={styles.validation}>
                        {errors.password ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>La contraseña debe contener como mínimo 8 carácteres, entre ellas una mayúscula y un número</span></i> : ""}
                    </div>

                    <div className='mb-3 d-flex justify-content-center'>
                        <button className={`${styles.signin} ${styles["pulse-anim"]}`} type="submit">Entrar</button>
                    </div>

                </div>
            </form>
            <ToastContainer />
        </AccessLayout>
    )
}
