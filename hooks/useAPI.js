import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import authProvider from "../providers/authProvider";
import { unstable_batchedUpdates } from "react-dom";



export default function useAPI(url, autoTrigger = true, method = null) {

    const { user, displayCloseSession } = useContext(authProvider)

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState();
    const [headers, setHeaders] = useState();
    const [error, setError] = useState();

    

    const [isTriggered, setIsTriggered] = useState(autoTrigger);


    const axiosConfig = useRef({
        url,
        method : method,
        data: null,
        headers: null,
        params: null
    });

    const defaultConfig = useRef()
 
    useEffect(() => {
        
        if (user) {
            
            axiosConfig.current.headers = {
                "Authorization": `Bearer ${user.authorization.token}`
            }
            defaultConfig.current = {...axiosConfig.current}
        }
    }, [user]);


    useEffect(async () => {
        
        if (isTriggered && user) {
            try {
                setIsLoading(true);
                const { data , headers } = await axios(axiosConfig.current);

                unstable_batchedUpdates(() => {

                    setData(data);
                    setHeaders(headers);
                    setIsLoading(false);
                    setIsTriggered(false);
                })
            } catch (error) {
                if (axios.isAxiosError(error) && (error.response.status === 403 || error.response.status === 401 ) ) {
                    displayCloseSession();
                } else {
                    
                    unstable_batchedUpdates(() => {
                        setError(error);
                        setIsLoading(false);
                        setIsTriggered(false);
                    });
                }
            } finally {
                axiosConfig.current = {...defaultConfig.current}
            }
        }
    }, [isTriggered, user]);

    const request = (config ) =>{
        if(config && config.relativeTo){
            config.url =  axiosConfig.current.url + config.relativeTo
            delete config.relativeTo
          }
        

        axiosConfig.current = {
            ...axiosConfig.current,
            ...config
        }
        setIsTriggered(true)
    }

    const trigger = {
        get: (params, config) =>{
            const requestConfig = {...config, params, method:"get"}
            request(requestConfig)
        },
        post: (data, config) =>{
            const requestConfig = {...config, data, method:"post"}
            request(requestConfig)
        },
        put: (data, config) =>{
            const requestConfig = {...config, data, method:"put"}
            request(requestConfig)
        }, 
        delete: (config) =>{
            const requestConfig = {...config, method:"delete"}
            request(requestConfig)
        }
    }

    return {
        isLoading,
        data,
        headers,
        error,
        trigger
    }

}