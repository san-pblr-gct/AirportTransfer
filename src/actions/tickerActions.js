import * as types from './../constants/actionTypes';
import 'ms-signalr-client';
import { loadKPI } from './searchActions';

const connection = $.hubConnection(types.SIGNALR, {
    useDefaultPath: false
})

export default function createSignalrMiddleware(actionDispatcher) {
    return store => {
        const dispatch = store.dispatch.bind(store)
        const stateConversion = {
            0: 'connecting',
            1: 'connected',
            2: 'reconnecting',
            4: 'disconnected'
        };

        var search = {};
        var keepAlive = false
        var wasConnected = false
        var currentState = null

        actionDispatcher(dispatch, connection);

        function onStateChanged(state) {
            if (currentState === state) {
                return
            }
            currentState = state
            console.log(currentState);
            dispatch({
                type: 'connection:statechanged',
                state: state
            });
        }

        connection.stateChanged(state => {
            const newStateName = stateConversion[state.newState]
            if (newStateName === 'connected') {

                wasConnected = true
                onStateChanged('connected')
            }
        });

        // When the connection drops, try to reconnect.
        connection.disconnected(function () {
            console.log('disconnected');
            if (keepAlive) {
                if (wasConnected) {
                    onStateChanged('reconnecting')
                    console.log('reconnecting');
                } else {
                    onStateChanged('connecting')
                    console.log('connecting');
                }
                connection.start();
            }
        });

        return next => action => {
            const { type } = action;
            switch (type) {
                case 'connection:onAddTaxiSuccess':
                    let taxi = action.taxi;
                    if (taxi.length > 0 &&
                        ($.trim(taxi[0].DestinationCode) == $.trim(search.destination)
                            || (($.trim(taxi[0].DestinationCode) == "GB-CAM" || $.trim(taxi[0].DestinationCode) == "GB-CAC") &&
                                ($.trim(search.destination) == "GB-CAM" || $.trim(search.destination) == "GB-CAC"))) &&
                        ($.trim(search.gateway) == "" ? true : $.trim(taxi[0].GateWayCode) == $.trim(search.gateway)) &&
                        $.trim(taxi[0].TransferTypeCode) == $.trim(search.transferType) &&
                        taxi[0].TransferDate.substring(0, 10) == $.trim(search.transferDate))
                        dispatch({ type: types.ADD_TAXI_SUCCESS, taxi });
                    return;
                case 'connection:onUnallocatedToAllocatedNotification':
                    let student = action.student;
                    dispatch(loadKPI(search));
                    dispatch({ type: types.UNALLOCATED_TO_ALLOCATED_SUCCESS, student });
                    return;
                case 'connection:onallocatedToUnallocatedNotification':
                    let unallocatedStudent = action.student;
                    let AllocatedStudentId = action.AllocatedStudentId;
                    let TaxiId = action.TaxiId;
                    dispatch(loadKPI(search));
                    dispatch({ type: types.ALLOCATED_TO_UNALLOCATED_SUCCESS, unallocatedStudent, AllocatedStudentId, TaxiId, search });
                    return;
                case 'connection:removeNotification':
                    let StudentCaxModifiedId = action.StudentCaxModifiedId;
                    dispatch({ type: types.REMOVE_NOTIFICATION_SUCCESS, StudentCaxModifiedId });
                    return;
                case 'connection:pushCaxModifiedNotifications':
                    let modifiedStudents = action.modifiedStudents;
                    modifiedStudents && modifiedStudents.map((modifiedStudent, index) => {

                        if (($.trim(modifiedStudent.DestinationCode) == $.trim(search.destination)
                            || (($.trim(modifiedStudent.DestinationCode) == "GB-CAM" || $.trim(modifiedStudent.DestinationCode) == "GB-CAC") &&
                                ($.trim(search.destination) == "GB-CAM" || $.trim(search.destination) == "GB-CAC"))) && 
                                ($.trim(search.gateway) == "" ? true : $.trim(modifiedStudent.GatewayCode) == $.trim(search.gateway)) &&
                            $.trim(modifiedStudent.TransferTypeCode) == $.trim(search.transferType) &&
                            modifiedStudent.TransferAllocatedDate.substring(0, 10) == $.trim(search.transferDate))
                            dispatch({ type: types.CAX_MODIFIED_PUSH_NOTIFICATIONS, modifiedStudent });
                    })

                    return;

                case 'connection:start':
                    search = action.search;
                    keepAlive = true
                    onStateChanged('connecting')
                    connection.start({
                        transport: [
                            'webSockets',
                            'serverSentEvents',
                            'longPolling'
                        ]
                    })
                    return;
                case 'connection:stop':
                    keepAlive = false
                    wasConnected = false
                    onStateChanged('disconnected')
                    connection.stop()
                    return;
                case 'connection:invoke':
                    const { hub, method, args } = action;
                    const proxy = connection[hub]
                    proxy.invoke(method, ...args)
                    return;
                default:
                    return next(action);
            }
        };
    };
}