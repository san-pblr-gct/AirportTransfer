import * as types from './../../constants/actionTypes';
import initialState from './../initialState';

export default function studentSearchResults(state = initialState.studentSearchResults, action) {

    switch (action.type) {
        case types.AB_LOAD_STUDENTINFO_SUCCESS:
            return action.data;
        case types.AB_CONFIRMBOOKINGS_SUCCESS:
            let list = [...state];
            action.data.BookingConfirmations.map((g, i) => {
                let booking = Object.assign({}, [...state.filter(student => student.BookingId === g.BookingId)][0]);
                if (action.data.Param === 1)
                    list = [...list.filter(student => student.BookingId !== g.BookingId)];
                else if ((action.data.Param === 2 && booking.AccommodationStatusCode.trim() === "CF") ||
                    (action.data.Param === 3 && booking.CourseStatusCode.trim() === "CF"))
                    list = [...list.filter(student => student.BookingId !== g.BookingId)];
                else if (action.data.Param === 2) {
                    booking.CourseStatusCode = "CF";
                    list = [...list.filter(student => student.BookingId !== g.BookingId), Object.assign({}, booking)];
                }
                else if (action.data.Param === 3) {
                    booking.AccommodationStatusCode = "CF";
                    list = [...list.filter(student => student.BookingId !== g.BookingId), Object.assign({}, booking)];
                }
            })
            return [...list];

        case types.AB_ACKNOWLEDGEBOOKINGS_SUCCESS:
            let studentlist = [...state];
            action.data.BookingConfirmations.map((g, i) => {
                studentlist = [...studentlist.filter(student => student.BookingId !== g.BookingId)];
            })
            return [...studentlist];
        case types.AB_ADDLOG_SUCCESS:
        debugger;
            let loglist = [...state];
          
            action.jira.SalesBookingIdList.map((g, i) => {
                let logbooking = Object.assign({}, [...state.filter(student => student.SalesBookingId === g)][0]);
                logbooking.IsInProgress = true;
                loglist = [...loglist.filter(student => student.SalesBookingId !== g), Object.assign({}, logbooking)];
               
            })
            return [...loglist];

        default:
            return state;
    }
}
