import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function products(state = initialState.products, action) {
  switch (action.type) {
    case types.LOAD_PRODUCT_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
