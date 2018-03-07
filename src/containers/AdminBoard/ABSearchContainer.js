import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import Alert from 'react-s-alert';
import './../../styles/AdminBoard/ABstyles.css'; //Webpack can import CSS files too!
import * as ABSearchActions from '../../actions/AdminBoard/ABSearchActions';
import ABHeader from '../../components/AdminBoard/ABHeader';
import ABLeftMenu from '../../components/AdminBoard/ABLeftMenu';
import ABStudentList from '../../components/AdminBoard/ABStudentList';
import ABDetailedView from '../../components/AdminBoard/ABDetailedView';
import ABStudentFilter from '../../components/AdminBoard/ABStudentFilter';
import * as types from './../../constants/actionTypes';
import loadImg from '../../images/AdminBoard/loader_AB.gif';
import moment from 'moment';
import styled from 'styled-components';

const Loading = styled.div`
width: 64px;
height: 64px;
position: fixed;
z-index: 999;
margin: auto;
top: 0;
left: 0;
bottom: 0;
right: 0;
background: url(${loadImg}) no-repeat;
`;
const BrowserAlert = styled.div`
text-align: center;
background-color: beige;
font-family: 'Open Sans',sans-serif;
font-weight: bold;
font-size: 18px;
}
`;

class ABSearchContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            studentSearch: {
                ProductCode: "APP,CLT,IA,LS,LSP,SCH",
                ProgramCode: "AL,AY,AYP,CC,CY,EFC,GCSE,IAP,IB,IBP,ILC,ILC,ILS,ILS25,ILSP,ILSP,MLY,MLYP,PHS,PRW,UP,UPP",
                WeekFrom: this.getWeekFrom(),
                WeekTo: this.getWeekTo(),
                IsConfirmed: "false",
                AutoConfirmStatus: "",
                Status: "new",
                Destination: "",
                SalesBookingId: "",
                BookingType: "1"
            },
            studentSearchResults: this.props.studentSearchResults,
            selectedStudentData: {
                selectedSalesBookingId: '',
                selectedBookingId: '',
                selectedProgramcode: '',
                selectedProductcode: '',
                selectedAge: '',
                selectedGender: '',
                selectedNationality: '',
                selectedName: '',
                extraNight: '',
                daysBefore: '',
                daysAfter: ''
            },
            selectedOfflineFilters: {
                selectedAccommodationtype: [],
                selectedStatus: [],
                groupcodes: ""
            },
            filteredResults: [],
            quickSearchInput: '',
            bookingType: '',
            selectedStudents: [],
            selectedStudentsCount: 0,
            selectAll: false,
            Jira: {
                Description: "",
                LogType: "BookingDetails",
                Category: "",
                JiraHandleIn: "School",
                JiraAssignTo: "",
                JiraDueDate: "",
                JiraSchool: "",
                Source: "AB",
                emailSalesOffice: false,
                SalesBookingIdList: [],
                JiraUserName: "",
                JiraPassword: ""
            },
            MailMessage: {
                Body: ""
            },
            showInProgress: false,
            userProfile: true,
            confirmDropdown: true,
            showFilterTab: true,
            showDetailedInfoTab: false,
            bookingTypeInd: "",
            expandLeftMenu: true,
            expandRightMenu: false,
            typenewUnCon: true,
            typenewCon: false,
            typecax: false,
            typemodCon: false,
            typemodUnCon: false,
            quickFilterType: '',
            userSelected: false,
            accommodationTypes: [{ Code: "AP", Name: "Apartment" }, { Code: "HS", Name: "Homeshare" }, { Code: "HO", Name: "Hotel" }, { Code: "HF", Name: "Host Family" }, { Code: "OANA", Name: "OA/NA" }, { Code: "RE", Name: "Residence" }],
            statuses: [{ Code: "AC", Name: "Auto Confirmed" }, { Code: "MC", Name: "Manually Confirmed" }, { Code: "NC", Name: "Not Confirmed" }],
            IsSearchParameterChanged: true,
            showJiraDetailTab: false,
            appliedFilterCount: 0,
            totalAppliedFilterCount: 0,
            redirectToLogs: false,
            isGroupCodeChanged: false,
            groupAppliedFilterCount: 0,
            isProductFilterChanged: false,
            productAppliedFilterCount: 0,
            isProgramFilterChanged: false,
            programAppliedFilterCount: 0,
            isAccFilterChanged: false,
            AccAppliedFilterCount: 0,
            isStatusFilterChanged: false,
            StatusAppliedFilterCount: 0,
            selectedRecordsCount: 0,
            HasJiraAccess: false,
            dateFromFilterChangedCount: 0,
            dateToFilterChangedCount: 0,
            sortParameters: [{ "field": "StartWeekCode", "order": "asc" }],
            browserName: '',
            searchText: '',
            SearchFilterResult: [],
            searchInputText: '',
            SearchInputFilterResult: [],
            excludeInProgress: false,
            HasLoggedInUser:""
        };
        //this.browserCheck();
        this.searchStudent = this.searchStudent.bind(this);
        this.filterResult = this.filterResult.bind(this);
        this.onWeekFromChange = this.onWeekFromChange.bind(this);
        this.onWeekToChange = this.onWeekToChange.bind(this);
        this.onDestinationChange = this.onDestinationChange.bind(this);
        this.onBookingStatusChange = this.onBookingStatusChange.bind(this);
        this.onQuickSearchInputChange = this.onQuickSearchInputChange.bind(this);
        this.onStudentViewClick = this.onStudentViewClick.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.getDetailedInfoForDate = this.getDetailedInfoForDate.bind(this);
        this.onInProgressChange = this.onInProgressChange.bind(this);
        this.saveLogDetails = this.saveLogDetails.bind(this);
        this.onConfirmBookingButtonClick = this.onConfirmBookingButtonClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.studentJiraDetails = this.studentJiraDetails.bind(this);
        this.toggleStudentFilterView = this.toggleStudentFilterView.bind(this);
        this.onBookingTypeChange = this.onBookingTypeChange.bind(this);
        this.onAcknowledgeClick = this.onAcknowledgeClick.bind(this);
        this.onExpandChange = this.onExpandChange.bind(this);
        this.setConfirmDropdownState = this.setConfirmDropdownState.bind(this);
        this.setUserProfileState = this.setUserProfileState.bind(this);
        this.getWeekFromSelectedDate = this.getWeekFromSelectedDate.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.onProgramChange = this.onProgramChange.bind(this);
        this.onClearAllbtnClick = this.onClearAllbtnClick.bind(this);
        this.onAccommodationFilterChange = this.onAccommodationFilterChange.bind(this);
        this.onStatusFilterChange = this.onStatusFilterChange.bind(this);
        this.OfflineFilterApply = this.OfflineFilterApply.bind(this);
        this.onGroupCodeChange = this.onGroupCodeChange.bind(this);
        this.goToLogsSection = this.goToLogsSection.bind(this);
        this.hideLogsSection = this.hideLogsSection.bind(this);
        this.closeLogPopup = this.closeLogPopup.bind(this);
        this.onSelectAllRecords = this.onSelectAllRecords.bind(this);
        this.onClearSelection = this.onClearSelection.bind(this);
        this.addJiraLog = this.addJiraLog.bind(this);
        this.props.ABSearchActions.validateJiracredentials(this.props.user.Username, this.props.user.JiraPassword, this.props.user.SecurityToken);
        this.onFilterValueChanged = this.onFilterValueChanged.bind(this);
        this.orderByProperty = this.orderByProperty.bind(this);
        this.setJiraLogStudents = this.setJiraLogStudents.bind(this);
        this.onExcludeInProgressChecked = this.onExcludeInProgressChecked.bind(this);
        this.addJiraLogActionCall=this.addJiraLogActionCall.bind(this);
        this.onAssignedToChange=this.onAssignedToChange.bind(this);
    }

    componentWillMount() {
        this.props.ABSearchActions.reroute("adminboard");
        if (sessionStorage.getItem("user") === null) {
            browserHistory.push('/login');
        }
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.studentSearch !== this.props.studentSearch) {
            this.setState({ studentSearch: nextProps.studentSearch });
        }
        if (nextProps.studentSearchResults !== this.props.studentSearchResults) {
            //this.setState({ "selectedStudents": [] });
            this.filterResult(this.state.quickFilterType, 0, nextProps.studentSearchResults, true);
        this.onQuickSearchInputChange(this.state.searchText, nextProps.studentSearchResults,true);
           
        }
        if (nextProps.studentSearchResults != null && nextProps.studentSearchResults.length > 0 && this.state.quickFilterType == '') {
            this.OfflineFilterApply(this.state.selectedOfflineFilters, nextProps.studentSearchResults,false);
        }
        if (this.props.destinations && this.props.destinations.length > 0 && this.state.studentSearch.Destination == "") {
            this.searchStudent();
        }
        
        if (this.props.studentJiraDetailsResult !== nextProps.studentJiraDetailsResult)
            this.setState({ studentJiraDetailsResult: [...nextProps.studentJiraDetailsResult.sort(this.orderByProperty([{ "field": "JiraDateCreated", "order": "desc" }]))] });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }

    browserCheck() {
        var chrome = navigator.userAgent.indexOf('Chrome') > -1;
        var firefox = navigator.userAgent.indexOf('Firefox') > -1;
        var edge = navigator.userAgent.indexOf('Edge') > -1;

        if (chrome) {
            this.state.browserName = 'Chrome';
        }
        else if (edge) {
            this.state.browserName = 'Edge';
        }
        else if (firefox) {
            this.state.browserName = 'Firefox';
        }
        else {
            this.state.browserName = '';
        }
    }
    onExpandChange() {
        this.setState({ "expandLeftMenu": !this.state.expandLeftMenu });
    }
    handleClick(e) {
        if (!(e.target.outerHTML.includes("StudentItem") || e.target.outerHTML.includes("span") || e.target.innerHTML.includes("Acknowledge"))) {
            if (e.target.innerHTML == "--" || e.target.innerHTML == "==")
                this.setState({ "expandLeftMenu": !this.state.expandLeftMenu });
            else if (e.target.innerHTML.includes("option"))
                e.stopPropogation();
            else if (e.target.innerHTML.includes("New") || e.target.innerHTML.includes("Recently confirmed") || e.target.innerHTML.includes("CAX") || e.target.innerHTML.includes("Modified confirmed") || e.target.innerHTML.includes("Modified unconfirmed"))
                this.onBookingStatusChange(e.target.innerHTML);
        }
    }

    setJiraLogStudents() {
        var SalesBookingIds = [];
        this.state.selectedStudents.map((Item, j) => {
            SalesBookingIds.push(Item.SalesBookingId);
        });
        this.setState(
            {
                'Jira': Object.assign({}, this.state.Jira, { 'SalesBookingIdList': SalesBookingIds })
            }
        );
    }
    onSelectionChanged(student, indicator) {
        if (indicator == 1) {
            this.setState({
                'selectedStudents': [...this.state.selectedStudents, student], selectedRecordsCount: this.state.selectedRecordsCount + 1
            }, this.setJiraLogStudents)
        }
        else {

            this.setState({
                'selectedStudents': [...this.state.selectedStudents.filter(obj => obj.BookingId != student.BookingId)], selectedRecordsCount: this.state.selectedRecordsCount - 1
            }, this.setJiraLogStudents)
        }



    }
    onSelectAllRecords() {
        this.setState({
            'selectedStudents': this.state.filteredResults, selectedRecordsCount: this.state.filteredResults.length,
            'Jira': Object.assign({}, this.state.Jira, { 'SalesBookingIdList': this.state.filteredResults.SalesBookingId })
        })
    }
    onClearSelection() {
        this.setState({
            'selectedStudents': [], selectedRecordsCount: 0,
            'Jira': Object.assign({}, this.state.Jira, { 'SalesBookingIdList': "" })
        })
    }
    onBookingTypeChange(bookingType) {
        this.setState(
            {
                'totalAppliedFilterCount': 0,
                'dateToFilterChangedCount': 0,
                'dateFromFilterChangedCount': 0
            }
        );
        if (bookingType !== "" && bookingType == "1") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    BookingType: bookingType,
                    WeekFrom: this.getWeekFrom(),
                    WeekTo: this.getWeekTo(),
                    IsConfirmed: "false",
                    Status: "new"
                }),
                'IsSearchParameterChanged': true,
                'searchText': '',
                'searchInputText': '',
                typenewUnCon: true, typenewCon: false, typemodCon: false, typemodUnCon: false, typecax: false
            }, this.searchStudent);
        }
        else if (bookingType !== "" && bookingType == "2") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    WeekFrom: "",
                    WeekTo: "",
                    BookingType: bookingType,
                    IsConfirmed: "true",
                    Status: "mod"

                }),
                'IsSearchParameterChanged': true,
                'searchText': '',
                'searchInputText': '',
                typenewUnCon: false, typenewCon: false, typemodCon: true, typemodUnCon: false, typecax: false

            }, this.searchStudent);
        }
    }
    onInProgressChange() {
        this.setState({ "showInProgress": true, "confirmDropdown": false });
        this.props.ABSearchActions.getAdminBoardLogDropdowns(this.state.studentSearch.Destination, this.props.user.SecurityToken);
    }
    closeLogPopup() {
        this.setState({
            "showInProgress": false,
            "userProfile": false,
            "confirmDropdown": false,
            "selectedRecordsCount": 0,
            'Jira':Object.assign({},this.state.Jira,{
                JiraAssignTo:""
            })
        });
    }


    addJiraLogActionCall() {
        this.props.ABSearchActions.AdminBoardAddLog(this.state.Jira, this.state.MailMessage, this.props.user.SecurityToken)
            .then(
            (data) => {
                this.setState({
                    "showInProgress": false,
                    "userProfile": false,
                    "confirmDropdown": false
                });

                if (this.props.addLogStatus) {
                    Alert.success('Logs added successfully', {
                        position: 'top',
                        effect: 'bouncyflip',
                        html: true,
                        timeout: 5000
                    });
                    this.onClearSelection();
                }
                else {
                    this.setState({
                        'Jira': Object.assign({}, this.state.Jira, {
                            Description: "",
                            LogType: "Booking Details",
                            Category: "",
                            JiraHandleIn: "School",
                            JiraAssignTo: "",
                            JiraDueDate: "",
                            emailSalesOffice: true,
                            JiraUserName: this.props.user.Username,
                            JiraPassword: this.props.user.JiraPassword
                        })
                    });

                    Alert.error('Error while adding Logs', {
                        position: 'top',
                        effect: 'bouncyflip',
                        html: true,
                        timeout: 5000
                    });
                }
            }
            )
    }
    addJiraLog() {
        if (this.props.validJiraCredentials) {
            var SalesBookingIds = [];
            this.state.selectedStudents.map((Item, j) => {
                SalesBookingIds.push(Item.SalesBookingId);
            });
            this.setState(
                {
                    'Jira': Object.assign({}, this.state.Jira, { 'SalesBookingIdList': SalesBookingIds })
                },()=>this.addJiraLogActionCall());
        }
        else {

            message = "<ul> User does not have access to create Log!";
            Alert.error(message + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true,
                timeout: 5000
            });
        }

    }
    onAssignedToChange(event) {    
        if (event.target.value !== "") {
            this.setState({
                'Jira': Object.assign({}, this.state.Jira, {
                    JiraAssignTo: event.target.value               
                })
            });
        }
      }

    saveLogDetails(selectedLogTypeCode, selectedLogCategory, selectedLogHandleIn, selectedLogDueDate, selectedLogEmailSalesOffice, selectedLogComments) {
        Alert.closeAll();
        let message = "<ul>";
        let error = false;

        if ($.trim(selectedLogComments) === "") {
            error = true;
            message += '<li>Please enter Comments for Jira</li>';
        }
        if ($.trim(selectedLogTypeCode) === "") {
            error = true;
            message += '<li>Please select LogType for Jira</li>';
        }


        if (!error) {
            this.setState({
                'Jira': Object.assign({}, this.state.Jira, {
                    Description: selectedLogComments,
                    LogType: selectedLogTypeCode ? selectedLogTypeCode : "Booking Details",
                    Category: selectedLogCategory,
                    JiraHandleIn: selectedLogHandleIn ? selectedLogHandleIn : "School",
                    JiraAssignTo: this.state.Jira.JiraAssignTo ? this.state.Jira.JiraAssignTo : this.props.user.Username ,
                    JiraDueDate: selectedLogDueDate,
                    emailSalesOffice: selectedLogEmailSalesOffice,
                    JiraUserName: this.props.user.Username,
                    JiraPassword: this.props.user.JiraPassword,
                    JiraSchool: this.state.studentSearch.Destination
                }),
                'MailMessage': Object.assign({}, this.state.MailMessage, {
                    Body: selectedLogComments
                })
            }, this.addJiraLog);
        }
        else {
            Alert.error(message + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true
            });
        }
    }
    onDestinationChange(code) {
        this.setState({
            'studentSearch': Object.assign({}, this.state.studentSearch, {
                Destination: code
            }),
            'Jira': Object.assign({}, this.state.Jira, {
                JiraSchool: code
            }),
            'searchText': '',
            'searchInputText': ''
        }, this.searchStudent);
        this.setState({
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters, {
                groupcodes: "",
                selectedAccommodationtype: [],
                selectedStatus: []
            })
        });

    }
    onWeekFromChange(event) {
        this.setState({
            'studentSearch': Object.assign({}, this.state.studentSearch, {
                WeekFrom: event.target.value
            })
        });
    }
    onWeekToChange(event) {
        this.setState({
            'studentSearch': Object.assign({}, this.state.studentSearch, {
                WeekTo: event.target.value
            })
        });
    }
    onAccommodationFilterChange(accommodationCodes) {
        this.setState({
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters,
                {
                    selectedAccommodationtype: accommodationCodes
                })
        });
    }
    onStatusFilterChange(statusCodes) {
        this.setState({
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters,
                {
                    selectedStatus: statusCodes
                })
        });
    }
    onGroupCodeChange(event) {

        this.setState({
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters,
                {
                    groupcodes: event.target.value
                })
        });
        // if(event.target.value!="" && this.state.isGroupCodeChanged!=true)
        // {
        //     this.state.isGroupCodeChanged=true;
        // }
        // else{
        //     this.state.isGroupCodeChanged=false;
        // }       
    }
    OfflineFilterApply(selectedOfflineFilters, data,dataChanged=false) {
        let groups2 = [];
        if (selectedOfflineFilters.groupcodes != "") {
            let GroupCodes = selectedOfflineFilters.groupcodes.split(',');
            for (var i = 0; i < GroupCodes.length; i++) {
                for (var g = 0; g < data.length; g++) {
                    if (GroupCodes[i].trim().toUpperCase() == data[g].GroupCode.trim().toUpperCase()) {
                        groups2.push(data[g]);
                    }
                }
                //groups2.push(data.filter(m => (m.GroupCode !== null && m.GroupCode.trim()==GroupCodes[i])));
            }
        }
        else {
            if (this.state.searchText != '') {
                let filterResult=[];
                filterResult =[...this.state.filteredResults];
                for(var t=0; t< filterResult.length; t++){
                    for(var p=0;p< data.length; p++){
                        if(filterResult[t].BookingId == data[p].BookingId)
                             groups2.push(filterResult[t]);
                    }
                }
              }else
            groups2 = data;
        }
        if (selectedOfflineFilters.selectedAccommodationtype.length > 0) {
            if (selectedOfflineFilters.selectedAccommodationtype == "" || selectedOfflineFilters.selectedAccommodationtype == "All") {
                groups2 = groups2;
            }
            else {
                let accomGroups = [];
                for (var i = 0; i < selectedOfflineFilters.selectedAccommodationtype.length; i++) {
                    for (var g = 0; g < groups2.length; g++) {
                        if (groups2[g].Accommodationtype != null) {
                            if ((groups2[g].Accommodationtype.trim().toUpperCase() == "OA" || groups2[g].Accommodationtype.trim().toUpperCase() == "NA")
                                && selectedOfflineFilters.selectedAccommodationtype[i] == "OANA") {
                                accomGroups.push(groups2[g]);
                            }
                            else if (groups2[g].Accommodationtype.trim() == selectedOfflineFilters.selectedAccommodationtype[i]) {
                                accomGroups.push(groups2[g]);
                            }
                        }
                    }
                }
                groups2 = accomGroups;
            }
        }
        if (selectedOfflineFilters.selectedStatus.length > 0) {
            if ((selectedOfflineFilters.selectedStatus == "" || selectedOfflineFilters.selectedStatus == "All")) {
                groups2 = groups2;
            }
            else {
                let statusGroups = [];
                for (var i = 0; i < selectedOfflineFilters.selectedStatus.length; i++) {
                    for (var g = 0; g < groups2.length; g++) {
                        if (groups2[g].ConfirmedType.trim() == "" && selectedOfflineFilters.selectedStatus[i].trim().toUpperCase() == "NC") {
                            statusGroups.push(groups2[g]);
                        }
                        if (groups2[g].ConfirmedType.trim().toUpperCase() == selectedOfflineFilters.selectedStatus[i].trim().toUpperCase()) {
                            statusGroups.push(groups2[g]);
                        }
                    }
                }
                groups2 = statusGroups;
            }
        }
        if (this.state.excludeInProgress)
            groups2 = [...groups2.filter(m => !m.IsInProgress)]
        this.setState({
            'filteredResults': this.state.sortParameters.length > 0 ? groups2.sort(this.orderByProperty(this.state.sortParameters)) : groups2
        });
    }
    getWeekFromSelectedDate(event, type) {
        let now = new Date(event);
        let onejan = new Date(now.getFullYear(), 0, 1);
        let data = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        let week = data < 10 ? (new Date(event).getFullYear().toString().substr(-2)) + "0" + data.toString() : (new Date(event).getFullYear().toString().substr(-2)) + data.toString();

        if (type === "from") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, { WeekFrom: week })
            });
            this.state.dateFromFilterChangedCount = 1;
        }
        else {
            this.setState({ 'studentSearch': Object.assign({}, this.state.studentSearch, { WeekTo: week }) });
            this.state.dateToFilterChangedCount = 1;
        }

        this.setState({
            'IsSearchParameterChanged': true
        });
    }

    onProductChange(code) {
         if (code !== "" && code !== "All") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, { ProductCode: code.toString() }),
                'IsSearchParameterChanged': true
            });
            this.state.appliedFilterCount = this.state.appliedFilterCount + 1;
        }
        else {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    ProductCode: "APP,CLT,LS,LSP,SCH"
                }),
                'IsSearchParameterChanged': true,
                'appliedFilterCount': this.state.appliedFilterCount - 1
            });
        }
    }
    onClearAllbtnClick() {
        if (this.state.studentSearch.BookingType == "1") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    ProgramCode: "AY,AYP,CC,CY,EFC,ILC,ILS,ILS25,ILSP,MLY,MLYP,PHS,PRW,UP,UPP",
                    ProductCode: "APP,CLT,LS,LSP,SCH",
                    WeekFrom: this.getWeekFrom(),
                    WeekTo: this.getWeekTo()
                })
            });
        }
        else {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    ProgramCode: "AY,AYP,CC,CY,EFC,ILC,ILS,ILS25,ILSP,MLY,MLYP,PHS,PRW,UP,UPP",
                    ProductCode: "APP,CLT,LS,LSP,SCH",
                    WeekFrom: "",
                    WeekTo: ""
                })
            });
        }
        this.setState({
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters, {
                groupcodes: "",
                selectedAccommodationtype: [],
                selectedStatus: []
            })
        });
        this.setState({
            'IsSearchParameterChanged': true,
            'totalAppliedFilterCount': 0
        });
        this.state.totalAppliedFilterCount = 0;
    }
    onProgramChange(programCode) {
        if (programCode != "" && programCode != "All") {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    ProgramCode: programCode.toString()
                }),
                'IsSearchParameterChanged': true
            });
        }
        else {
            this.setState({
                'studentSearch': Object.assign({}, this.state.studentSearch, {
                    ProgramCode: "AY,AYP,CC,CY,EFC,ILC,ILS,ILS25,ILSP,MLY,MLYP,PHS,PRW,UP,UPP"
                }),
                'IsSearchParameterChanged': true
            });
        }
    }
    getWeekFrom() {
        let now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        let onejan = new Date(now.getFullYear(), 0, 1);
        let data = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return data < 10 ? (new Date().getFullYear().toString().substr(-2)) + "0" + data.toString() : (new Date().getFullYear().toString().substr(-2)) + data.toString();
    }
    getWeekTo() {
        let now = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        let onejan = new Date(now.getFullYear(), 0, 1);
        let lastDay = new Date(now.getFullYear(), 11, 31);
        let currentWeekCode = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        let data = currentWeekCode == 1 ? Math.ceil((((lastDay - onejan) / 86400000)) / 7) : (currentWeekCode) - 1;
        return data < 10 ? ((new Date().getFullYear() + 1).toString().substr(-2)) + "0" + data.toString() :
            data == 52 ? (new Date().getFullYear().toString().substr(-2)) + data.toString() : ((new Date().getFullYear() + 1).toString().substr(-2)) + data.toString();
    }
    onExcludeInProgressChecked() {
        this.setState({ 'excludeInProgress': !this.state.excludeInProgress });
    }
    searchStudent() {
        Alert.closeAll();
        let message = "<ul>";
        let error = false;

        if ($.trim(this.state.studentSearch.WeekFrom) !== "") {
            if (!/^([1-2][0-9])(5[0-3]|[1-4][0-9]|0[1-9])$/.test(this.state.studentSearch.WeekFrom)) {
                error = true;
                message += '<li>Please enter valid course week from</li>';
            }
        }
        if ($.trim(this.state.studentSearch.WeekTo) !== "") {
            if (!/^([1-2][0-9])(5[0-3]|[1-4][0-9]|0[1-9])$/.test(this.state.studentSearch.WeekTo)) {
                error = true;
                message += '<li>Please enter valid course week to</li>';
            }
            if (this.state.studentSearch.WeekTo < this.state.studentSearch.WeekFrom) {
                error = true;
                message += '<li>End week to cannot be before start week from</li>';
            }
        }
        if (!error) {
            if (this.state.studentSearch.Destination == '' && this.props.destinations && this.props.destinations.length > 0) {
                this.state.studentSearch.Destination = this.props.destinations[0].Code;
                this.state.Jira.JiraSchool = this.props.destinations[0].Code;

            }
            // this.state.quickFilterType = '';           
            if (this.state.isGroupCodeChanged) {
                this.state.groupAppliedFilterCount = 1;
            }
            else {
                this.state.groupAppliedFilterCount = 0;
            }
            if (this.state.isProductFilterChanged) {
                this.state.productAppliedFilterCount = 1;
            }
            else {
                this.state.productAppliedFilterCount = 0;
            }
            if (this.state.isProgramFilterChanged) {
                this.state.programAppliedFilterCount = 1;
            }
            else {
                this.state.programAppliedFilterCount = 0;
            }
            if (this.state.isAccFilterChanged) {
                this.state.AccAppliedFilterCount = 1;
            }
            else {
                this.state.AccAppliedFilterCount = 0;
            }
            if (this.state.isStatusFilterChanged) {
                this.state.StatusAppliedFilterCount = 1;
            }
            else {
                this.state.StatusAppliedFilterCount = 0;
            }

            this.state.totalAppliedFilterCount = this.state.dateToFilterChangedCount + this.state.dateFromFilterChangedCount + this.state.productAppliedFilterCount + this.state.programAppliedFilterCount +
                this.state.StatusAppliedFilterCount + this.state.AccAppliedFilterCount + this.state.groupAppliedFilterCount;


            if (this.state.IsSearchParameterChanged) {
                this.setState({ 'IsSearchParameterChanged': false });
                this.onClearSelection();
                this.onStudentViewClick('');
                this.props.ABSearchActions.getStudentList(this.state.studentSearch, this.props.user.SecurityToken);
                this.setState({ quickFilterType: '', userProfile: false, confirmDropdown: false, searchText: '', searchInputText: '' });
            }
            else {
                this.OfflineFilterApply(this.state.selectedOfflineFilters, this.props.studentSearchResults);
            }
            if (this.state.searchText != '') {
                this.setState({
                    'filteredResults': this.state.SearchFilterResult
                });
            }
            if (this.state.searchInputText !== '' && this.state.searchInputText !== 'All') {
                this.setState({
                    'filteredResults': this.state.SearchInputFilterResult
                });
            }
        }
        else {
            Alert.error(message + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true
            });
        }

    }
    onBookingStatusChange(event) {
        var selectedbookingtype = "", confirmed = "";
        this.setState({
            'IsSearchParameterChanged': true
        });
        switch (event.target.innerHTML) {
            case 'New': selectedbookingtype = "new"; confirmed = "false";
                this.setState({
                    typenewUnCon: true, typenewCon: false, typemodCon: false, typemodUnCon: false, typecax: false, searchText: '', searchInputText: ''
                });
                break;
            case 'Recently confirmed': selectedbookingtype = "new"; confirmed = "true";
                this.setState({
                    typenewUnCon: false, typenewCon: true, typemodCon: false, typemodUnCon: false, typecax: false, searchText: '', searchInputText: ''
                });
                break;
            case 'Modified confirmed': selectedbookingtype = "mod"; confirmed = "true";
                this.setState({
                    typenewUnCon: false, typenewCon: false, typemodCon: true, typemodUnCon: false, typecax: false, searchText: '', searchInputText: ''
                });
                break;
            case 'Modified unconfirmed': selectedbookingtype = "mod"; confirmed = "false";
                this.setState({
                    typenewUnCon: false, typenewCon: false, typemodCon: false, typemodUnCon: true, typecax: false, searchText: '', searchInputText: ''
                });
                break;
            case 'CAX': selectedbookingtype = "cax"; confirmed = "false";
                this.setState({
                    typenewUnCon: false, typenewCon: false, typemodCon: false, typemodUnCon: false, typecax: true, searchText: '', searchInputText: ''
                });
                break;
        }
        this.setState(
            {
                'totalAppliedFilterCount': 0,
                'dateToFilterChangedCount': 0,
                'dateFromFilterChangedCount': 0
            }
        )
        this.setState({
            'studentSearch': Object.assign({}, this.state.studentSearch, {
                Status: selectedbookingtype,
                IsConfirmed: confirmed
            }), 'bookingType': selectedbookingtype
        }, this.searchStudent);
    }
    onQuickSearchInputChange(searchItem,filterData=[],dataChanged=false) {
        let groups2 = [];
      
        if (searchItem === "" || searchItem == null) {
            if (this.state.searchInputText != '' || this.state.searchInputText !== 'All' || this.state.quickFilterType != '')
                groups2 = this.state.SearchInputFilterResult;
            else
                groups2 = this.state.filteredResults;
            this.setState({ 'searchText': '', searchInputText: '' });
        }
        else {
            this.setState({ 'searchText': searchItem, searchInputText: '' });
            searchItem = searchItem.toLowerCase();
            if (this.state.searchInputText != '' || this.state.searchInputText !== 'All' || this.state.quickFilterType != '')
             {
                if(filterData.length > 0)
                groups2 = filterData
                else
                groups2 = this.state.SearchInputFilterResult;
             } 
            else
                groups2 = this.state.filteredResults;

            groups2 = groups2.filter(m => (m.StudentName !== null && m.StudentName.toLowerCase().includes(searchItem)) ||
            m.Age.toString().includes(searchItem) || (m.Nationality !== null && m.Nationality.toLowerCase().includes(searchItem))
            || (m.ProgramCode !== null && m.ProgramCode.toLowerCase().includes(searchItem)) || (m.Course !== null && m.Course.toLowerCase().includes(searchItem))
            || (m.ArticleCode !== null && m.ArticleCode.toLowerCase().includes(searchItem))
            || m.StartWeekCode.toString().includes(searchItem) || m.EndWeekCode.toString().includes(searchItem)
            || (m.SalesBookingId !== null && m.SalesBookingId.toLowerCase().includes(searchItem))
            || (m.GroupCode !== null && m.GroupCode.toLowerCase().includes(searchItem)));
        }
        if (this.state.excludeInProgress)
            groups2 = [...groups2.filter(m => !m.IsInProgress)];
        this.setState({
            'filteredResults': groups2,
            'SearchFilterResult': groups2
        });
        if(!dataChanged)
        {
            this.onClearSelection();
            this.onStudentViewClick('');
        }
       
    }

    orderByProperty(parameters) {
        if (parameters.length > 0) {
            let key = parameters[0].field;
            let order = parameters[0].order;
            let that = this;
            return function (a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    return 0;
                }
                const varA = (typeof a[key] === 'string') ?
                    a[key].toUpperCase() : a[key];
                const varB = (typeof b[key] === 'string') ?
                    b[key].toUpperCase() : b[key];
                let equality = 0;
                if (varA > varB) {
                    equality = 1;
                } else if (varA < varB) {
                    equality = -1;
                }

                if (equality === 0 && parameters.length > 1) {
                    return that.orderByProperty(Array.prototype.slice.call(parameters, 1))(a, b);
                }
                return (
                    (order == 'desc') ? (equality * -1) : equality
                );
            };
        }
        else
            return 0;
    }



    filterResult(inputFilter, indicator, filterData, dataChanged = false) {
        if(filterData === undefined || filterData.length === undefined || indicator == 4) {
            filterData = [...this.props.studentSearchResults];
        }

        if (indicator == 3) {
            filterData = [...this.state.SearchInputFilterResult]
        }
        if (this.state.searchText != '' && indicator != 4 && !dataChanged) {
                filterData =[...this.state.SearchFilterResult]
        }
        switch (inputFilter) {
            case "U18": filterData = filterData.filter(obj1 => obj1.Age < 18);
                break;
            case "T4": filterData = filterData.filter(obj1 => obj1.IsVisa == true);
                break;
            case "I20": filterData = filterData.filter(obj1 => obj1.VisaTypeCode !== null && obj1.VisaTypeCode.trim() == "I-20");
                break;
            case "INT": filterData = filterData.filter(obj1 => obj1.isInternship == true);
                break;
            case "JU": filterData = filterData.filter(obj1 => obj1.Course !== null && obj1.Course.trim() == "JU" || obj1.Course.trim() == "JI");
                break;
            case "HF": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "HF");
                break;
            case "HS": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "HS");
                break;
            case "RE": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "RE");
                break;
            case "HO": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "HO");
                break;
            case "AP": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "AP");
                break;
            case "NA": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "NA");
                break;
            case "OA": filterData = filterData.filter(obj1 => obj1.Accommodationtype !== null && obj1.Accommodationtype.trim() == "OA");
                break;
            case "UP": filterData = filterData.filter(obj1 => obj1.ProgramCode !== null && obj1.ProgramCode.trim() == "UP" || obj1.ProgramCode.trim() == "UPP");
                break;
        }


        let sortParameters = [...this.state.sortParameters];

        let item = { "field": indicator, "order": "asc" }
        let param = sortParameters.filter(el => el.field === indicator)[0];
        if (param !== undefined) {
            if (param.order === "desc")
                sortParameters = [...sortParameters.filter(el => el.field !== indicator)]
            else {
                item.order = "desc";
                Object.assign(sortParameters, sortParameters.map(el => el.field === item.field ? item : el))
            }
        }
        else if (indicator !== 0)
            sortParameters = [...sortParameters, item]
        if (this.state.excludeInProgress)
            filterData = [...filterData.filter(m => !m.IsInProgress)]
        if (sortParameters.length > 0)
            filterData = filterData.sort(this.orderByProperty(sortParameters));
        this.setState({ 'filteredResults': filterData, quickFilterType: inputFilter, 'sortParameters': sortParameters, 'searchInputText': inputFilter, 'SearchInputFilterResult': filterData });
        if (!dataChanged) {
            this.onClearSelection();
            this.onStudentViewClick('');
        }
    }

    onStudentViewClick(student) {
        if (student != '') {
            this.setState({
                'selectedStudentData': Object.assign({}, this.state.selectedStudentData, {
                    selectedSalesBookingId: student.SalesBookingId,
                    selectedBookingId: student.BookingId,
                    selectedProductcode: student.ProductCode,
                    selectedProgramcode: student.ProgramCode,
                    selectedAge: student.Age,
                    selectedGender: student.Gender,
                    selectedNationality: student.Nationality,
                    selectedName: student.StudentName,
                    extraNight: student.IsXtraNight,
                    daysBefore: student.Prenights,
                    daysAfter: student.PostNights
                }),
                showFilterTab: false,
                showDetailedInfoTab: true,
                expandRightMenu: true,
                studentJiraDetailsResult: []
            });
            this.props.ABSearchActions.getStudentDetailedInfo(student.BookingId, this.state.studentSearch.Destination, this.state.studentSearch.WeekFrom, null, this.props.user.SecurityToken);
        }
        else {
            this.setState({
                'selectedStudentData': Object.assign({}, this.state.selectedStudentData, {
                    selectedSalesBookingId: '',
                    selectedBookingId: '',
                    selectedProductcode: '',
                    selectedProgramcode: '',
                    selectedAge: '',
                    selectedGender: '',
                    selectedNationality: '',
                    selectedName: '',
                    extraNight: '',
                    daysBefore: '',
                    daysAfter: ''
                }),
                showFilterTab: true,
                showDetailedInfoTab: false,
                expandRightMenu: false
            });
        }
    }
    getDetailedInfoForDate(changeDate) {
        this.props.ABSearchActions.getStudentDetailedInfo(this.state.selectedStudentData.selectedBookingId, this.state.studentSearch.Destination, this.state.studentSearch.WeekFrom, changeDate, this.props.user.SecurityToken);
    }
    onConfirmBookingButtonClick(param) {
        if (this.state.selectedStudents.length === 0) {
            Alert.closeAll();
            Alert.error('Please select a student to confirm', { position: 'top', effect: 'bouncyflip', html: true, timeout: 5000 });
            return;
        }
        var itemList = [];
        var nonUPBookings = [];
        this.state.selectedStudents.map((g, i) => {
            var CourseBookingIds = [];
            if (!g.ProgramCode.includes('UP'))
                nonUPBookings.push(g.SalesBookingId);
            g.CourseBookingDetails.map((courseBookingItem, j) => {
                CourseBookingIds.push(courseBookingItem.CourseBookingId);
            });
            var item = { "BookingId": g.BookingId, "CourseBookingIds": CourseBookingIds, "BookingArticleIds": [] };
            itemList.push(item);
        });
        if (nonUPBookings.length > 0 && param === 4) {
            Alert.closeAll();

            if (nonUPBookings.length === this.state.selectedStudents.length) {
                Alert.error('Please select atleast one UP booking', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true
                });
                return;
            }
            else {
                let message = "<h4>The below bookings are not UP bookings and will be ignored for this operation</h4><ul>";
                nonUPBookings.map((booking, j) => {
                    message += '<li>' + booking + '</li>';
                });
                Alert.warning(message + '</ul>', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true
                });
            }
        }

        var data = { "BookingConfirmations": itemList, "DestinationCode": this.state.studentSearch.Destination, "Param": param, "UserID": this.props.user.UserID }
        this.props.ABSearchActions.ConfirmBookings(data, this.props.user.SecurityToken)
            .then((data) => {
                Alert.success('Bookings confirmed successfully', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true,
                    timeout: 5000
                });
                this.onClearSelection();
                this.onStudentViewClick('');
            }
            ).catch((error) => {
                console.log(error);
                Alert.error('Error while confirming bookings', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true,
                    timeout: 5000
                });
            });
    }
    studentJiraDetails(SalesBookingId, destinationCode) {
        if (SalesBookingId != "") {
            this.setState({
                'selectedSalesBookingId': SalesBookingId,
                'destinationCode': destinationCode,
                'showFilterTab': false,
                'showDetailedInfoTab': true
            });
            this.props.ABSearchActions.getStudentJiraInfo(SalesBookingId, destinationCode, this.props.user.SecurityToken);
        }
        else {
            this.setState({
                'showJiraDetailTab': false
            });
        }
    }
    toggleStudentFilterView() {
        this.setState({
            showFilterTab: !this.state.showFilterTab,
            showDetailedInfoTab: false,
            expandRightMenu: false,
            IsSearchParameterChanged: true,
            'studentSearch': Object.assign({}, this.state.studentSearch, {
                WeekFrom: this.state.studentSearch.BookingType == "2" ? this.state.studentSearch.WeekFrom : this.getWeekFrom(),
                WeekTo: this.state.studentSearch.BookingType == "2" ? this.state.studentSearch.WeekTo : this.getWeekTo()
            }),
            'selectedOfflineFilters': Object.assign({}, this.state.selectedOfflineFilters, {
                Accommodationtype: "All",
                status: "All",
                groupcodes: "",
                selectedAccommodationtype: 'All',
                selectedStatus: 'All',
                groupcodes: ""
            })
        });
    }
    onAcknowledgeClick() {
        if (this.state.selectedStudents.length === 0) {
            Alert.closeAll();
            Alert.error('Please select a student to acknowledge', { position: 'top', effect: 'bouncyflip', html: true, timeout: 5000 });
            return;
        }
        var itemList = []
        this.state.selectedStudents.map((g, i) => {
            var CourseBookingIds = [];
            g.CourseBookingDetails.map((courseBookingItem, j) => {
                CourseBookingIds.push(courseBookingItem.CourseBookingId);
            });
            var item = { "BookingId": g.BookingId, "CourseBookingIds": CourseBookingIds, "BookingArticleIds": [] };
            itemList.push(item);
        });
        var data = { "BookingConfirmations": itemList, "DestinationCode": this.state.studentSearch.Destination, "UserID": this.props.user.UserID }
        this.props.ABSearchActions.AcknowledgeBookings(data, this.props.user.SecurityToken)
            .then((data) => {
                Alert.success('Bookings acknowledged successfully', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true,
                    timeout: 5000
                });
                this.onClearSelection();
                this.onStudentViewClick('');
            }
            ).catch((error) => {
                console.log(error);
                Alert.error('Error while acknowledging bookings', {
                    position: 'top',
                    effect: 'bouncyflip',
                    html: true,
                    timeout: 5000
                });
            });
    }
    setUserProfileState() {
        this.setState({ "userProfile": true });
    }
    setConfirmDropdownState() {
        this.setState({ "confirmDropdown": true });
    }
    goToLogsSection() {
        this.setState({ 'redirectToLogs': true });
    }
    hideLogsSection() {
        this.setState({ 'redirectToLogs': false });
    }
    onFilterValueChanged(isChanged, whatchanged) {
        if (whatchanged == "group")
            this.state.isGroupCodeChanged = isChanged;

        if (whatchanged == "product")
            this.state.isProductFilterChanged = isChanged;

        if (whatchanged == "program")
            this.state.isProgramFilterChanged = isChanged;

        if (whatchanged == "Accommodation")
            this.state.isAccFilterChanged = isChanged;

        if (whatchanged == "Status")
            this.state.isStatusFilterChanged = isChanged;

    }

    render() {
        const MainView = styled.div`
            overflow-y: hidden;
            float: left;            
            position: relative; 
            z-index: 150;
            border-right: 1px solid #F0F0F0;
            width: 72%;
            ${props => props.left && props.right == false ? 'width:60%;' : ''}
            ${props => props.left && props.right ? 'width:55%;' : ''}            
            ${props => props.left == false && props.right ? 'width:67%;' : ''} 
        `;
        return (
            this.props.path == "adminboard" ?
                <div id="AB" ref={node => this.node = node}>

                    <div>
                        {(this.props.studentSearchLoading || this.props.studentGeneralSearchLoading || this.props.studentLogDetailsLoading) ?
                            <div className="fullWindow"><Loading /></div>
                            : null}

                        <ABLeftMenu expandLeftMenu={this.state.expandLeftMenu} typenewUnCon={this.state.typenewUnCon} typenewCon={this.state.typenewCon} typecax={this.state.typecax} typemodCon={this.state.typemodCon} typemodUnCon={this.state.typemodUnCon} studentSearch={this.state.studentSearch} onBookingStatusChange={this.onBookingStatusChange} onBookingTypeChange={this.onBookingTypeChange} bookingTypeInd={this.state.studentSearch.BookingType} onExpandChange={this.onExpandChange} />
                        <ABHeader filteredsearchText={this.state.searchText} totalAppliedFilterCount={this.state.totalAppliedFilterCount} user={this.props.user} userProfile={this.state.userProfile} setUserProfileState={this.setUserProfileState} selectedDestination={this.state.studentSearch.Destination} destinations={this.props.destinations} onDestinationChange={this.onDestinationChange} toggleStudentFilterView={this.toggleStudentFilterView} onQuickSearchInputChange={this.onQuickSearchInputChange} filterResult={this.filterResult} {...this.props} quickFilterType={this.state.quickFilterType} selectedDestinationCode={this.state.studentSearch.Destination} />

                        <ABStudentList totalAppliedFilterCount={this.state.totalAppliedFilterCount} bookingType={this.state.bookingType} filteredResults={this.state.filteredResults} onStudentViewClick={this.onStudentViewClick} goToLogsSection={this.goToLogsSection} hideLogsSection={this.hideLogsSection} selectedStudents={this.state.selectedStudents} left={this.state.expandLeftMenu} right={this.state.expandRightMenu} selectedDestinationCode={this.state.studentSearch.Destination} quickFilterType={this.state.quickFilterType}
                            onSelectionChanged={this.onSelectionChanged} selectedStudentData={this.state.selectedStudentData} sortParameters={this.state.sortParameters} onSelectAllRecords={this.onSelectAllRecords} onClearSelection={this.onClearSelection} filterResult={this.filterResult} studentJiraDetails={this.studentJiraDetails} />

                        {this.state.showFilterTab == false ?
                            <ABDetailedView selectedStatus={this.state.studentSearch.Status} onStudentViewClick={this.onStudentViewClick} selectedStudentData={this.state.selectedStudentData} studentDetailedInfoResult={this.props.studentDetailedInfoResult} getDetailedInfoForDate={this.getDetailedInfoForDate} selectedDestinationCode={this.state.studentSearch.Destination} studentJiraDetailsResult={this.props.studentJiraDetailsResult} studentJiraDetails={this.studentJiraDetails} openJiraLog={this.openJiraLog} showFilterTab={this.state.showFilterTab} confirmDropdown={this.state.confirmDropdown} setConfirmDropdownState={this.setConfirmDropdownState}
                                bookingType={this.state.bookingType} filteredResults={this.state.filteredResults} onInProgressChange={this.onInProgressChange} addLogDropDowns={this.props.addLogDropDowns} HasLoggedInUser={this.state.Jira.JiraAssignTo ? this.state.Jira.JiraAssignTo :this.props.user.Username} onLogTypeChange={this.onLogTypeChange} logTypeChangeIndicator={this.state.logTypeChangeIndicator} showDetailedInfoTab={this.state.showDetailedInfoTab}
                                addLogStatus={this.props.addLogStatus} closeLogPopup={this.closeLogPopup} selectedRecordsCount={this.state.selectedRecordsCount} typenewUnCon={this.state.typenewUnCon} typenewCon={this.state.typenewCon} typecax={this.state.typecax} typemodCon={this.state.typemodCon} typemodUnCon={this.state.typemodUnCon}
                                onAssignedToChange={this.onAssignedToChange} selectedStudents={this.state.selectedStudents} saveLogDetails={this.saveLogDetails} onConfirmBookingButtonClick={this.onConfirmBookingButtonClick} showInProgress={this.state.showInProgress} onAcknowledgeClick={this.onAcknowledgeClick} userSelected={this.state.userSelected} redirectToLogs={this.state.redirectToLogs} hideLogsSection={this.hideLogsSection} user={this.props.user} />
                            : null}

                        <ABStudentFilter isGroupCodeChanged={this.state.isGroupCodeChanged} onFilterValueChanged={this.onFilterValueChanged} onGroupCodeChange={this.onGroupCodeChange} onStatusFilterChange={this.onStatusFilterChange} onAccommodationFilterChange={this.onAccommodationFilterChange} onGroupCodeChange={this.onGroupCodeChange} onStatusFilterChange={this.onStatusFilterChange} onAccommodationFilterChange={this.onAccommodationFilterChange} onClearAllbtnClick={this.onClearAllbtnClick} selectedOfflineFilters={this.state.selectedOfflineFilters} accommodationTypes={this.state.accommodationTypes} statuses={this.state.statuses} onProgramChange={this.onProgramChange} onProductChange={this.onProductChange} getWeekToFromSelectedDate={this.getWeekToFromSelectedDate} getWeekFromSelectedDate={this.getWeekFromSelectedDate} typenewUnCon={this.state.typenewUnCon} typenewCon={this.state.typenewCon} typecax={this.state.typecax} typemodCon={this.state.typemodCon} typemodUnCon={this.state.typemodUnCon} products={this.props.products} programs={this.props.programs} onWeekFromChange={this.onWeekFromChange} onWeekToChange={this.onWeekToChange} studentSearch={this.state.studentSearch} onSearchbtnClick={this.searchStudent} showFilterTab={this.state.showFilterTab}
                            bookingType={this.state.bookingType} filteredResults={this.state.filteredResults} onInProgressChange={this.onInProgressChange} addLogDropDowns={this.props.addLogDropDowns} HasLoggedInUser={this.state.Jira.JiraAssignTo ? this.state.Jira.JiraAssignTo :this.props.user.Username} onLogTypeChange={this.onLogTypeChange} logTypeChangeIndicator={this.state.logTypeChangeIndicator} confirmDropdown={this.state.confirmDropdown} setConfirmDropdownState={this.setConfirmDropdownState} HasJiraAccess={this.props.validJiraCredentials}
                            selectedBookingType={this.state.studentSearch.BookingType} addLogStatus={this.props.addLogStatus} closeLogPopup={this.closeLogPopup} selectedStudents={this.state.selectedStudents} saveLogDetails={this.saveLogDetails} onConfirmBookingButtonClick={this.onConfirmBookingButtonClick} showInProgress={this.state.showInProgress} onAcknowledgeClick={this.onAcknowledgeClick} userSelected={this.state.userSelected} selectedRecordsCount={this.state.selectedRecordsCount}
                            onAssignedToChange={this.onAssignedToChange} onExcludeInProgressChecked={this.onExcludeInProgressChecked} excludeInProgress={this.state.excludeInProgress} />
                    </div>

                </div>
                :
                null
        );
    }
}

ABSearchContainer.propTypes = {
    studentFilterTypeCode: PropTypes.array,
    ABSearchActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {

    return {
        studentFilterTypeCode: state.studentFilterTypeCode,
        studentSearch: state.studentSearch,
        studentSearchResults: [...state.studentSearchResults],
        user: state.user,
        path: state.path,
        destinations: state.destinations,
        quickSearchInput: state.quickSearchInput,
        studentSearchLoading: state.studentSearchLoading,
        studentGeneralSearchLoading: state.studentGeneralSearchLoading,
        studentDetailedInfoResult: state.studentDetailedInfoResult,
        addLogDropDowns: state.addLogDropDowns,
        addLogStatus: state.addLogStatus,
        studentJiraDetailsResult: state.studentJiraDetailsResult,
        programs: state.programs,
        products: state.products,
        selectedOfflineFilters: state.selectedOfflineFilters,
        validJiraCredentials: state.validJiraCredentials,
        studentLogDetailsLoading: state.studentLogDetailsLoading

    };
}

function mapDispatchToProps(dispatch) {
    return {
        ABSearchActions: bindActionCreators(ABSearchActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ABSearchContainer);       