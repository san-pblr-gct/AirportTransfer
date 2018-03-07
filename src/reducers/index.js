import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStateReducer';
import unallocatedStudents from './unallocatedStudentReducer';
import taxis from './taxiReducer';
import gateways from './gatewayReducer';
import destinations from './destinationReducer';
import transferTypes from './transferTypeReducer';
import search from './searchReducer';
import vehicles from './vehicleReducer';
import user from './userReducer';
import allocatedStudent from './allocatedStudentReducer';
import kpi from './kpiReducer';
import modifiedStudents from './modifiedStudentReducer';
import searchLoading from './searchLoadingReducer';
import products from './productReducer';
import programs from './programReducer';
import flightDirections from './flightDirectionReducer';
import transferArticles from './transferArticleReducer';
import accommodationTypes from './accommodationTypeReducer';
import flightSearch from './flightSearchReducer';
import flightSearchResults from './flightSearchResultReducer';
import flightSearchLoading from './flightSearchLoadingReducer';
import studentSearchResults from './AdminBoard/studentSearchResultsReducer';
import studentSearchLoading from './AdminBoard/studentSearchLoadingReducer';
import studentGeneralSearchLoading from './AdminBoard/studentGeneralSearchLoadingReducer';
import studentDetailedInfoResult from './AdminBoard/studentDetailedInfoResultReducer';
import addLogDropDowns from './AdminBoard/AddLogLoadDropDownsReducer';
import addLogStatus from './AdminBoard/AddLogSuccessReducer';
import studentJiraDetailsResult from './AdminBoard/studentJiraInfoResultReducer';
import validJiraCredentials from './AdminBoard/validateJiraCredentialsStatusReducer';
import studentLogDetailsLoading from './AdminBoard/studentJiraInfoResultLoadingReducer';
import path from './pathReducer';
import trainGateways from './trainGateways';

const appReducer = combineReducers({
    ajaxCallsInProgress,
    unallocatedStudents,
    taxis,
    gateways,
    destinations,
    transferTypes,
    search,
    vehicles,
    user,
    allocatedStudent,
    kpi,
    modifiedStudents,
    searchLoading,
    products,
    programs,
    transferArticles,
    accommodationTypes,
    flightSearch,
    flightSearchResults,
    flightDirections,
    flightSearchLoading,
    path,
    trainGateways,
    studentSearchResults,
    studentSearchLoading,
    studentGeneralSearchLoading,
    studentDetailedInfoResult,
    addLogDropDowns,
    addLogStatus,
    studentJiraDetailsResult,
    validJiraCredentials,
    studentLogDetailsLoading
});


const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;