import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function addLogStatus(state = initialState.addLogStatus, action) {
   
    switch (action.type) {      
         case types.AB_ADDLOG_SUCCESS:
            return action.data;
        default:
            return state;
    }
}
