import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentJiraInfoResultLoadingReducer(state = initialState.studentLogDetailsLoading, action) {    
    switch (action.type) {      
        case types.AB_LOAD_JIRA_SUCCESS :
            return true;       
        case types.AB_LOAD_STUDENTJIRA_SUCCESS:
            return false;
        default:
            return state;
    }
}
