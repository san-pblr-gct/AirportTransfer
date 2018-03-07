import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function transferArticles(state = initialState.transferArticles, action) {
  switch (action.type) {
    case types.LOAD_TRANSFERARTICLE_SUCCESS:
      return action.data;  
    default:
      return state;
  }
}
