import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function user(state = initialState.user, action) {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return action.user;
        case types.AB_VALIDJIRACREDENTIALS_SUCCESS:
            return Object.assign({}, state, {
                HasJiraAccess: action.data
            });
        default:
            return state;
    }
}
