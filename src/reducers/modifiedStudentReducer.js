import * as types from './../constants/actionTypes';
import initialState from './initialState';

export default function modifiedStudents(state = initialState.modifiedStudents, action) {
    switch (action.type) {
        case types.SEARCH_SUCCESS:
            return action.data.AllocatedCaxModifiedStudent;
        case types.REMOVE_NOTIFICATION_SUCCESS:
            return [
                ...state.filter(student => student.LSTransportationAllocatedStudentCaxModifiedId !== action.StudentCaxModifiedId)];
        case types.CAX_MODIFIED_PUSH_NOTIFICATIONS:
            return [...state.filter(taxi => taxi.LSTransportationAllocatedStudentCaxModifiedId !== action.modifiedStudent.LSTransportationAllocatedStudentCaxModifiedId),
            Object.assign({}, action.modifiedStudent)];
        default:
            return state;
    }
}
