import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function programs(state = initialState.programs, action) {
  switch (action.type) {
    case types.LOAD_PROGRAM_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
