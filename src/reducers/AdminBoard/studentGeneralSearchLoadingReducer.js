import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentGeneralSearchLoading(state = initialState.studentGeneralSearchLoading, action) {
    switch (action.type) {      
        case types.AB_STUDENT_GENERAL_SEARCH:
            return true;       
        case types.AB_STUDENT_GENERAL_SEARCH_SUCCESS:
            return false;
        default:
            return state;
    }
}
