import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function search(state = initialState.search, action) {
    switch (action.type) {
        case types.SEARCH:
            return action.data;

        default:
            return state;
    }
}
