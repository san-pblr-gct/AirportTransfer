import * as types from './../constants/actionTypes';
import { beginAjaxCall } from './ajaxStatusActions';
import axios from 'axios'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux';


export function loadAllocatedStudentPopupSuccess(data) {
  return { type: types.LOAD_ALLOCATEDPOPUP_SUCCESS, data };
}

export function loadAllocatedStudentPopup(LSTransportationAllocatedStudentId, transferType, token) {
  return dispatch => {
    return axios({
      method: 'get',
      cache: false,
      headers: { Authorization: 'Bearer ' + token },
      url: types.API + 'api/LSTransportationApp/GetAllocatedStudentPopupDetail?LSTransportationAllocatedStudentId=' + LSTransportationAllocatedStudentId
      + "&TransferType=" + transferType
    }).then(function (response) {
      dispatch(loadAllocatedStudentPopupSuccess(response.data));
    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }
}


export function saveAllocatedStudentPopup(AllocatedStudentId, PickUpAddress, PickUpTime, DropupAddress, DropofTime, Amount, UserID, DestinationCode, token) {
  return dispatch => {
    return axios({
      method: 'post',
      headers: { Authorization: 'Bearer ' + token },
      url: types.API + 'api/LSTransportationApp/SaveAllocatedStudentOterDetail?AllocatedStudentId=' + AllocatedStudentId
      + "&PickUpAddress=" + PickUpAddress
      + "&PickUpTime=" + PickUpTime
      + "&DropupAddress=" + DropupAddress
      + "&DropofTime=" + DropofTime
      + "&Amount=" + Amount
      + "&DestinationCode=" + DestinationCode
      + "&UserID=" + UserID
    }).then(function (response) {
    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }
}



export function allocatedToUnallocatedSuccess(student) {
  return { type: types.ALLOCATED_TO_UNALLOCATED_SUCCESS, student };
}

export function allocatedToUnallocated(student, token) {
  return dispatch => {
    return axios({
      method: 'post',
      headers: { Authorization: 'Bearer ' + token },
      url: types.API + 'api/LSTransportationApp/CancelAllocatedStudent?AllocatedStudentId=' + student.AllocatedStudentId + "&TaxiId=" + student.TaxiId
      + "&UserId=" + student.UserId
    }).then(function (response) {
      return response;
    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }
}

export function unallocatedToAllocatedSuccess(student) {
  return { type: types.UNALLOCATED_TO_ALLOCATED_SUCCESS, student };
}

export function unallocatedToAllocated(student, token) {
  return dispatch => {
    return axios({
      method: 'post',
      url: types.API + 'api/LSTransportationApp/SaveStudentAllocation',

      headers: { Authorization: 'Bearer ' + token },
      data: student
    }).then(function (response) {
      return (student.Name, response)
    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }

}

export function removeNotification(StudentCaxModifiedId, UserId, token) {
  return dispatch => {
    return axios({
      method: 'post',
      headers: { Authorization: 'Bearer ' + token },
      url: types.API + 'api/LSTransportationApp/RemoveNotification?StudentCaxModifiedId=' + StudentCaxModifiedId + "&UserId=" + UserId
    }).then(function (response) {

    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }

}

export function logout() {
  sessionStorage.removeItem("user");
  browserHistory.push('/login');
  return { type: "USER_LOGOUT" };
}

export function reroute(path) {
  return { type: "ROUTE", path };
}