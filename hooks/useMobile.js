import { useLayoutEffect, useState } from "react";



export function useMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        const updater = (e) => {
            const width = window.outerWidth;
            setIsMobile(600 > width)
        }
        updater();
        window.addEventListener("resize", updater)
        return () => window.removeEventListener("resize", updater)
    }, []);


    return isMobile;
}