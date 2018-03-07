import React, { PropTypes } from 'react';
import SkyLight from 'react-skylight';
import moment from 'moment';
import { DragSource } from 'react-dnd';
import ItemTypes from '../../constants/itemTypes';
import * as studentsActions from '../../actions/studentsActions';
import { connect } from 'react-redux';
import TextInput from '../../components/common/TextInput'
import Alert from 'react-s-alert';

//https://react-dnd.github.io/react-dnd/docs-overview.html
const allocatedStudentSource = {
    beginDrag(props) {
        return { allocatedStudent: props.allocatedStudent };
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }
        // When dropped on a compatible target, do something
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
        var student = {
            "AllocatedStudentId": item.allocatedStudent.LSTransportationAllocatedStudentId,
            "TaxiId": item.allocatedStudent.LSTransportationTaxiDetailId,
            "UserId": props.user.UserID
        };

        props.allocatedToUnallocated(student, item.allocatedStudent.Name);



    }
};


function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}




class AllocatedStudent extends React.Component {
    constructor(props) {
        super(props);
        this.loadAllocatedPopup = this.loadAllocatedPopup.bind(this);
        this.saveAllocatedStudentPopup = this.saveAllocatedStudentPopup.bind(this);
        this.onPickupAddressChange = this.onPickupAddressChange.bind(this);
        this.onPickupTimeChange = this.onPickupTimeChange.bind(this);
        this.onDropoffAddressChange = this.onDropoffAddressChange.bind(this);
        this.onDropoffTimeChange = this.onDropoffTimeChange.bind(this);
        this.onAmountChange = this.onAmountChange.bind(this);
        this.state = {
            studentPopup: props.studentPopup
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.studentPopup.BookingID === this.props.allocatedStudent.BookingId) {
            this.setState({ studentPopup: nextProps.studentPopup })
        }
    }


    loadAllocatedPopup() {
        this.props.loadAllocatedStudentPopup(this.props.allocatedStudent.LSTransportationAllocatedStudentId);
        this.refs.allocatedDialog.show();
    }

    saveAllocatedStudentPopup() {
        if ($.trim(this.state.studentPopup.AltPickupTime) == "" || /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(this.state.studentPopup.AltPickupTime)) {
            if ($.trim(this.state.studentPopup.AltDropoffTime) == "" || /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/.test(this.state.studentPopup.AltDropoffTime)) {
                if ($.trim(this.state.studentPopup.Amount) == "" || /^([0-9]+(\.[0-9][0-9])?)?$/.test(this.state.studentPopup.Amount)) {
                    this.props.saveAllocatedStudentPopup(this.props.allocatedStudent.LSTransportationAllocatedStudentId
                        , this.state.studentPopup.AltPickupAddress, this.state.studentPopup.AltPickupTime,
                        this.state.studentPopup.AltDropoffAddress, this.state.studentPopup.AltDropoffTime,
                        this.state.studentPopup.Amount);
                }
                else
                    Alert.error('Amount is not valid. Please enter correct amount with 2 decimal places', {
                        position: 'top',
                        effect: 'bouncyflip'
                    });
            }
            else
                Alert.error('Drop off Time format is not valid. Please enter time in (HH:mm:ss)', {
                    position: 'top',
                    effect: 'bouncyflip'
                });

        }
        else
            Alert.error('Pick up Time format is not valid. Please enter time in (HH:mm:ss)', {
                position: 'top',
                effect: 'bouncyflip'
            });

    }

    onPickupAddressChange(event) {

        this.setState({
            'studentPopup': Object.assign({}, this.state.studentPopup, {
                AltPickupAddress: event.target.value
            })
        })
    }
    onPickupTimeChange(event) {
        this.setState({
            'studentPopup': Object.assign({}, this.state.studentPopup, {
                AltPickupTime: event.target.value
            })
        })

    }
    onDropoffAddressChange(event) {
        this.setState({
            'studentPopup': Object.assign({}, this.state.studentPopup, {
                AltDropoffAddress: event.target.value
            })
        })

    }
    onDropoffTimeChange(event) {
        this.setState({
            'studentPopup': Object.assign({}, this.state.studentPopup, {
                AltDropoffTime: event.target.value
            })
        })
    }
    onAmountChange(event) {
        this.setState({
            'studentPopup': Object.assign({}, this.state.studentPopup, {
                Amount: event.target.value
            })
        })

    }



