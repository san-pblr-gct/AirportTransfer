import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function allocatedStudent(state = initialState.allocatedStudent, action) {
  switch (action.type) {
    case types.LOAD_ALLOCATEDPOPUP_SUCCESS:
      return action.data;
    case types.SAVE_ALLOCATEDPOPUP_SUCCESS:
      if (state.BookingID == action.student.BookingID)
        return action.student;
      else
        return state;
    default:
      return state;
  }
}
