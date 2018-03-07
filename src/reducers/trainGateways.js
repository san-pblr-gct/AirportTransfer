import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function trainGateways(state = initialState.trainGateways, action) {
  switch (action.type) {
    case types.LOAD_TRAINGATEWAY_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
