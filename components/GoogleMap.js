
import GoogleMapReact from 'google-map-react';
import MapMark from "./MapMark";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/MapPage.module.css"

//Centrar el mapa
const init = {
  center: {
    lat: 41.4376614,
    lng: 2.1086192
  },
  zoom: 11
};


function computeStatus(project) {
  const startDate = new Date(project.projectStart);
  const endDate = new Date(project.projectEnd);

  const now = new Date();

  let status;
  if ( startDate < now && now < endDate ) {
    status = "progress";
  } else if (endDate < now) {
    status = "finished";
  } else {
    status = "pending";
  }

  return status;

}

const statusColors = {
  pending: "yellow",
  progress: "green",
  finished: "red"
}


function computeMapMarks(projects) {

  return projects.filter(project => project.pos).map((project, i) => {

    const status = computeStatus(project);
    const color = statusColors[status];

    return <MapMark key={project._id} marker={project} lat={project.pos.lat} lng={project.pos.lng} statusColor={color}/>
  });
}



export default function GoogleMap({ listOfProjects }) {

  const [positions, setPositions] = useState([]);
  const [maps, setMaps] = useState();


  useEffect(async () => {
    if (maps) {
      const decoder = new maps.Geocoder();
  
      // Quitar que proyectos ya les hemos sacado antes las coordenadas
  
      const unpositionedProjects = listOfProjects.slice(positions.length);
  
  
      // Saber las coordenadas de los proyectos 
      const whenUnpositionProjectsUbications = unpositionedProjects.map(project => decoder.geocode({ "address": project.location }));
  
      const unpositionProjectsResponses = await Promise.allSettled(whenUnpositionProjectsUbications);
  
      const projects = JSON.parse(JSON.stringify(unpositionedProjects)); //Deep copy
  
  
      unpositionProjectsResponses.forEach((result, indice) => {
        if (result.status === "fulfilled") {
  
          const results = result.value.results;
          const preferredResult = results[0];
          const pos = { lat: preferredResult.geometry.location.lat(), lng: preferredResult.geometry.location.lng() }
  
          projects[indice].pos = pos;
        } else {
          // Aqui se porque ha fallado result.reason
          console.error(result.reason.code)
          const pos = null;
          projects[indice].pos = pos;
        }
      });
  
      // Guardar los proyectos con sus coordenadas
      setPositions([...positions, ...projects]);
    }
  }, [maps, listOfProjects]);



  const handleApiLoaded = async ({ map, maps }) => {
    setMaps(maps);
  };


  const mapMarks = computeMapMarks(positions);
  
  return (
    // Important! Always set the container height explicitly
    <div className={styles["google-map"]}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "***********" }}
        defaultCenter={init.center}
        defaultZoom={init.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >
        {mapMarks}
      </GoogleMapReact>
    </div>
  );
}