    render() {
        const { isDragging, connectDragSource } = this.props;
        var myBigGreenDialog = {
            height: '80%',
            top: '10%',
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



        return (
            <div >
                {
                    connectDragSource(
                        <div className={this.props.style} onClick={this.loadAllocatedPopup}>

                            <img src={require("../../images/seat_new.png")} />
                            <span>{this.props.allocatedStudent.FlightNum}</span>
                            <span>{moment(this.props.allocatedStudent.FlightDateTime).format("HH:mm")}</span>
                            <span>{this.props.allocatedStudent.Name}</span>
                            <span> - {this.props.allocatedStudent.Age}</span>
                        </div>
                    )
                }

                {<SkyLight className={"unallocated-student-detail"} dialogStyles={myBigGreenDialog} titleStyle={title} hideOnOverlayClicked ref="allocatedDialog" title={this.props.allocatedStudent.Name + ' , ' + this.props.studentPopup.SalesBookingID} >
                    <div className="popup-container">

                        <div className={"field"}> Flight Details</div>
                        <hr />
                        <div className={"field"}>
                            <label className={"col33"}>Carrier</label>
                            <label className={"col33"}>Flight</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col33"}>{this.state.studentPopup.Carrier}</label>
                            <label className={"col33"}>{this.state.studentPopup.FlightNumber}</label>
                        </div>

                        <div className={"field"}>
                            <label className={"col33"} >{$.trim(this.props.search.transferType) == "TFARR" ? "Arr GW" : "Dep GW"}</label>
                            <label className={"col33"}>{$.trim(this.props.search.transferType) == "TFARR" ? "Arr Term" : "Dep Term"}</label>
                            <label className={"col33"}>{$.trim(this.props.search.transferType) == "TFARR" ? "Arr date/time" : "Dep date/time"}</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col33"}>{$.trim(this.props.search.transferType) == "TFARR" ? this.state.studentPopup.ArrGateCode : this.state.studentPopup.DepGateCode}</label>
                            <label className={"col33"}>{$.trim(this.props.search.transferType) == "TFARR" ? this.state.studentPopup.ArrTerminal : this.state.studentPopup.DepTerminal}</label>
                            <label className={"col33"}>{$.trim(this.props.search.transferType) == "TFARR" ? this.state.studentPopup.ArrDateTime && moment(this.state.studentPopup.ArrDateTime).format("D-MMM-YYYY HH:mm") : this.state.studentPopup.DepDateTime && moment(this.state.studentPopup.DepDateTime).format("D-MMM-YYYY HH:mm")}</label>
                        </div>

                        <hr />
                        <div className={"field"}> Transfer Details</div>
                        <hr />
                        <div className={"field"}>
                            <label className={"col33"}>Pick up</label>
                            <label className={"col33"}>Pick up date/time</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col33"}>{this.state.studentPopup.PickupAddress}</label>
                            <label className={"col33"}>{this.state.studentPopup.PickupDate && moment(this.state.studentPopup.PickupDate).format("D-MMM-YYYY HH:mm")}</label>
                        </div>
                        <div className={"field"}>
                            <label className={"col33"}>Drop off</label>
                            <label className={"col33"}>Drop off date/time</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col33"}>{this.state.studentPopup.DropoffType}</label>
                            <label className={"col33"}>{this.state.studentPopup.DropofDate && moment(this.state.studentPopup.DropofDate).format("D-MMM-YYYY HH:mm")}</label>
                        </div>
                        <div className={"field col2"}>
                            <label className={"col66"}>Accommodation Address</label>
                            <label className={"col33"}>Student local phone</label>

                        </div>
                        <div className={"value col2"}>
                            <label className={"col66"}>{this.state.studentPopup.AccommodationAddress}</label>
                            <label className={"col33"}>{this.state.studentPopup.LocalMobileNumber}</label>
                        </div>
                        <hr />
                        <div className={"field"}> Alternative Pick up/Drop off</div>
                        <hr />
                        <div className={"field"}>
                            <label className={"col66 "}>Pick up address</label>
                            <label className={"col33"}>Pick up time <small className="hidden-mob-inline">(HH:mm:ss)</small></label>
                        </div>
                        <div className={"value"}>
                            <TextInput style="col66 allocated-input" disabled={this.props.allocatedStudent.HasSpecialArticle > 0 ? false : true} value={this.state.studentPopup.AltPickupAddress == null ? "" : this.state.studentPopup.AltPickupAddress}
                                onChange={this.onPickupAddressChange} />
                            <TextInput style="col33 allocated-input" disabled={this.props.allocatedStudent.HasSpecialArticle > 0 ? false : true} value={this.state.studentPopup.AltPickupTime == null ? "" : this.state.studentPopup.AltPickupTime}
                                onChange={this.onPickupTimeChange} />
                        </div>
                        <div className={"field"}>
                            <label className={"col66 "}>Drop off address</label>
                            <label className={"col33"}>Drop off time <small className="hidden-mob-inline">(HH:mm:ss)</small></label>
                        </div>
                        <div className={"value"}>
                            <TextInput style="col66 allocated-input" disabled={this.props.allocatedStudent.HasSpecialArticle > 0 ? false : true} value={this.state.studentPopup.AltDropoffAddress == null ? "" : this.state.studentPopup.AltDropoffAddress}
                                onChange={this.onDropoffAddressChange} />
                            <TextInput style="col33 allocated-input" disabled={this.props.allocatedStudent.HasSpecialArticle > 0 ? false : true} value={this.state.studentPopup.AltDropoffTime == null ? "" : this.state.studentPopup.AltDropoffTime}
                                onChange={this.onDropoffTimeChange} />
                        </div>
                        <div className={"field"}>
                            <label className={"col33"} >Amount</label>

                        </div>
                        <div className={"value col33"}>
                            <TextInput style="col33 allocated-input" disabled={this.props.allocatedStudent.HasSpecialArticle > 0 ? false : true} value={this.state.studentPopup.Amount == 0 ? "" : this.state.studentPopup.Amount}
                                onChange={this.onAmountChange} />
                        </div>

                    </div>
                    {this.props.allocatedStudent.HasSpecialArticle > 0 ?
                        <div className={"popup-button-container"}>
                            <button id="Save" className="btn btn-default btn-primary pull-right" onClick={this.saveAllocatedStudentPopup} >Save</button>
                        </div>
                        : null}

                </SkyLight>}
            </div>
        )
    }
}

export default DragSource(ItemTypes.AllocatedStudent, allocatedStudentSource, collect)(AllocatedStudent);
