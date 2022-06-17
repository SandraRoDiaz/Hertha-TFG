import { SET_PROJECT_ACTION } from "../actions/projectActions";


const initialState = {
    project: null
}

export default function project(state = initialState, action) {
    switch(action.type) {

        case SET_PROJECT_ACTION: {
            const newState = {
                ...state,
                project: action.payload
            }
            return newState
        }

        default: {
            return state;
        }
    }
}