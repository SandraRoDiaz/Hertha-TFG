
const SET_PROJECT_ACTION = "SET_PROJECT_ACTION";

function setProject(project) {
    return {
        type: SET_PROJECT_ACTION,
        payload: project
    }
}

export { SET_PROJECT_ACTION, setProject }