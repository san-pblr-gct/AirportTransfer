import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux';
import SkyLight from 'react-skylight';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as studentActions from '../../actions/studentsActions';


class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.logout = this.logout.bind(this);
        this.navigateAirportTransfer = this.navigateAirportTransfer.bind(this);
        this.navigateFlightSearch = this.navigateFlightSearch.bind(this);
        this.showNotifications = this.showNotifications.bind(this);
        this.showCaxModifiedStudent = this.showCaxModifiedStudent.bind(this);
        this.state = {
            student: {}
        };
    }

    logout() {
        this.props.studentActions.logout();

    }

    navigateFlightSearch() {
        this.props.studentActions.reroute("flightsearch");
    }

    navigateAirportTransfer() {
        this.props.studentActions.reroute("AirportTransfer");
    }

    showNotifications() {

        this.refs.notificationsDialog.show();
    }

    showCaxModifiedStudent(student) {
        var that = this;
        this.setState({ student: Object.assign({}, student) }, function () {
            that.refs.caxModifiedDialog.show();
        });
    }

    unallocate(AllocatedStudentId, TaxiId, LSTransportationAllocatedStudentCaxModifiedId) {
        var student = {
            "AllocatedStudentId": AllocatedStudentId,
            "TaxiId": TaxiId,
            "UserId": this.props.user.UserID
        };
        this.props.studentActions.allocatedToUnallocated(student, this.props.user.SecurityToken)
            .then(value => {
                this.props.studentActions.removeNotification(LSTransportationAllocatedStudentCaxModifiedId, this.props.user.UserID, this.props.user.SecurityToken).then()
                    .catch(error => {
                    });
            })
            .catch(error => {
            });
    }

    removeNotification(LSTransportationAllocatedStudentCaxModifiedId) {
        this.props.studentActions.removeNotification(LSTransportationAllocatedStudentCaxModifiedId, this.props.user.UserID, this.props.user.SecurityToken)
            .then()
            .catch(error => {
            });
    }

    render() {

        var notificationDialog = {
            height: '350px',
            top: '0',
            color: '#000',
            backgroundColor: '#fff',
            width: '500px',
            fontSize: '13px',
            padding: '0px',
            position: 'absolute',
            left: '0%',
            marginLeft: '-480px',
            marginTop: '100%',
            textAlign: 'left',
            overflowY:'auto'
        };

        var title =
            {
                fontSize: '16px',
                marginLeft: '20px',
                color: 'white'
            };

        var notificationtitle =
            {
                fontSize: '16px',
                marginLeft: '20px',
                color: '#000'
            };

        var myBigGreenDialog = {
            height: '350px',
            minHeight: '250px',
            top: '10%',
            marginTop: '0',
            color: '#000',
            width: '40%',
            backgroundColor: 'rgb(62, 62, 61)',
            fontSize: '13px',
            padding: '0px'
        };

        let length = this.props.modifiedStudents.length;
        let badge = "";
        if (length > 0)
            badge = <span id="notificationlength" className="button__badge">{this.props.modifiedStudents.length}</span>
        return (

            <header>
                <div className="container">
                    <img className="logo" src={require("../../images/eflogo.svg")} />
                    <div className="title">Airport Transfer</div>
                    <div className="top-menu">
                        <a className="menu-link hidden-mob" onClick={this.navigateAirportTransfer}>   <img src={require("../../images/taxi.png")} />Allocation</a>
                        <a className="menu-link hidden-mob" onClick={this.navigateFlightSearch}><img src={require("../../images/airplane.png")} />Flight Search</a>
                    </div>
                    <div className="quicklinks">
                        <ul className="list-unstyled">
                            <li className="mainmenu">
                                <a id="a-notification" href="# " onClick={this.showNotifications}>
                                    <i className="glyphicon glyphicon-bell"></i>
                                    {badge}
                                </a>
                                {<SkyLight className={"unallocated-student-detail"} dialogStyles={notificationDialog} titleStyle={notificationtitle}
                                    hideOnOverlayClicked ref="notificationsDialog" title="Cax\Modified"  >
                                    {this.props.modifiedStudents && this.props.modifiedStudents.map((student, index) => {
                                        let skylightPopup = <SkyLight className={"unallocated-student-detail"} dialogStyles={myBigGreenDialog} titleStyle={title}
                                            hideOnOverlayClicked ref="caxModifiedDialog" title={this.state && this.state.student.Name}  >
                                            <div className="popup-container">
                                                <div className={"row field"}> Flight Details</div>
                                                <hr />
                                                <div className={"row field"}>
                                                    <label className={"col25"}>Carrier</label>
                                                    <label className={"col25"}>Flight</label>
                                                    <label className={"col25"}>Gateway</label>
                                                    <label className={"col25"}>Date/time</label>
                                                </div>
                                                <div className={"row value"}>
                                                    <label className={"col25 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("Carrier") ? "red-warning" : "")}>{this.state && this.state.student.Carrier}</label>
                                                    <label className={"col25 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("FlightNum") ? "red-warning" : "")}>{this.state && this.state.student.FlightNum}</label>
                                                    <label className={"col25 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("GateCode") ? "red-warning" : "")}>{this.state && $.trim(this.props.search.transferType) == "TFARR" ? this.state.student.ArrGateCode : this.state.student.DepGateCode}</label>
                                                    <label className={"col25 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("DateTime") ? "red-warning" : "")}>{this.state && $.trim(this.props.search.transferType) == "TFARR" ? moment(this.state.student.ArrDateTime).format("D-MMM-YYYY HH:mm") :
                                                        moment(this.state.student.DepDateTime).format("D-MMM-YYYY HH:mm")}</label>
                                                </div>
                                                <hr />
                                                <div className={"row field"}> Accommodation</div>
                                                <hr />
                                                <div className={"row field"}>
                                                    <label className={"col33"} >Name</label>
                                                    <label className={"col33"}>From </label>
                                                    <label className={"col33"}>To</label>
                                                </div>
                                                <div className={"row value"}>
                                                    <label className={"col33 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("AccommodationSupplierName") ? "red-warning" : "")} >{this.state && this.state.student.AccommodationSupplierName}</label>
                                                    <label className={"col33 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("AccommodationFromDate") ? "red-warning" : "")}>{this.state && moment(this.state.student.AccommodationFromDate).format("D-MMM-YYYY")} </label>
                                                    <label className={"col33 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("AccommodationToDate") ? "red-warning" : "")}>{this.state && moment(this.state.student.AccommodationToDate).format("D-MMM-YYYY")}</label>  </div>
                                                <div className={"row field"}>
                                                    <label  >Address</label>
                                                </div>
                                                <div className={"row value"}>
                                                    <label className={(this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("AccommodationAddress") ? "red-warning" : "")} >{this.state && this.state.student.AccommodationAddress}</label>
                                                </div>
                                                <hr />
                                                <div className={"row field"}> Article</div>
                                                <hr />
                                                <div className={"row field"}>
                                                    <label className={"col33"} >Transfer Article</label>
                                                    <label className={"col66"}>Transfer article status </label>
                                                </div>
                                                <div className={"row value"}>
                                                    <label className={"col33 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("TransferArticle") ? "red-warning" : "")} >{this.state && this.state.student.TransferArticle}</label>
                                                    <label className={"col66 " + (this.state && this.state.student.ChangeFileld && this.state.student.ChangeFileld.includes("TransferArticle") ? "red-warning" : "")}>{this.state && this.state.student.TransferArticleStatus}</label>
                                                </div>
                                            </div >
                                            <div className={"row value red-warning"}>* Changed fields are highlighted in red</div>
                                        </SkyLight>

                                        return (
                                            <div key={student.LSTransportationAllocatedStudentCaxModifiedId} className={"modified-student " + ($.trim(student.ProgramCode) === "AY" ? 'ay' : 'ls')}
                                                id={student.BookingId}>
                                                <div className={"modified-student-detail"} onClick={() => this.showCaxModifiedStudent(student)} >
                                                    <div>
                                                        <span>{student.Name}, {student.Age} , {student.AccommodationType}</span>
                                                        <span className={"pull-right"}>{moment(student.ArrDateTime).format("HH:mm")}</span>
                                                    </div>
                                                    <div>
                                                        {student.IsModified ? <span>Mod</span> : <span>Cax</span>}

                                                    </div>
                                                </div>
                                                <div className={"modified-student-detail-button"} >
                                                    <button id="Unallocate" className="btn btn-default" onClick={() => this.unallocate(student.LSTransportationAllocatedStudentId, student.LSTransportationTaxiDetailId, student.LSTransportationAllocatedStudentCaxModifiedId)} >Unallocate</button>
                                                    {student.IsCax ? null : <button id="Ignore" className="btn btn-default" onClick={() => this.removeNotification(student.LSTransportationAllocatedStudentCaxModifiedId)} >Ignore</button>}
                                                </div>
                                                {skylightPopup}
                                            </div>
                                        )
                                    })}

                                </SkyLight>
                                }
                            </li>
                            <li className="mainmenu">
                                <a href="#" className="profile profile-desk hidden-mob" id="userId">{this.props.user.Name}</a>
                                <a href="#" className="profile hidden-desk glyphicon glyphicon-th-list" id="mobileMenu"></a>
                                <div id="profilemenu" className="submenu">
                                    <ul className="list-unstyled">
                                        <li className="hidden-desk">
                                            <a onClick={this.navigateAirportTransfer}>Airport Transfer</a>
                                            <a onClick={this.navigateFlightSearch}>Flight Search</a>
                                            <a href="#" onClick={this.logout}>{this.props.user.Name} (Logout)</a>
                                        </li>
                                        <li className="hidden-mob">
                                            <li><a href="#" onClick={this.logout}>Logout</a></li>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header >
        );
    }
}

Header.propTypes = {
    studentActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return {
        studentActions: bindActionCreators(studentActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
