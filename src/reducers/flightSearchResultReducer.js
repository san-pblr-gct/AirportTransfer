import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function flightSearchResults(state = initialState.flightSearchResults, action) {
    switch (action.type) {
        case types.FLIGHT_SEARCH_SUCCESS:
            return action.data;
        case types.FLIGHT_TERMINALUPDATE_SUCCESS:
            let flightResult = Object.assign({}, [...state.filter(result => result.Booking_id === action.BookingId)][0]);
            flightResult.FlightTerminalId = action.flightTerminalId;
            flightResult.ArrDepArrTerminal = $.trim(action.TransferType) == "TFARR" ? action.ArrTerminal : action.DepTerminal;
            return [...state.filter(result => result.Booking_id !== action.BookingId),
            Object.assign({}, flightResult)];
        default:
            return state;
    }
}
