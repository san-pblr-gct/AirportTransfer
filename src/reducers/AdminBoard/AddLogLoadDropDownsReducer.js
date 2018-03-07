import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function addLogDropDowns(state = initialState.addLogDropDowns, action) {
   
    switch (action.type) {      
         case types.AB_LOAD_ADDLOG_DROPDOWNS_SUCCESS:
            return action.data;
        default:
            return state;
    }
}
