import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function accommodationTypes(state = initialState.accommodationTypes, action) {
  switch (action.type) {
    case types.LOAD_ACCOMMODATIONTYPE_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
