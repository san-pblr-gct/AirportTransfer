import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function validJiraCredentials(state = initialState.validJiraCredentials, action) {
   
    switch (action.type) {      
         case types.AB_VALIDJIRACREDENTIALS_SUCCESS:
            return action.data;
        default:
            return state;
    }
}
