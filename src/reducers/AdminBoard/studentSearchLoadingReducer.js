import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentSearchLoading(state = initialState.studentSearchLoading, action) {
    switch (action.type) {      
        case types.AB_STUDENT_SEARCH:
            return true;       
        case types.AB_STUDENT_SEARCH_SUCCESS:
            return false;
        default:
            return state;
    }
}
