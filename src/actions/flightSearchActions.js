import * as types from './../constants/actionTypes';
import { beginAjaxCall } from './ajaxStatusActions';
import axios from 'axios'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux';



export function FlightSearchSuccess(data) {
    return { type: types.FLIGHT_SEARCH_SUCCESS, data };
}

export function FlightTerminalUpdateSuccess(flightTerminalId,BookingId,ArrTerminal,DepTerminal,TransferType) {
    return { type: types.FLIGHT_TERMINALUPDATE_SUCCESS, flightTerminalId,BookingId,ArrTerminal,DepTerminal,TransferType };
}

export function GetTransferArticleSuccess(data) {
    return { type: types.LOAD_TRANSFERARTICLE_SUCCESS, data };
}

export function GetTransferArticle(destinationCode, token) {
    return dispatch => {

        return axios({
            method: 'get',
            headers: { Authorization: 'Bearer ' + token },
            cache: false,
            url: types.API + '/api/LSTransportationApp/GetTransferArticle?destinationCode=' + destinationCode
        }).then(function (response) {
            dispatch(GetTransferArticleSuccess(response.data));
        }).catch(function (error) {
            console.log(error);
        });
    }
}

export function GetGatewayForTrainTypeListSuccess(data) {
    return { type: types.LOAD_TRAINGATEWAY_SUCCESS, data };
}


export function GetGatewayForTrainTypeList(destinationCode, token) {
    return dispatch => {
        return axios({
            method: 'get',
            headers: { Authorization: 'Bearer ' + token },
            cache: false,
            url: types.API + '/api/LSTransportationApp/GetGatewayForTrainTypeList?destinationCode=' + destinationCode
        }).then(function (response) {
            dispatch(GetGatewayForTrainTypeListSuccess(response.data));
        }).catch(function (error) {
            console.log(error);
        });
    }
}

export function FlightSearch(flightSearch, token) {
    return dispatch => {
        dispatch({ type: types.FLIGHT_SEARCH, flightSearch })
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.API + '/api/LSTransportationApp/GetFlightSearchResult',
            data: flightSearch,
            cache: false
        }).then(function (response) {
            dispatch(FlightSearchSuccess(response.data));
        }).catch(function (error) {
            console.log(error);
        });
    }
}



export function saveFlightTerminal(flightTerminalId, BookingId, FlightId, DestinationCode, ArrTerminal, DepTerminal, TransferType, UserId, token) {
    return dispatch => {
        return axios({
            method: 'post',
            url: types.API + 'api/LSTransportationApp/saveFlightTerminal?flightTerminalId=' + flightTerminalId
            + '&BookingId=' + BookingId + '&FlightId=' + FlightId + '&DestinationCode=' + DestinationCode + '&ArrTerminal=' + ArrTerminal
            + '&DepTerminal=' + DepTerminal + '&TransferType=' + TransferType + '&UserId=' + UserId,
            headers: { Authorization: 'Bearer ' + token }
        }).then(function (response) {
            dispatch(FlightTerminalUpdateSuccess(flightTerminalId,BookingId,ArrTerminal,DepTerminal,TransferType));
        }).catch(function (error) {
            if (error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    }

}

export function SendEmailToSalesPersonforMissingFlight(mail,token)
{
     return dispatch => {
        return axios({
            method: 'post',
            url: types.API + 'api/LSTransportationApp/SendEmailToSalesPersonforMissingFlight',
            data:mail,
            headers: { Authorization: 'Bearer ' + token }
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
