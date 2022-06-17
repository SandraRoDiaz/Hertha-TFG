import React from 'react'
import {useRouter} from "next/dist/client/router"


export default function ProjectItem(props) {
    const router = useRouter(); //Router hook de next.js
    
    const navigate = (path) =>{
        router.push(path)
    }

    const handleLink = () => {
      navigate("/proyecto/"+ props.project._id)
    }

    return (
      <div  onClick={handleLink}>
        {props.children(props.project) }
      </div>
     
    )
}
