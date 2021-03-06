import React, { useState, useRef , useEffect, useContext} from 'react'
import AccessLayout from '../components/AccessLayout';
import styles from "../styles/RegisterForm.module.css";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Modal} from 'react-bootstrap';
import { useRouter } from 'next/router';
import authProvider from '../providers/authProvider';


function checkError(name, value) {

    const passwordRegex = RegExp(/^(?=.*[A-Z])(?=.*\d)[\w]{8,}/);

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;


    if (!value) {
        return true;
    }
    if (name === "password" || name === "confirmPassword") {
        return !passwordRegex.test(value)
    } else if (name === "email") {
        return !emailRegex.test(value)
    } else if (name === "username") {
        return value.length < 4
    }
}


export default function register() {

    const { user, setUser } = useContext(authProvider)
    const router = useRouter();

    const [show, setShow] = useState(false);

    const [checked, setChecked] = useState(false)

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [errors, setErrors] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    })

    const toggleRef = useRef(null);
    const toggle2Ref = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);


    //comprobamos si el usuario ya tiene un token guardado, si lo tiene no le mostramos la pagina de registro directamente se le redirecciona a su cuenta
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

    const validate = (e) => {
        setChecked(!checked)
    }

    const handleChange = (e) => {

        const input = e.target.value;
        const name = e.target.name

        setUserData({ ...userData, [name]: input })
        setErrors({ ...errors, [name]: checkError(name, input) })
    }

    const handleClean = () => {
        const cleanData = {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
        setUserData(cleanData)
        setChecked(false)
    }

    const handleCancel = (e) => {
        setShow(false)
      }

    const showPassword = (ref, toggle) => {
        ref.current.type = ref.current.type === "password" ? "text" : "password";
        toggle.current.className = `${styles.toggle} bi ` +
            (toggle.current.className.includes("bi-eye-fill") ? "bi-eye-slash-fill" : "bi-eye-fill")
    }


    const showModal = (e) =>{
        e.preventDefault()
        setShow(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Primero mirar si hay errores 

        if (errors.username === false && errors.email === false && errors.password === false && errors.confirmPassword === false
            && userData.username !== "" && userData.email !== "" && userData.password && userData.confirmPassword !== "" && checked === true) {


            if (userData.password === userData.confirmPassword) {
                const payload = { ...userData }


                try {
                    const response = await axios.post('/api/registerUser', payload)
                    const { data } = response;
                    toast.success(response.data.message)
                    handleClean()

                } catch (e) {
                    toast.error(e.response.data.message)
                }

            } else {
                toast.warn("Las contrase??as no coinciden")
            }

        } else {
            toast.warn("Revise los campos")
        }



    }



    return (
        <AccessLayout>

            <form onSubmit={handleSubmit} className={`${styles.form} m-auto`} >
                <h4 className={`${styles.title} mb-3`}>Crea tu cuenta</h4>
                <div className="mb-3">
                    <label htmlFor="username" className={styles.label}>Nombre</label>
                    <input className={styles.input}
                        // placeholder="Nombre de usuario"
                        type="text"
                        name="username"
                        noValidate
                        onChange={handleChange}
                        value={userData.username}
                    />
                    <div className={styles.validation}>
                        {errors.username ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>El nombre debe contener como m??nimo 4 car??cteres</span></i> : ""}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="username" className={styles.label}>Correo electr??nico</label>
                    <input className={styles.input}
                        // placeholder="Nombre de usuario"
                        type="text"
                        name="email"
                        noValidate
                        onChange={handleChange}
                        value={userData.email}
                    />
                    <div className={styles.validation}>
                        {errors.email ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>Ingrese un correo electr??nico v??lido, por ejemplo: usuario@gmail.es</span></i> : ""}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className={styles.label}>Contrase??a</label>

                    <div className={styles["password-container"]}>
                        <input className={styles.input}
                            // placeholder="Contrase??a"
                            ref={passwordRef}
                            type="password"
                            name="password"
                            noValidate
                            onChange={handleChange}
                            value={userData.password}
                        />
                        <i ref={toggleRef} className={`${styles.toggle} bi bi-eye-fill`} onClick={e => { showPassword(passwordRef, toggleRef) }}></i>
                    </div>

                    <div className={styles.validation}>
                        {errors.password ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>La contrase??a debe contener como m??nimo 8 car??cteres, entre ellas una may??scula y un n??mero</span></i> : ""}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className={styles.label}>Confirmar contrase??a</label>

                    <div className={styles["password-container"]}>

                        <input className={styles.input}
                            // placeholder="Contrase??a"
                            ref={confirmPasswordRef}
                            type="password"
                            name="confirmPassword"
                            noValidate
                            onChange={handleChange}
                            value={userData.confirmPassword}
                        />
                        <i ref={toggle2Ref} className={`${styles.toggle} bi bi-eye-fill`} onClick={e => { showPassword(confirmPasswordRef, toggle2Ref) }}></i>
                    </div>
                    <div className={styles.validation}>
                        {errors.confirmPassword ? <i className="bi bi-exclamation-circle"><span className={styles.errorMessage}>La contrase??a debe contener como m??nimo 8 car??cteres, entre ellas una may??scula y un n??mero</span></i> : ""}
                    </div>
                </div>

                <div className="form-check mb-3">
                    <input className="form-check-input"
                        type="checkbox"
                        checked={checked}
                        id="flexCheckDefault"
                        name="checkbox"
                        onChange={validate} ></input>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        He le??do y acepto la <span className = {styles.checkbox} onClick={showModal}>pol??tica de privacidad</span>
                    </label>
                </div>

                <button type="submit" className={`${styles.signup} ${styles["pulse-anim"]}`}>Registrarse</button>
            </form>
            <ToastContainer />


            <Modal show={show} onHide={handleCancel} keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Pol??tica de privacidad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                En cumplimiento con lo dispuesto en la <u>Ley Org??nica 15/1999, de Protecci??n de Datos de Car??cter Personal</u>,
                le informamos que los datos de car??cter personal que nuestros usuarios nos faciliten estar??n sometidos a lo dispuesto en la ley mencionada.
                <br></br>
                Estos datos son totalmente confidenciales y se utilizar??n m??todos de encriptaci??n de datos en la base de datos para salvaguardar las contrase??as.
                <br></br>
                Los datos aportados de forma voluntaria mediante el formulario de registro ser??n ??nicamente y exclusivamente utilizados con fines did??cticos internamente;
                 en ning??n momento, dichos datos ser??n compartidos o vendidos a terceros para otros fines. 
                <br></br>
                <br></br>
                <strong>??Qui??n es el responsable del tratamiento de los datos?</strong> 
                 <br></br>
                Persona responsable: Sandra Rodr??guez D??az 
                <br></br>
                Correo electr??nico: sandra.rodriguez06@estudiant.upf.edu 
                <br></br>
                <br></br>

                <strong>??Durante cu??nto tiempo tratamos los datos personales?</strong>
                <br></br>
                Dispondremos de la informaci??n personal de nuestros usuarios durante el proceso de desarrollo del Trabajo de Final de Grado de Sandra Rodr??guez D??az. 
                Una vez expuesto el TFG, todos los usuarios se borrar??n de nuestra base de datos por seguridad. <br></br>
                No obstante el usuario podr?? manifestar su derecho a supresi??n de dichos datos contact??ndonos por correo electr??nico a sandra.rodriguez06@estudiant.upf.edu .
                </Modal.Body>
            </Modal>
        </AccessLayout>



    )
}
