import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function flightSearch(state = initialState.flightSearch, action) {
    switch (action.type) {
        case types.FLIGHT_SEARCH:
            return action.flightSearch;
        default:
            return state;
    }
}
