import * as types from './../constants/actionTypes';
import { beginAjaxCall } from './ajaxStatusActions';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

export function loginSuccess(user) {
    sessionStorage.user = JSON.stringify(user);
    return dispatch => {        
        dispatch(loadDestinations(user.UserID));
        dispatch(loadTransferTypes());
        dispatch(GetProduct(user.SecurityToken));
        dispatch(GetProgram(user.SecurityToken));
        dispatch(GetFlightDirection(user.SecurityToken));
        dispatch(GetAccommodationType(user.SecurityToken));
        dispatch({ type: types.LOGIN_SUCCESS, user });
    };
}

export function loginFailed(message) {
    return { type: types.LOGIN_FAILED, message };
}

export function encrypt(password) {
    return dispatch => {
        dispatch(beginAjaxCall());
        return axios({
            method: 'get',
            cache: false,
            url: types.LOGINAPI + '/api/Login/Encrypt?text=' + password
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function login(username, password) {
    let user = { "Username": username, "Password": password, "SystemName": "Elektra" };
    return dispatch => {
        dispatch(beginAjaxCall());
        return axios({
            method: 'post',
            url: types.LOGINAPI + '/api/Login/login',
            data: user,
            cache: false
        }).then(function (response) {
            if (response.data.Status == "Success") {
                dispatch(loginSuccess(response.data.UserProfile));
            }
            else
                return response.data.Description;
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function loadDestinationsSuccess(destinations) {
    return { type: types.LOAD_DESTINATIONS_SUCCESS, destinations };
  }
  
export function loadDestinations(userId) {
return dispatch => {
    dispatch(beginAjaxCall());
    return axios({
        method: 'get',
        cache: false,
        url: types.API + '/api/LSTransportationApp/GetDestination?userId=' + userId
    }).then(function (response) {
        dispatch(loadDestinationsSuccess(response.data));
    }).catch(function (error) {
        console.log(error);
    });
    };
}
  
export function loadTransferTypesSuccess(transferTypes) {
return { type: types.LOAD_TRANSFERTYPES_SUCCESS, transferTypes };
}

export function loadTransferTypes() {
return dispatch => {
    dispatch(beginAjaxCall());
    return axios({
        method: 'get',
        cache: false,
        url: types.API + '/api/LSTransportationApp/GetTransferType'
    }).then(function (response) {
        dispatch(loadTransferTypesSuccess(response.data));
    }).catch(function (error) {
        console.log(error);
    });
    };
}

export function GetProductSuccess(data) {
    return { type: types.LOAD_PRODUCT_SUCCESS, data };
}

export function GetProgramSuccess(data) {
    return { type: types.LOAD_PROGRAM_SUCCESS, data };
}

export function GetFlightDirectionSuccess(data) {
    return { type: types.LOAD_FLIGHTDIRECTION_SUCCESS, data };
}

export function GetAccommodationTypeSuccess(data) {
    return { type: types.LOAD_ACCOMMODATIONTYPE_SUCCESS, data };
}

export function GetProduct(token) {
    return dispatch => {
        return axios({
            method: 'get',
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetProduct'
        }).then(function (response) {
            dispatch(GetProductSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function GetProgram(token) {
    return dispatch => {
        return axios({
            method: 'get',
            cache: false,
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetProgram'
        }).then(function (response) {
            dispatch(GetProgramSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function GetFlightDirection(token) {
    return dispatch => {
        return axios({
            method: 'get',
            cache: false,
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetFlightDirection'
        }).then(function (response) {
            dispatch(GetFlightDirectionSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function GetAccommodationType(token) {
    return dispatch => {
        return axios({
            method: 'get',
            cache: false,
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetAccommodationType'
        }).then(function (response) {
            dispatch(GetAccommodationTypeSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function logout() {
    sessionStorage.removeItem("user");
    browserHistory.push('/login');
    return { type: "USER_LOGOUT" };
}

