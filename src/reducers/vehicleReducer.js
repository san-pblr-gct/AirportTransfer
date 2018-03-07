import * as types from './../constants/actionTypes';
import initialState from './initialState';


export default function vehicles(state = initialState.vehicles, action) {
    switch (action.type) {

        case types.LOAD_TAXIPOPUP_SUCCESS:
            return action.data;

        default:
            return state;
    }
}
