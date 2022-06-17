import { useEffect, useRef } from "react";



export default function usePrevious(value) {
    const previousValue = useRef(value);

    useEffect(() => {
        previousValue.current = value;
    });


    return previousValue.current;
}