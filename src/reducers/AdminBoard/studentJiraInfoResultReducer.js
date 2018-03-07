import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentJiraInfoResultReducer(state = initialState.studentJiraDetailsResult, action) {  
    switch (action.type) {      
         case types.AB_LOAD_STUDENTJIRAINFO_SUCCESS:
            return action.data;
        default:
            return state;
    }
}
