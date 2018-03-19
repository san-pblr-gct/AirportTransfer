import * as types from './../../constants/actionTypes';
import { beginAjaxCall } from './../ajaxStatusActions';
import axios from 'axios';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import moment from 'moment';

export function updateStudentListSuccess(data) {
    return dispatch => {
        dispatch({ type: types.AB_LOAD_STUDENTINFO_SUCCESS, data });
        dispatch({ type: types.AB_STUDENT_SEARCH_SUCCESS, data });
    };
}
export function getStudentList(studentSearch, token) {
    return dispatch => {
        dispatch({ type: types.AB_STUDENT_SEARCH, studentSearch });
        dispatch(beginAjaxCall());
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/GetAdminBoardResult',
            data: studentSearch,
            cache: false
        }).then(function (response) {
            dispatch(updateStudentListSuccess(response.data));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function updateStudentDetailedInfoSuccess(data) {
    return dispatch => {
        dispatch({ type: types.AB_LOAD_STUDENTDETAILEDINFO_SUCCESS, data });
        dispatch({ type: types.AB_STUDENT_GENERAL_SEARCH_SUCCESS, data });
    };
}
export function getStudentDetailedInfo(bookingId,destinationCode,startWeekCode,historyDate, token) {
    return dispatch => {
        dispatch({ type: types.AB_STUDENT_GENERAL_SEARCH, bookingId });
        dispatch(beginAjaxCall());
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/GetStudentDetailedInfo?bookingId=' + bookingId
            + '&destinationCode=' + destinationCode + '&startWeekCode=' + startWeekCode + '&historyDate=' + historyDate,
            cache: false
        }).then(function (response) {
            dispatch(updateStudentDetailedInfoSuccess(response.data));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function updateStudentJiraInfoSuccess(data) {
    return dispatch => {
        dispatch({ type: types.AB_LOAD_STUDENTJIRAINFO_SUCCESS, data });
        dispatch({ type: types.AB_LOAD_STUDENTJIRA_SUCCESS, data });
    };
}
export function getStudentJiraInfo(SalesBookingId,destinationCode,token) {    
    return dispatch => {
        dispatch({ type: types.AB_LOAD_JIRA_SUCCESS, SalesBookingId });
        dispatch(beginAjaxCall());
        return axios({
            method: 'get',
            cache:false,
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/GetLogDetails?salesBookingId=' + SalesBookingId
            + '&destinationCode=' + destinationCode            
        }).then(function (response) {
            dispatch(updateStudentJiraInfoSuccess(response.data));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function updateAdminBoardLogDropdowns(data) {
    return dispatch => {
        dispatch({ type: types.AB_LOAD_ADDLOG_DROPDOWNS_SUCCESS, data });
    };
}
export function getAdminBoardLogDropdowns(destinationCode, token) {
    return dispatch => {
       dispatch(beginAjaxCall());
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/GetAdminBoardLogDropdowns?destinationCode=' + destinationCode,
            cache: false
        }).then(function (response) {
            dispatch(updateAdminBoardLogDropdowns(response.data));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function getAdminBoardAddLogSuccess(data,jira) {
    return dispatch => {
        dispatch({ type: types.AB_ADDLOG_SUCCESS, data,jira });
        dispatch({ type: types.AB_STUDENT_GENERAL_SEARCH_SUCCESS, data });
    };
}
export function AdminBoardAddLog(jira,mailMessage, token) {
    var jiraLog = { 
        'jira': jira,
        'mailMessage':mailMessage
      };
    return dispatch => {
       dispatch({ type: types.AB_STUDENT_GENERAL_SEARCH, jira });
       dispatch(beginAjaxCall());
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url:types.ABAPI + 'api/AdminBoard/AdminBoardAddLog?jira=',
            data: jiraLog,
            cache: false
        }).then(function (response) {
            dispatch(getAdminBoardAddLogSuccess(response.data,jira));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function ConfirmBookingsSuccess(data){
    return dispatch => {
        dispatch({ type: types.AB_CONFIRMBOOKINGS_SUCCESS, data });
    };
}
export function ConfirmBookings(bookingData, token) {
    return dispatch => {
      console.log(bookingData);
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/ConfirmBookings',
            data: bookingData,
            cache: false
        }).then(function (response) {
            if(response.data===true)
            dispatch(ConfirmBookingsSuccess(bookingData));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function AcknowledgeBookingsSuccess(data){
    return dispatch => {
        dispatch({ type: types.AB_ACKNOWLEDGEBOOKINGS_SUCCESS, data });
    };
}
export function AcknowledgeBookings(bookingData, token) {
    return dispatch => {
      console.log(bookingData);
        return axios({
            method: 'post',
            headers: { Authorization: 'Bearer ' + token },
            url: types.ABAPI + 'api/AdminBoard/AcknowledgeBookings',
            data: bookingData,
            cache: false
        }).then(function (response) {
            if(response.data===true)
            dispatch(AcknowledgeBookingsSuccess(bookingData));
        }).catch(function (error) {
            if (error.response!==undefined && error.response.status == 401) {
                dispatch(logout());
            }
            console.log(error);
        });
    };
}

export function validateJiracredentialsSuccess(data){
    return dispatch => {
        dispatch({ type: types.AB_VALIDJIRACREDENTIALS_SUCCESS, data });
    };
}

export function validateJiracredentials(UserName,JiraPassword, token){
    return dispatch => {
    return axios({
        method: 'get',    
        headers: { Authorization: 'Bearer ' + token },
        url: types.ABAPI + 'api/AdminBoard/ValidateJiraUser?username='+UserName+'&&JiraPassword='+JiraPassword,       
        cache: false
    }).then(function (response) {
        dispatch(validateJiracredentialsSuccess(response.data));
      }).catch(function (error) {
        console.log(error);
    });
};
}
export function logout() {
    sessionStorage.removeItem("user");
    browserHistory.push('/login');
    return { type: "USER_LOGOUT" };
}

export function reroute(path) {
    return { type: "ROUTE", path };
  }
