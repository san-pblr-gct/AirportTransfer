import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function transferTypes(state = initialState.transferTypes, action) {
    switch (action.type) {
        case types.LOAD_TRANSFERTYPES_SUCCESS:
            return action.transferTypes;
        default:
            return state;
    }
}
