import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createSignalrMiddleware from './../actions/tickerActions';
import * as types from './../constants/actionTypes';


const signalrMiddleware = createSignalrMiddleware((dispatch, connection, rootReducer) => {
  const sessionHub = connection['LSTransportationHUB'] = connection.createHubProxy('LSTransportationHUB');
  sessionHub.on('HandleTestEvents', (events) => {
    events.forEach(event => dispatch(event));
  });
  sessionHub.on('Disconnect', () => dispatch({ type: 'connection:stop' }));

  sessionHub.on('SendLSTransportationAddTaxiNotification', function (taxi) {
    dispatch({ type: 'connection:onAddTaxiSuccess', taxi });
  });
  sessionHub.on('SendLSTransportationCancelTaxiNotification', function (taxiId) {
    dispatch({ type: types.DELETE_TAXI_SUCCESS, taxiId });
  });
  sessionHub.on('UnallocatedToAllocatedNotification', function (student) {
    dispatch({ type: 'connection:onUnallocatedToAllocatedNotification', student });
  });
  sessionHub.on('AllocatedToUnallocatedNotification', function (student, AllocatedStudentId, TaxiId) {
    dispatch({ type: 'connection:onallocatedToUnallocatedNotification', student, AllocatedStudentId, TaxiId });
  });
  sessionHub.on('SaveAllocationPopupNotification', function (student) {
    dispatch({ type: types.SAVE_ALLOCATEDPOPUP_SUCCESS, student });
  });
  sessionHub.on('RemoveNotification', function (StudentCaxModifiedId) {
    dispatch({ type: 'connection:removeNotification', StudentCaxModifiedId });
  });

  sessionHub.on('PushCaxModifiedNotifications', function (modifiedStudents) {
    dispatch({ type: 'connection:pushCaxModifiedNotifications', modifiedStudents });
  });
});

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, reduxImmutableStateInvariant(), signalrMiddleware)
  );
}



