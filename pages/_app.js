import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';
import "../node_modules/@fortawesome/fontawesome-free/css/all.css"
import AuthProvider from "../providers/authProvider";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Modal, Button } from 'react-bootstrap';


function MyApp({ Component, pageProps }) {


  const [user, setUser] = useState(null);
  const [showCloseSession, setCloseSession] = useState(false);
  const router = useRouter();


  const storeUser = (user) => {
    localStorage.setItem("auth", JSON.stringify(user.authorization));
    setUser(user);
  }

  const removeUser = () => {
    localStorage.removeItem("auth")
    setUser(null)
  }

  const handleCloseSesion = () => {
    removeUser();
    router.push("/login");
    setCloseSession(false);
  }

  const displayCloseSession = () => {
    setCloseSession(true);
  }

  const providerValue = { user, setUser: storeUser, removeUser, displayCloseSession };

  return (
    <AuthProvider.Provider value={providerValue}>
      <Component {...pageProps} />


      <Modal show={showCloseSession} onHide={handleCloseSesion} keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title>Su sesión ha expirado. Vuelva a iniciar sesión.</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSesion}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>


    </AuthProvider.Provider>
  )

}

export default MyApp
