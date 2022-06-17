import React from 'react'
import Layout from '../components/Layout'
import ProjectForm from '../components/ProjectForm'
import ProtectedRoute from '../components/ProtectedRoute'


export default function crear() {
    return (
    
    <ProtectedRoute>
            <Layout>
                <ProjectForm></ProjectForm>
            </Layout>
    </ProtectedRoute>
        
        
        
    )
}