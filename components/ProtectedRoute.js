import React , {useContext, useEffect} from 'react';
import authProvider from "../providers/authProvider"
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';

export default function ProtectedRoute({children}) {

    const {user, setUser, displayCloseSession } = useContext(authProvider);
    const router = useRouter();

    useEffect(async ()=>{

        try {
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
                    } else {
                        router.push("/login")
                    }
                } else {
                    router.push("/login")
                }
            }
        } catch (error) {
            displayCloseSession();
        }
    }, [])

    if(!user){
        //o retornar spinner
        return null 

    }

  return children 
  
}
