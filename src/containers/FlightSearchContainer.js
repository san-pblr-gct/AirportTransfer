import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextInput from '../components/common/TextInput';
import HeaderContainer from './HeaderContainer';
import Alert from 'react-s-alert';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import SelectInput from '../components/common/SelectInput';
import TerminalEditor from '../components/top/Terminal';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-blue.css';
import * as flightSearchActions from '../actions/flightSearchActions';
import moment from 'moment';
import 'ag-grid';
import SkyLight from 'react-skylight';

class FlightSearchContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            error: "",
            loading: false,
            flightSearch: this.props.flightSearch,
            programs: [],
            gridOptions: {},
            api: {},
            subject: "",
            message: "",
            filterModel:{},
            sortModel:{},
            columnDefs : []
        };

        this.onDestinationChange = this.onDestinationChange.bind(this);
        this.onProductChange = this.onProductChange.bind(this);
        this.onProgramChange = this.onProgramChange.bind(this);
        this.onAccommodationTypeChange = this.onAccommodationTypeChange.bind(this);
        this.onflightTypeChange = this.onflightTypeChange.bind(this);
        this.ontransferArticleChange = this.ontransferArticleChange.bind(this);
        this.onflightDateFromChange = this.onflightDateFromChange.bind(this);
        this.onflightDateToChange = this.onflightDateToChange.bind(this);
        this.onCourseWeekFromChange = this.onCourseWeekFromChange.bind(this);
        this.onCourseWeekToChange = this.onCourseWeekToChange.bind(this);
        this.onGroupChange = this.onGroupChange.bind(this);
        this.onMissingFlightDetailChange = this.onMissingFlightDetailChange.bind(this);
        this.onMissingTransferAllocationChange = this.onMissingTransferAllocationChange.bind(this);
        this.onAllGroupBookingsChange = this.onAllGroupBookingsChange.bind(this);
        this.onNoTransferChange = this.onNoTransferChange.bind(this);
        this.onGridReady = this.onGridReady.bind(this);
        this.updateTerminal = this.updateTerminal.bind(this);
    }

    updateTerminal(data, newTerminal) {
    
        this.setState({
            'filterModel': this.state.gridOptions.api.getFilterModel()
        });
        this.setState({
            'sortModel': this.state.gridOptions.api.getSortModel()
        });
        this.props.flightSearchActions.saveFlightTerminal(data.FlightTerminalId, data.Booking_id, data.FlightId,
            $.trim(this.props.flightSearch.DestinationCode),
            $.trim(this.props.flightSearch.TransferType) == 'TFARR' ? newTerminal : data.ArrDepArrTerminal,
            $.trim(this.props.flightSearch.TransferType) == 'TFDEP' ? newTerminal : data.ArrDepArrTerminal,
            $.trim(this.props.flightSearch.TransferType),
            this.props.user.UserID, this.props.user.SecurityToken)
            .then((data) => {
              this.props.flightSearchResults;
            }).catch((error) => {
                console.log(error);
            });
    }

    onGridReady(params) {      
        this.setState({
            'api': Object.assign({}, params.appendChild)
        });
        this.setState({
            'columnDefs' : [
                {
                    headerName: '', field: 'RowSelect', width: 40, checkboxSelection: true, suppressMenu: true, suppressSorting: true,
                    headerCellRenderer: (params) => {
                        let cb = document.createElement('input');
                        cb.setAttribute('type', 'checkbox');
                        let eHeader = document.createElement('label');
                        let eTitle = document.createTextNode(params.colDef.headerName);
                        eHeader.appendChild(cb);
                        eHeader.appendChild(eTitle);
                        let that = this;
                        cb.addEventListener('change', function (e) {
                            if (this.checked) {
                                that.state.gridOptions.api.forEachNodeAfterFilter(function (node) {
                                    node.setSelected(true);
                                });
                            }
                            else {
                                that.state.gridOptions.api.forEachNodeAfterFilter(function (node) {
                                    node.setSelected(false);
                                });
                            }
                        });
                        return eHeader;
                    }
                    , cellStyle: { "text-align": "center" }
                },
                {
                    headerName: "Email Sent", field: "EmailSentDate", width: 100,
                    cellRenderer: function (params) {
                        let EmailSentDate = (params.data.EmailSentDate === null || params.data.EmailSentDate === "" ||
                            moment(params.data.EmailSentDate).format("YYYY-MM-DD") === "1800-01-01") ? '' : moment(params.data.EmailSentDate).format("YYYY-MM-DD");
                        return '<span>' + EmailSentDate + '</span>';
                    },
                    filterParams: { newRowsAction: 'keep'} 
                },
                {
                    headerName: "Student Email Sent", field: "StudentEmailSentDate", width: 100,
                    cellRenderer: function (params) {
                        let StudentEmailSentDate = (params.data.StudentEmailSentDate === null || params.data.StudentEmailSentDate === "" ||
                            moment(params.data.StudentEmailSentDate).format("YYYY-MM-DD") === "1800-01-01") ? '' : moment(params.data.StudentEmailSentDate).format("YYYY-MM-DD");
                        return '<span>' + StudentEmailSentDate + '</span>';
                    }
                },
                {
                    headerName: "Last change", field: "LastChangeDate", width: 100,
                    cellRenderer: function (params) {
                        let LastChangeDate = moment(params.data.LastChangeDate).format("YYYY-MM-DD") === "1800-01-01" ? '' : moment(params.data.LastChangeDate).format("YYYY-MM-DD");
                        return '<span>' + LastChangeDate + '</span>';
                    },
                    filterParams: { newRowsAction: 'keep'} 
                },
                {
                    headerName: "Arr/Dep date", field: "ArrDepFlightDate", width: 100,
                    cellRenderer: function (params) {
                        let ArrDepFlightDate = moment(params.data.ArrDepFlightDate).format("YYYY-MM-DD") === "1800-01-01" ? '' : moment(params.data.ArrDepFlightDate).format("YYYY-MM-DD");
    
                        return '<span>' + ArrDepFlightDate + '</span>';
                    }
                    , filterParams: { newRowsAction: 'keep'}
                    ,sort:'desc' 
                },
                {
                    headerName: "Arr/Dep time", field: "ArrDepFlightTime", width: 100,
                    cellRenderer: function (params) {
                        let ArrDepFlightTime = moment(params.data.ArrDepFlightTime).format("HH:mm") === "00:00"
                            ? '' : moment(params.data.ArrDepFlightTime).format("HH:mm");
                        return '<span>' + ArrDepFlightTime + '</span>';
                    }
                    , filterParams: { newRowsAction: 'keep'} 
                },
                { headerName: "Arr/Dep GW", field: "ArrDepGateCode", width: 100,
                filterParams: { newRowsAction: 'keep'}},
                {
                    headerName: "Arr/Dep Terminal", field: "ArrDepArrTerminal", width: 100,
                    cellRendererFramework: TerminalEditor,
                    cellRendererParams: {
                        trainGateways: this.props.trainGateways,
                        updateTerminal: this.updateTerminal
                    },
                    
                },
                { headerName: "Carrier", field: "Carrier", width: 100,
                filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Flight #", field: "FlightNum", width: 100,
                filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Transfer article", field: "OtherArticles", width: 100,
                filterParams: { newRowsAction: 'keep'}  },
                {
                    headerName: "PU Date", field: "PickUpDate", width: 100,
                    cellRenderer: function (params) {
                        let pickupdate = params.data.PickUpDate === null ? '' : moment(params.data.PickUpDate).format("YYYY-MM-DD");
                        return '<span>' + pickupdate + '</span>';
                    },
                    filterParams: { newRowsAction: 'keep'} 
                },
                {
                    headerName: "PU Time", field: "PickUpTime", width: 100,
                    filterParams: { newRowsAction: 'keep'} 
                },
                { headerName: "School", field: "AllocatedSchool", width: 100,
                filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Allocated supplier", field: "AllocatedSupplier", width: 200,
                filterParams: { newRowsAction: 'keep'}  },
                {
                    headerName: "Taxi Ref No", field: "TaxiRefNum", width: 100,
                    cellRenderer: function (params) {
                        let TaxiRefNum = params.data.TaxiRefNum === 0 ? '' : params.data.TaxiRefNum;
                        return '<span>' + TaxiRefNum + '</span>';
                    }
                    , filterParams: { newRowsAction: 'keep'} 
                },
                { headerName: "Acc.Mismatch", field: "AccomodationMissmatch", width: 60 ,
                filterParams: { newRowsAction: 'keep'} },
                { headerName: "Accommodation article", field: "AccommodationArticle", width: 140,
                filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Accommodation supplier ", field: "Allocation", width: 200,
                filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Accommodation supplier phone number", field: "SupplierPhoneNumber", width: 200
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Accommodation supplier  address", field: "AccomSupplierAdd", width: 300
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Booking Id", field: "SalesBookingId", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "First name", field: "FirstName", width: 100,sort:'asc'
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Last name", field: "LastName", width: 100,sort:'asc'
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Nationality", field: "Nationality", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Age", field: "Age", width: 80
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Gender", field: "Gender", width: 80
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Student Local Number", field: "StuPhoneNum", width: 200
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Email Address", field: "StudentEmail", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Sales person", field: "SalesPersonName", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Group", field: "GroupName", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Postal Code", field: "PostalCode", width: 100
                ,filterParams: { newRowsAction: 'keep'}  },
                { headerName: "Number of Weeks", field: "NumberofWeek", width: 100
                ,filterParams: { newRowsAction: 'keep'}  }
            ]
        })
       
       
    }

    onDestinationChange(event) {
        if (event.target.value !== "") {
            this.props.flightSearchActions.GetTransferArticle($.trim(event.target.value), this.props.user.SecurityToken);
            this.props.flightSearchActions.GetGatewayForTrainTypeList($.trim(event.target.value), this.props.user.SecurityToken);
            this.setState({
                'flightSearch': Object.assign({}, this.state.flightSearch, {
                    DestinationCode: event.target.value
                })
            });
        }
    }

    onProductChange(event) {

        this.setState({ programs: this.props.programs.filter(m => $.trim(m.ProductCode) == $.trim(event.target.value)) });
        let programCodes = "";
        this.props.programs.filter(m => $.trim(m.ProductCode) == $.trim(event.target.value)).map(function (program)
        { programCodes = programCodes + $.trim(program.Code) + "," })
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                ProductCode: event.target.value,
                programcode: programCodes
            })
        });
    }

    onProgramChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                programcodeLocal: event.target.value,
                programcode: event.target.value
            })
        });
    }

    onAccommodationTypeChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                AccomType: event.target.value
            })
        });
    }

    onflightTypeChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                TransferType: event.target.value
            })
        });
    }

    ontransferArticleChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                TransferArticle: event.target.value
            })
        });
    }

    onflightDateFromChange(dateString) {
        let d = new Date(dateString);
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        let formatted = new Date(d),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                FlightDateFrom: [year, month, day].join('-')
            })
        });
    }

    onflightDateToChange(dateString) {
        let d = new Date(dateString);
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        let formatted = new Date(d),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                FlightDateTo: [year, month, day].join('-')
            })
        });
    }
    onCourseWeekFromChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                FromWeekCode: $.trim(event.target.value)
            })
        });

    }
    onCourseWeekToChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                ToWeekCode: $.trim(event.target.value)
            })
        });
    }
    onGroupChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                Group: $.trim(event.target.value)
            })
        });
    }
    onMissingFlightDetailChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                MissFlight: event.target.checked ? 1 : 0
            })
        });
    }
    onMissingTransferAllocationChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                MissAlloc: event.target.checked ? 1 : 0
            })
        });
    }
    onAllGroupBookingsChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                AllGroup: event.target.checked ? 1 : 0
            })
        });
    }
    onNoTransferChange(event) {
        this.setState({
            'flightSearch': Object.assign({}, this.state.flightSearch, {
                NoTransfer: event.target.checked ? 1 : 0
            })
        });
    }

    flightSearch() {
        Alert.closeAll();
        let message = "<h4>Please select a value for the fields below</h4><ul>";
        let error = false;
        if ($.trim(this.state.flightSearch.DestinationCode) === "") {
            error = true;
            message += '<li>Destination  </li>';
        }
        if ($.trim(this.state.flightSearch.FromWeekCode) === ""
            && $.trim(this.state.flightSearch.ToWeekCode) === ""
            && $.trim(this.state.flightSearch.FlightDateFrom) === ""
            && $.trim(this.state.flightSearch.FlightDateTo) === ""
        ) {
            error = true;
            message += '<li>Please select either Course week /Flight dates</li>';
        }
        if ($.trim(this.state.flightSearch.FromWeekCode) !== "") {
            if (!/^([1-2][0-9])(5[0-3]|[1-4][0-9]|0[1-9])$/.test(this.state.flightSearch.FromWeekCode)) {
                error = true;
                message += '<li>Please select valid course week from</li>';
            }
            if ($.trim(this.state.flightSearch.ToWeekCode) === "") {
                error = true;
                message += '<li>Please select course week to</li>';
            }
        }

        if ($.trim(this.state.flightSearch.ToWeekCode) !== "") {
            if (!/^([1-2][0-9])(5[0-3]|[1-4][0-9]|0[1-9])$/.test(this.state.flightSearch.ToWeekCode)) {
                error = true;
                message += '<li>Please select valid course week to</li>';
            }
            if (this.state.flightSearch.ToWeekCode < this.state.flightSearch.FromWeekCode) {
                error = true;
                message += '<li>Course week to cannot be before course week from</li>';
            }
            if ($.trim(this.state.flightSearch.FromWeekCode) === "") {
                error = true;
                message += '<li>Please select course week from</li>';
            }
        }

        if ($.trim(this.state.flightSearch.FlightDateFrom) !== ""
            && (this.state.flightSearch.FlightDateTo === undefined || $.trim(this.state.flightSearch.FlightDateTo) === "")) {
            error = true;
            message += '<li>Please select flight date to</li>';
        }
        if ($.trim(this.state.flightSearch.FlightDateTo) !== "") {
            if (this.state.flightSearch.FlightDateFrom === undefined || $.trim(this.state.flightSearch.FlightDateFrom) === "") {
                error = true;
                message += '<li>Please select flight date from</li>';
            }
            if (this.state.flightSearch.FlightDateTo < this.state.flightSearch.FlightDateFrom) {
                error = true;
                message += '<li>Flight date to cannot be before flight date from</li>';
            }
        }
        if ($.trim(this.state.flightSearch.TransferType) === "") {
            error = true;
            message += '<li>Please select flight type</li>';
        }

        if (!error) {
            let programCodes = "";
            let flightSearch = {};
            if (!this.state.flightSearch.hasOwnProperty("programcode") || $.trim(this.state.flightSearch.programcode) === "") {
                this.props.programs.map(function (program)
                { programCodes = programCodes + $.trim(program.Code) + "," })
                this.setState({
                    'flightSearch': Object.assign({}, this.state.flightSearch, {
                        programcode: programCodes
                    })
                });
                flightSearch = Object.assign({}, this.state.flightSearch, {
                    programcode: programCodes
                });
            }
            else
                flightSearch = Object.assign({}, this.state.flightSearch);
            this.props.flightSearchActions.FlightSearch(flightSearch, this.props.user.SecurityToken);
        }
        else
            Alert.error(message + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.flightSearch !== this.props.flightSearch) {
            this.setState({ flightSearch: nextProps.flightSearch });
        }
        if (nextProps.flightSearchResults !== this.props.flightSearchResults) {
            this.state.gridOptions.api && this.state.gridOptions.api.setFilterModel(this.state.filterModel);
            this.state.gridOptions.api && this.state.gridOptions.api.onFilterChanged();
            this.state.gridOptions.api && this.state.gridOptions.api.setSortModel(this.state.sortModel);
            this.state.gridOptions.api && this.state.gridOptions.api.onSortChanged();
        }
    }

    componentWillMount() {
        if (sessionStorage.getItem("user") === null) {
            browserHistory.push('/login');
        }
    }

    render() {

        var myBigGreenDialog = {
            height: '360px',
            top: '20%',
            marginTop: '0',
            color: '#000',
            backgroundColor: 'rgb(62, 62, 61)',
            width: '50%',
            fontSize: '13px',
            padding: '0px'
        };

        var title =
            {
                fontSize: '16px',
                height: '5%',
                marginLeft: '20px',
                color: 'white'
            };



        let spinwheel = null;
        let errorMessage = null;
        let loading = this.state.loading;
        let error = this.state.error;
       
        return (
            <div>
                {this.props.flightSearchLoading ?
                    <div id="loadingTakeOff">
                        <div id="flight" className="flight run"></div>
                        <div className="flighttext">Please sit tight while we fetch the students for you!!!</div>
                    </div>
                    :
                    <div>
                        <div className="search flight-search hidden-mob">
                            <ul className="list-unstyled">
                                <li className="list-unstyled-field"> <label className="search-param ">Destination</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="destination"
                                    label="destination" value={this.state.flightSearch.DestinationCode}
                                    defaultOption="Select" onChange={this.onDestinationChange}
                                    options={this.props.destinations} /> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Product</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="airport"
                                    label="Airport" value={this.state.flightSearch.ProductCode}
                                    options={this.props.products} onChange={this.onProductChange} /> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Program</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="airport"
                                    label="Airport" value={this.state.flightSearch.programcodeLocal}
                                    options={this.state.programs} onChange={this.onProgramChange} /> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Accom type</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="airport"
                                    label="Airport" value={this.state.flightSearch.AccomType}
                                    options={this.props.accommodationTypes} onChange={this.onAccommodationTypeChange} /> </li>
                            </ul>
                            <ul className="list-unstyled">
                                <li className="list-unstyled-field"> <label className="search-param ">Course week from</label> </li>
                                <li className="list-unstyled-value"><TextInput onChange={this.onCourseWeekFromChange} value={this.state.flightSearch.FromWeekCode} />  </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Course week to</label> </li>
                                <li className="list-unstyled-value"><TextInput onChange={this.onCourseWeekToChange} value={this.state.flightSearch.ToWeekCode} /> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Flight date from</label> </li>
                                <li className="list-unstyled-value"> <DateField value={this.state.flightSearch.FlightDateFrom && new Date(this.state.flightSearch.FlightDateFrom)}
                                    dateFormat="YYYY-MM-DD" onChange={this.onflightDateFromChange} expandOnFocus={true}
                                    updateOnDateClick={true} collapseOnDateClick={true} >
                                    <DatePicker footer={false} />
                                </DateField> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Flight date to</label> </li>
                                <li className="list-unstyled-value"><DateField value={this.state.flightSearch.FlightDateTo && new Date(this.state.flightSearch.FlightDateTo)}
                                    dateFormat="YYYY-MM-DD" onChange={this.onflightDateToChange} expandOnFocus={true}
                                    updateOnDateClick={true} collapseOnDateClick={true} >
                                    <DatePicker footer={false} />
                                </DateField> </li>
                            </ul>
                            <ul className="list-unstyled">
                                <li className="list-unstyled-field"> <label className="search-param ">Flight type</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="airport"
                                    label="Airport" value={this.state.flightSearch.TransferType}
                                    options={this.props.flightDirections} onChange={this.onflightTypeChange} /> </li>
                                <li className="list-unstyled-field"> <label className="search-param ">Transfer article</label> </li>
                                <li className="list-unstyled-value"><SelectInput
                                    name="airport"
                                    label="Airport" value={this.state.flightSearch.TransferArticle}
                                    options={this.props.transferArticles} onChange={this.ontransferArticleChange} /> </li>

                                <li className="list-unstyled-field"> <label className="search-param ">Group</label> </li>
                                <li className="list-unstyled-value"><TextInput onChange={this.onGroupChange} value={this.state.flightSearch.Group} /> </li>
                            </ul>
                            <ul className="list-unstyled">
                                <li className="list-unstyled-check"> <input type="checkbox" onChange={this.onMissingFlightDetailChange} checked={this.state.flightSearch.MissFlight === 1 ? true : false} />Missing flight details</li>
                                <li className="list-unstyled-check"> <input type="checkbox" onChange={this.onMissingTransferAllocationChange} checked={this.state.flightSearch.MissAlloc === 1 ? true : false} />Missing transfer allocation</li>
                                <li className="list-unstyled-check"> <input type="checkbox" onChange={this.onAllGroupBookingsChange} checked={this.state.flightSearch.AllGroup === 1 ? true : false} />All group bookings</li>
                                <li className="list-unstyled-check"> <input type="checkbox" onChange={this.onNoTransferChange} checked={this.state.flightSearch.NoTransfer === 1 ? true : false} />No transfer</li>

                                <li className="pull-right">
                                    <button className="btn btn-default btn-primary" onClick={() => this.flightSearch()} >Search</button>
                                </li>
                            </ul>
                        </div>

                        <div className="react-grid ag-blue">
                            <AgGridReact
                                // binding to properties within React State or Props
                                showToolPanel={this.state.showToolPanel}
                                quickFilterText={this.state.quickFilterText}
                                icons={this.state.icons}
                                gridOptions={this.state.gridOptions}

                                // listening for events
                                onGridReady={this.onGridReady}
                                // column definitions and row data are immutable, the grid
                                // will update when these lists change
                                columnDefs={this.state.columnDefs}
                                rowData={this.props.flightSearchResults}
                                enableColResize={true}
                                // or provide props the old way with no binding
                                rowSelection="multiple"
                                enableSorting="true"
                                enableFilter="true"
                                rowHeight="22"
                            />
                        </div>

                        <div className="footer flight-search-footer">
                            <div className="clearfix">
                                {!this.props.flightSearch.hasOwnProperty("DestinationCode") ? null :
                                    <div className="sub-footer">
                                        <label className="pull-left white">Total Number of records: {this.props.flightSearchResults.length}</label>
                                        <button id="add" className="btn btn-default btn-primary pull-right" onClick={() => {
                                            var params = {
                                                allColumns: false,
                                                onlySelected: true
                                            };
                                            var fileName = "Flight search-" + moment(new Date()).format("YYYY-MM-DD HH-mm") + ".xlsx";
                                            params.columnKeys = ['LastChangeDate', 'ArrDepFlightDate', 'ArrDepFlightTime',
                                                'ArrDepGateCode', 'ArrDepArrTerminal', 'Carrier', 'FlightNum', 'OtherArticles',
                                                'PickUpDate', 'PickUpTime', 'AllocatedSchool', 'AllocatedSupplier', 'TaxiRefNum', 'AccomodationMissmatch',
                                                'AccommodationArticle', 'Allocation', 'SupplierPhoneNumber','StudentEmail', 'AccomSupplierAdd', 'SalesBookingId', 'FirstName',
                                                'LastName', 'Nationality', 'Age', 'Gender', 'StuPhoneNum', 'SalesPersonName', 'GroupName','PostalCode','NumberofWeek'];
                                            
                                            params.processHeaderCallback = function (params) {
                                                return params.column.getColDef().headerName.toUpperCase();
                                            };
                                            params.processCellCallback = function (params) {
                                                if (params.value &&
                                                    (params.column.colId == "LastChangeDate"
                                                        || params.column.colId == "ArrDepFlightDate"
                                                        || params.column.colId == "PickUpDate")) {
                                                    if (moment(params.value).format("YYYY-MM-DD") == "1800-01-01")
                                                        return "";
                                                    else
                                                        return moment(params.value).format("YYYY-MM-DD");
                                                }
                                                else if (params.value &&
                                                    params.column.colId == "ArrDepFlightTime") {
                                                    if (moment(params.value).format("HH:mm") == "00:00")
                                                        return "";
                                                    else
                                                        return moment(params.value).format("HH:mm");
                                                } else {
                                                    return params.value;
                                                }
                                            };
                                            
                                            var exportData = [];
                                            var obj = {};
                                            var lines = this.state.gridOptions.api.getDataAsCsv(params).split("\n");
                                            var headers = lines[0].split(",");

                                            for (var i = 0; i < headers.length; i++)
                                            headers[i] = headers[i].replace(/"/g, "");
                                    
                                            if (lines.length > 1) {
                                                for (var i = 1; i < lines.length; i++) {
                                                    lines[i] = lines[i].replace(/"/g, "");
                                                    var currentline = lines[i].split(",");
                                        
                                                    for (var j = 0; j < headers.length; j++) {
                                                        obj[headers[j]] = currentline[j];
                                                    }
                                                    exportData.push(obj);
                                                    obj = {};
                                                }
                                            }
                                            else {
                                                obj[headers[0]] = 'No record found';
                                                for (var j = 1; j < headers.length; j++) {
                                                    obj[headers[j]] = '';
                                                }
                                                exportData.push(obj);
                                            }
                                    
                                        var styleFormat = {
                                            headers: true,        
                                            column: { style: { Font: { Bold: "1" } } }
                                        };
                                    
                                        alasql('SELECT * INTO XLSX("' + fileName + '",?) FROM ?', [styleFormat, exportData]);

                                        }} >Export to excel</button>

                                        <button id="add" className="btn btn-default btn-primary pull-right" onClick={() => {
                                            if ($.trim(this.state.gridOptions.api.getSelectedRows().length) == 0)
                                                Alert.error("Please select students", {
                                                    position: 'top',
                                                    effect: 'bouncyflip'
                                                });
                                            else
                                                this.refs.mailDialog.show();
                                        }}>Mail to Sales office</button>
                                        <button id="add" className="btn btn-default btn-primary pull-right" onClick={() => {                                            
                                             var params = {
                                                allColumns: false,
                                                onlySelected: true
                                            };
                                            if ($.trim(this.state.gridOptions.api.getSelectedRows().length) == 0)
                                                Alert.error("Please select students", {
                                                    position: 'top',
                                                    effect: 'bouncyflip'
                                                });
                                            else 
                                            {    
                                                let students="";
                                                this.state.gridOptions.api.getSelectedRows().map((student, index) => {
                                                    
                                                    if(student.CurrentlyInSchool == false)
                                                    students +='<li>'+student.SalesBookingId+'</li>' ;
                                                  //  students.push({
                                                   //     "SalesBookingId": student.SalesBookingId                                                      
                                                   // });
                                                });
                                                console.log(students.length);
                                                if ($.trim(students.length) > 0)
                                                Alert.error("You can only email students once they are in school. Following students are currently not in school "+students, {
                                                    position: 'top',
                                                    effect: 'bouncyflip',
                                                    html:true
                                                });
                                                else
                                                this.refs.mailDialog1.show();
                                            }                                                                                                                                                                                                                              
                                        }}>Mail to Student</button>

                                    </div>}
                            </div>
                        </div>
                        {<SkyLight hideOnOverlayClicked ref="mailDialog" title="Email to sales office"
                            dialogStyles={myBigGreenDialog} titleStyle={title} >
                            <div className="popup-container">
                                <div className={"field"}>
                                    <label >Subject</label>
                                </div>
                                <div className={"value"}>
                                    <textarea className="form-control" name="Text1" cols="40" rows="1" onBlur={(event) =>
                                        this.setState({
                                            'subject': event.target.value
                                        })
                                    }></textarea>
                                </div>
                                <div className={"field"}>
                                    <label >Message</label>
                                </div>
                                <div className={"value"}>
                                    <textarea className="form-control" name="Text1" cols="40" rows="8" onBlur={(event) =>
                                        this.setState({
                                            'message': event.target.value
                                        })
                                    }></textarea>
                                </div>
                            </div>

                            <div className={"popup-button-container"}>

                                <button id="sendEmail" className="btn btn-default btn-primary pull-right" onClick={() => {
                                    if ($.trim(this.state.subject) === "")
                                        Alert.error("Please enter a subject", {
                                            position: 'top',
                                            effect: 'bouncyflip'
                                        });
                                    else if ($.trim(this.state.message) === "")
                                        Alert.error("Please enter message", {
                                            position: 'top',
                                            effect: 'bouncyflip'
                                        });

                                    else {
                                        let students = [];
                                        this.state.gridOptions.api.getSelectedRows().map((student, index) => {
                                            students.push({
                                                "Booking_Id": student.Booking_id, "SalesBookingId": student.SalesBookingId,
                                                "SalesPersonEmailId": student.SalesPersonEmailId, "FirstName": student.FirstName, "LastName": student.LastName
                                            });
                                        });

                                        let mail = {
                                            "FromEmail": this.props.user.Username + "@ef.com",
                                            "Subject": this.state.subject,
                                            "Body": this.state.message,
                                            "TransferType": this.props.flightSearch.TransferType,
                                            "DestinationCode": this.props.flightSearch.DestinationCode,
                                            "UserId": this.props.user.UserID,
                                            "StudentEamilList": students,
                                            "InsertedBy": this.props.user.Username + "@ef.com",
                                            "EmailSentTo":"Sales"
                                        };
                                        this.props.flightSearchActions.SendEmailToSalesPersonforMissingFlight(mail, this.props.user.SecurityToken)
                                            .then((data) => {
                                                if (data.data.Status == "Fail")
                                                    Alert.error("Error occured while sending email to sales office", {
                                                        position: 'top',
                                                        effect: 'bouncyflip'
                                                    });
                                                else {
                                                    Alert.success("Mail sent successfully", {
                                                        position: 'top',
                                                        effect: 'bouncyflip'
                                                    });
                                                    this.setState({
                                                        'message': "",
                                                        "subject": ""
                                                    });

                                                    this.props.flightSearchActions.FlightSearch(this.props.flightSearch, this.props.user.SecurityToken);
                                                }
                                            }).catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                }} >Send Email</button>
                            </div>                            
                        </SkyLight>}
                       {<SkyLight hideOnOverlayClicked ref="mailDialog1" title="Email to Students"
                            dialogStyles={myBigGreenDialog} titleStyle={title} >
                            <div className="popup-container">
                                <div className={"field"}>
                                    <label >Subject</label>
                                </div>
                                <div className={"value"}>
                                    <textarea className="form-control" name="Text1" cols="40" rows="1" onBlur={(event) =>
                                        this.setState({
                                            'subject': event.target.value
                                        })
                                    }></textarea>
                                </div>
                                <div className={"field"}>
                                    <label >Message</label>
                                </div>
                                <div className={"value"}>
                                    <textarea className="form-control" name="Text1" cols="40" rows="8" onBlur={(event) =>
                                        this.setState({
                                            'message': event.target.value
                                        })
                                    }></textarea>
                                </div>
                            </div>

                            <div className={"popup-button-container"}>

                                <button id="sendEmailStudent" className="btn btn-default btn-primary pull-right" onClick={() => {
                                    if ($.trim(this.state.subject) === "")
                                        Alert.error("Please enter a subject", {
                                            position: 'top',
                                            effect: 'bouncyflip'
                                        });
                                    else if ($.trim(this.state.message) === "")
                                        Alert.error("Please enter message", {
                                            position: 'top',
                                            effect: 'bouncyflip'
                                        });

                                    else {
                                        let students = [];
                                        this.state.gridOptions.api.getSelectedRows().map((student, index) => {
                                            students.push({
                                                "Booking_Id": student.Booking_id, "SalesBookingId": student.SalesBookingId,
                                                "SalesPersonEmailId": student.StudentEmail, "FirstName": student.FirstName, "LastName": student.LastName
                                            });
                                        });

                                        let mail = {
                                            "FromEmail": this.props.user.Username + "@ef.com",
                                            "Subject": this.state.subject,
                                            "Body": this.state.message,
                                            "TransferType": this.props.flightSearch.TransferType,
                                            "DestinationCode": this.props.flightSearch.DestinationCode,
                                            "UserId": this.props.user.UserID,
                                            "StudentEamilList": students,
                                            "InsertedBy": this.props.user.Username + "@ef.com",
                                            "EmailSentTo":"Student"
                                        };
                                        this.props.flightSearchActions.SendEmailToSalesPersonforMissingFlight(mail, this.props.user.SecurityToken)
                                            .then((data) => {
                                                if (data.data.Status == "Fail")
                                                    Alert.error("Error occured while sending email to Student", {
                                                        position: 'top',
                                                        effect: 'bouncyflip'
                                                    });
                                                else {
                                                    Alert.success("Mail sent successfully", {
                                                        position: 'top',
                                                        effect: 'bouncyflip'
                                                    });
                                                    this.setState({
                                                        'message': "",
                                                        "subject": ""
                                                    });

                                                    this.props.flightSearchActions.FlightSearch(this.props.flightSearch, this.props.user.SecurityToken);
                                                }
                                            }).catch((error) => {
                                                console.log(error);
                                            });
                                    }
                                }} >Send Email</button>
                            </div>                            
                        </SkyLight>}
                    </div >
                }

            </div>
        );
    }
}
FlightSearchContainer.propTypes = {
    flightSearchActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        destinations: state.destinations,
        products: state.products,
        programs: state.programs,
        flightDirections: state.flightDirections,
        accommodationTypes: state.accommodationTypes,
        transferArticles: state.transferArticles,
        trainGateways: state.trainGateways,
        flightSearch: state.flightSearch,
        flightSearchResults: state.flightSearchResults,
        user: state.user,
        flightSearchLoading: state.flightSearchLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        flightSearchActions: bindActionCreators(flightSearchActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlightSearchContainer);