import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function flightDirections(state = initialState.flightDirections, action) {
  switch (action.type) {
    case types.LOAD_FLIGHTDIRECTION_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
