import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function destinations(state = initialState.destinations, action) {
    switch (action.type) {
        case types.LOAD_DESTINATIONS_SUCCESS:
            return action.destinations;
        default:
            return state;
    }
}
