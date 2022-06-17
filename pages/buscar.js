import React, { useState, useEffect, useContext, useRef } from 'react'
import GoogleMap from '../components/GoogleMap'
import Layout from '../components/Layout'
import ProjectList from '../components/ProjectList'
import Search from '../components/Search'
import styles from "../styles/MapPage.module.css"
import authProvider from '../providers/authProvider'
import ProtectedRoute from '../components/ProtectedRoute'
import useAPI from '../hooks/useAPI'


export default function buscar() {

	const fetchProjects = useAPI("./api/projects");

	const [projects, setProjects] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const filter = useRef();

	const isScrolling = useRef();


	const handleFilter = (receivedFilter) => {
		const params = {
			title: receivedFilter.title,
			location: receivedFilter.location,
			field: receivedFilter.fields
		}
		const query = new URLSearchParams();
		query.append("title",receivedFilter.title)
		query.append("location", receivedFilter.location)

		receivedFilter.fields.forEach(f => {
			query.append("field", f)
		});
		
		filter.current = query;
		isScrolling.current = false;

		fetchProjects.trigger.get(query);
		setProjects([]);
		
	}

	useEffect(() => {
		if (!fetchProjects.loading && fetchProjects.data) {

			if (isScrolling.current) {
				setProjects([...projects, ...fetchProjects.data.projects])
			} else {
				setProjects(fetchProjects.data.projects)
			}

		}
	}, [fetchProjects.data]);


	const lastOnScreen = () => {

		if (fetchProjects.data.nextPage) {
			isScrolling.current = true;
	
			const params = {
				...filter, 
				page: fetchProjects.data.nextPage
			}
			fetchProjects.trigger.get(params);
		}

	}


	return (

		<ProtectedRoute>
			<Layout >

				<div className={styles["container"]}>
					<div className={styles["map-placeholder"]}>
			
						<GoogleMap listOfProjects={projects ? projects : lastEvents} ></GoogleMap>

					</div>

					<div className={`${styles["projects-list-container"]} ${isOpen ? "" : styles.closed}`}>
						<Search handleFilter={handleFilter}></Search>
						<ProjectList projects={projects} lastOnScreen={lastOnScreen} preventScroll={fetchProjects.isLoading}></ProjectList>
						{fetchProjects.isLoading && 
						
							<div className={styles.loading}>Cargando más proyectos...</div>
							
							
						}
				
							<div
							className={styles["projects-list-container-tab"]}
							onClick={() => setIsOpen(!isOpen)}>
							<i className={`fas fa-solid fa-arrow-left ${styles.arrow} ${isOpen ? styles.open : ""}`}></i>
						</div>
						
						
					</div>
				</div>


			</Layout>
		</ProtectedRoute>
	)
}