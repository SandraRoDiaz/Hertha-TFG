import React from 'react'
import Menu from './Menu'
import Topbar from './TopBar'
import styles from "../styles/Layout.module.css"
import { useState } from "react"
import { useMobile } from "../hooks/useMobile"

export default function Layout(props) {

    const isMobile = useMobile();

    return (
        <div className={styles["layout-container"]}>
            { !isMobile && 
                <div className={styles["aside-container"]}>
                    <aside>
                        <Menu></Menu>
                    </aside>
                </div>
            }

            <div className={styles["layout-content"]}>

                <Topbar></Topbar>

                <div className={styles["content-container"]}>
                    {props.children}
                </div>

            </div>

            {isMobile &&
                <div className={styles["mobile-nav"]}>
                    <Menu/>
                </div>
            }

        </div>
    )
}
