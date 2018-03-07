import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function searchLoading(state = initialState.searchLoading, action) {
    switch (action.type) {
        case types.SEARCH:
            return true;
        case types.SEARCH_SUCCESS:
            return false;
        default:
            return state;
    }
}
