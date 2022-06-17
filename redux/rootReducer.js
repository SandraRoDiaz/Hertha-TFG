

import { createStore, applyMiddleware, compose, combineReducers} from "redux";
import project from "./reducers/actionsReducers";
import { createWrapper } from "next-redux-wrapper"
import { composeWithDevTools } from 'redux-devtools-extension'

// const rootReducer = combineReducers({project_store: project});

const makeStore = () => createStore(project, composeWithDevTools())

export default createWrapper(makeStore);