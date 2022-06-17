import { useState } from "react";
import styles from "../styles/MapMark.module.css"
import { useMobile } from "../hooks/useMobile"
import {useRouter} from "next/dist/client/router"

function MapMarkt({ marker , statusColor, key}) {

    const router = useRouter(); //Router hook de next.js
    const [popover, setPopover] = useState();
    const isMobile = useMobile();

    const closePreview = () => {
        setPopover()
    };

    const openPreview = () => {
        const popover = (

            <div className={styles["map-mark-container"]}>
                {isMobile &&
                    <div className={`${styles.close} fas fa-times`} onTouchEnd={closePreview}></div>
                }

                <div className={styles.information}>
                    <div className={styles["title"]}>
                         {marker.title}
                    </div>
                    <div className={styles["location"]}>
                        {marker.location}
                    </div>
                </div>
                <button className={styles["navigate-btn"]}onClick={()=> router.push("/proyecto/" + marker._id)}>Ver</button>


            </div>)

        setPopover(popover);

    }

    return (
        <div>
            {
                !isMobile ?
                    <div onMouseEnter={openPreview} onMouseLeave={closePreview} style={{color: statusColor}}>
                        <i className={styles["map-mark"] + " bi bi-pin-map-fill"}>{popover} </i>
                        
                        
                    </div>

                    :

                    <div onTouchStart={openPreview}>
                        <i className={styles["map-mark"] + " bi bi-pin-map-fill"} style={{color: statusColor}}> {popover}</i>
                       
                    </div>
            }
        </div>
    );
}

export default MapMarkt;