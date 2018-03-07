import * as types from './../constants/actionTypes';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function taxis(state = initialState.taxis, action) {
  switch (action.type) {
    case types.SEARCH_SUCCESS:
      return action.data.TaxiDetails;
    case types.ADD_TAXI_SUCCESS:
      return [...state, ...action.taxi];
    case types.DELETE_TAXI_SUCCESS:
      return [
        ...state.filter(taxi => taxi.LSTransportationTaxiDetailID !== action.taxiId)];

    case types.UNALLOCATED_TO_ALLOCATED_SUCCESS:
      let taxi = Object.assign({}, [...state.filter(taxi => taxi.LSTransportationTaxiDetailID === action.student.LSTransportationTaxiDetailId)][0]);
      if (taxi.AllocatedStudent === undefined)
        return state;
      else {
        let allocatedstudents = [...taxi.AllocatedStudent];
        allocatedstudents.push(action.student);
        //let students = [...taxi.AllocatedStudent, ...allocatedStudent];
        Object.assign(taxi, { AllocatedStudent: allocatedstudents });
        taxi.AvaliableSeat = taxi.TotalSeat - taxi.AllocatedStudent.length;
        return [...state.filter(taxi => taxi.LSTransportationTaxiDetailID !== action.student.LSTransportationTaxiDetailId),
        Object.assign({}, taxi)];
      }

    case types.ALLOCATED_TO_UNALLOCATED_SUCCESS:
      let taxiN = Object.assign({}, [...state.filter(taxi => taxi.LSTransportationTaxiDetailID === action.TaxiId)][0]);
      if (taxiN.AllocatedStudent === undefined)
        return state;
      else {
        let students = taxiN.AllocatedStudent.filter(s => s.LSTransportationAllocatedStudentId !== action.AllocatedStudentId);
        Object.assign(taxiN, { AllocatedStudent: students });
        taxiN.AvaliableSeat = taxiN.AvaliableSeat + 1;
        return [...state.filter(taxi => taxi.LSTransportationTaxiDetailID !== action.TaxiId),
        Object.assign({}, taxiN)];
      }
    default:
      return state;
  }
}

