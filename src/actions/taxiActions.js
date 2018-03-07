import * as types from './../constants/actionTypes';
import { beginAjaxCall } from './ajaxStatusActions';
import axios from 'axios';
import store from '../store/configureStore';
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux';

export function loadTaxisSuccess(taxis) {
  return { type: types.LOAD_TAXIS_SUCCESS, taxis };
}

export function loadTaxis() {

  return dispatch => {
    dispatch(beginAjaxCall());
  };
}

export function addTaxiSuccess(taxi) {
  return { type: types.ADD_TAXI_SUCCESS, taxi };
}

export function addTaxi(taxi, token) {
  return dispatch => {
    return axios({
      method: 'post',

      headers: { Authorization: 'Bearer ' + token },
      url: types.API + '/api/LSTransportationApp/AddTaxi',
      data: taxi
    }).then(function (response) {

    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }
}


export function loadTaxiPopupSuccess(data) {
  return { type: types.LOAD_TAXIPOPUP_SUCCESS, data };
}


export function loadTaxiPopup(destination, transferType, transferDate, token) {
  return dispatch => {
    return axios({
      method: 'get',
      cache: false,
      headers: { Authorization: 'Bearer ' + token },
      url: types.API + 'api/LSTransportationApp/FillAddTaxiDetailPopUp?destinationcode=' + destination
      + "&TransferType=" + transferType + "&TransferDate=" + transferDate
    }).then(function (response) {
      dispatch(loadTaxiPopupSuccess(response.data));
    }).catch(function (error) {
      if (error.response.status == 401) {
        dispatch(logout());
      }
      console.log(error);
    });
  }
}


export function deleteTaxiSuccess(taxiId) {
  return { type: types.DELETE_TAXI_SUCCESS, taxiId };
}

export function deleteTaxi(taxi, userId, token) {
  return dispatch => {
    return axios({
      method: 'get',
      headers: { Authorization: 'Bearer ' + token },
      cache: false,
      url: types.API + 'api/LSTransportationApp/CancelTaxi?TaxiId=' + taxi + '&UserId=' + userId,

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
