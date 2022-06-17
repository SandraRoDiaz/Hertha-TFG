import { useRouter } from "next/router";
import { useEffect } from "react";


export default function() {
    const router = useRouter();

    useEffect(() => {
        router.push("/home");
    }, []);

    return null;
}