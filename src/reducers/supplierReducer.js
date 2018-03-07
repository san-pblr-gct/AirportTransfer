import * as types from './../constants/actionTypes';
import initialState from './initialState';


export default function suppliers(state = initialState.suppliers, action) {
    switch (action.type) {
        case types.LOAD_TAXIPOPUP_SUCCESS:
            return action.data.SupplierList;
        default:
            return state;
    }
}
