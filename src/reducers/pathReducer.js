import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function path(state = initialState.path, action) {
    switch (action.type) {
        case types.ROUTE:
            return  action.path;
        default:
            return state;
    }
}
