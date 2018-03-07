import * as types from './../constants/actionTypes';
import { beginAjaxCall } from './ajaxStatusActions';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';

export function updateDestinationSuccess(gateways) {
    return { type: types.UPDATE_DESTINATION_SUCCESS, gateways };
}

export function updateDestination(destinationCode) {
    return dispatch => {
        dispatch(beginAjaxCall());
        return axios({
            method: 'get',
            cache:false,
            url: types.API + '/api/LSTransportationApp/GetGatewayList?destinationcode=' + destinationCode
        }).then(function (response) {
            dispatch(updateDestinationSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}
export function SearchSuccess(data) {
    return { type: types.SEARCH_SUCCESS, data };
}

export function Searching(data) {
    return { type: types.SEARCH, data };
}


export function Search(search, token) {
    return dispatch => {
        let getUrl = types.API + '/api/LSTransportationApp/LoadTransportationSearch?destinationcode=' + search.destination
            + '&TransferType=' + search.transferType + "&TransferDate=" + search.transferDate + "&GateWay=" + (search.gateway ? search.gateway : 'null') + '&Userid=9015';

        dispatch(beginAjaxCall());
        dispatch(Searching(search));
        dispatch(loadKPI(search, token));
        dispatch({ type: 'connection:start', search });

        return axios({
            method: 'get',
            headers: { Authorization: 'Bearer ' + token, Pragma:'no-cache',Expires:-1 },
            url: getUrl,
            cache:false
        }).then(function (response) {
            dispatch(SearchSuccess(response.data));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function kpiSuccess(data) {
    return { type: types.LOAD_KPI_SUCCESS, data };
}
export function loadKPI(search, token) {
    return dispatch => {
        return axios({
            method: 'get',
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetAverageTransferCost?destinationcode=' + search.destination
            + '&TransferType=' + search.transferType + "&TransferDate=" +search.transferDate + "&GateWay=" + (search.gateway ? search.gateway : 'null'),
            cache:false
        }).then(function (response) {
            dispatch(kpiSuccess(response.data));
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

