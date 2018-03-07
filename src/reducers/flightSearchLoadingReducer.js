import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function flightSearchLoading(state = initialState.flightSearchLoading, action) {
    switch (action.type) {      
        case types.FLIGHT_SEARCH:
            return true;       
        case types.FLIGHT_SEARCH_SUCCESS:
            return false;
        default:
            return state;
    }
}
