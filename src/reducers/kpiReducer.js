import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function kpi(state = initialState.kpi, action) {
  switch (action.type) {
    case types.LOAD_KPI_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
