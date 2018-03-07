import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentDetailedInfoResult(state = initialState.studentDetailedInfoResult, action) {
   
    switch (action.type) {      
         case types.AB_LOAD_STUDENTDETAILEDINFO_SUCCESS:
            return action.data;
        default:
            return state;
    }
}
