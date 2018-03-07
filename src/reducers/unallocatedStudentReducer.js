import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function unallocatedStudents(state = initialState.unallocatedStudents, action) {
  switch (action.type) {
    case types.SEARCH_SUCCESS:
      return action.data.UnallocatedStudent;
    case types.UNALLOCATED_TO_ALLOCATED_SUCCESS:
      return [
        ...state.filter(student => student.BookingID !== action.student.BookingId)];
    case types.ALLOCATED_TO_UNALLOCATED_SUCCESS:
      if (($.trim(action.unallocatedStudent.DestinationCode) == $.trim(action.search.destination)
        || (($.trim(action.unallocatedStudent.DestinationCode) == "GB-CAM" || $.trim(action.unallocatedStudent.DestinationCode) == "GB-CAC") &&
          ($.trim(action.search.destination) == "GB-CAM" || $.trim(action.search.destination) == "GB-CAC"))) &&
        ($.trim(action.search.gateway) == "" ? true : ($.trim(action.unallocatedStudent.TransferType) == "TFARR" ? $.trim(action.unallocatedStudent.ArrGateCode) == $.trim(action.search.gateway) : $.trim(action.unallocatedStudent.DepGateCode) == $.trim(action.search.gateway)))
        && $.trim(action.unallocatedStudent.TransferType) == $.trim(action.search.transferType) &&
        action.unallocatedStudent.TransferAllocatedDate.substring(0, 10) == $.trim(action.search.transferDate)) {
        if (action.unallocatedStudent.BookingID === 0)
          return state;
        else
          return [...state, Object.assign({}, action.unallocatedStudent)];
      }
      else
        return state;
    default:
      return state;
  }
}
