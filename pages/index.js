import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import AccessLayout from '../components/AccessLayout'
import 'bootstrap/dist/css/bootstrap.min.css';
import image from '../images/take-care.svg'

export default function Home() {

  return (

    <AccessLayout>
      <div className={` ${styles.content} container-fluid`}>

        <div className={`${styles.wrapper}  row `}>
          <div className={`col-lg-6 col-sm-12 ${styles.text} m-auto`}>
            
              <p className={styles.title}>HERTHA</p>
              <p className={styles.subtitle}>Diseño y desarrollo de una plataforma online que aproxima la ciencia a los ciudadanos</p>
              
            
          </div>
          <img className={`col-lg-6 col-sm-12 m-auto ${styles.image}`} src={image.src} alt="Image" />
        </div>
      </div>
    </AccessLayout>

  )
}
