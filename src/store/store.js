import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import { authReducer } from './authReducer';
import { audioReducer } from './playerReducer';
import { promiseReducer } from './promiseReducer';


export const store = createStore(combineReducers({
    promise: promiseReducer,
    authReducer: authReducer,
    playerReducer: audioReducer, 
}),applyMiddleware(thunk))


