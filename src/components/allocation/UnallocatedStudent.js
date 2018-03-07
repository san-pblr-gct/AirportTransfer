import React, { PropTypes } from 'react';
import SkyLight from 'react-skylight';
import moment from 'moment';
import { DragSource } from 'react-dnd';
import ItemTypes from '../../constants/itemTypes';
import * as studentsActions from '../../actions/studentsActions';
import Alert from 'react-s-alert';
import TextInput from './../common/TextInput';

//https://react-dnd.github.io/react-dnd/docs-overview.html
const unAllocatedStudentSource = {
    beginDrag(props) {
        return { unallocatedStudent: props.unallocatedStudent };
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }
        // When dropped on a compatible target, do something
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if ($.trim(props.search.transferType) == "TFARR" && $.trim(dropResult.taxi.GateWayCode) != $.trim(item.unallocatedStudent.ArrGateCode)) {
            Alert.error('Gateway of the taxi and the student are not matching', {
                position: 'top',
                effect: 'bouncyflip'
            });
        }
        else if ($.trim(props.search.transferType) == "TFDEP" && $.trim(dropResult.taxi.GateWayCode) != $.trim(item.unallocatedStudent.DepGateCode)) {
            Alert.error('Gateway of the taxi and the student are not matching', {
                position: 'top',
                effect: 'bouncyflip'
            });
        }
        else if (dropResult.taxi.TotalSeat - dropResult.taxi.AllocatedStudent.length <= 0) {
            Alert.error('No seats available', {
                position: 'top',
                effect: 'bouncyflip'
            });

        }
        else if ($.trim(item.unallocatedStudent.AccommodationType) === "") {

            var student = {
                "LSTransportationTaxiDetailId": dropResult.taxi.LSTransportationTaxiDetailID,
                "BookingID": item.unallocatedStudent.BookingID,
                "CourseBooking_Id": item.unallocatedStudent.CourseBooking_Id,
                "DestinationCode": $.trim(props.search.destination),
                "FlightId": item.unallocatedStudent.FlightId,
                "FlightDateTime": item.unallocatedStudent.FlightDateTime,
                "GateWayCode": $.trim(item.unallocatedStudent.GateWayCode),
                "TransferArticle": $.trim(item.unallocatedStudent.TransferArticle),
                "TransferType": $.trim(props.search.transferType),
                "TransferAllocatedDate": props.search.transferDate,
                "AccommodationType": "",
                "Age": $.trim(item.unallocatedStudent.AGE),
                "Name": $.trim(item.unallocatedStudent.Name),
                "ArrGateCode": $.trim(item.unallocatedStudent.ArrGateCode),
                "DepGateCode": $.trim(item.unallocatedStudent.DepGateCode),
                "TransferBookingArticleId": item.unallocatedStudent.TransferBookingArticleId,
                "AccommodationAddress": "",
                "CourseCode": $.trim(item.unallocatedStudent.CourseCode),
                "HasSTUMArticle":$.trim(item.unallocatedStudent.HasSTUMArticle),
                "UserId": props.user.UserID
            };

            props.openAccommodationAddress(true, item.unallocatedStudent.BookingID, student);
        }
         else {

            var student = {
                "LSTransportationTaxiDetailId": dropResult.taxi.LSTransportationTaxiDetailID,
                "BookingID": item.unallocatedStudent.BookingID,
                "CourseBooking_Id": item.unallocatedStudent.CourseBooking_Id,
                "DestinationCode": $.trim(props.search.destination),
                "FlightId": item.unallocatedStudent.FlightId,
                "FlightDateTime": item.unallocatedStudent.FlightDateTime,
                "GateWayCode": $.trim(item.unallocatedStudent.GateWayCode),
                "TransferArticle": $.trim(item.unallocatedStudent.TransferArticle),
                "TransferType": $.trim(props.search.transferType),
                "TransferAllocatedDate": props.search.transferDate,
                "AccommodationType": $.trim(item.unallocatedStudent.AccommodationType),
                "Age": $.trim(item.unallocatedStudent.AGE),
                "Name": $.trim(item.unallocatedStudent.Name),
                "ArrGateCode": $.trim(item.unallocatedStudent.ArrGateCode),
                "DepGateCode": $.trim(item.unallocatedStudent.DepGateCode),
                "TransferBookingArticleId": item.unallocatedStudent.TransferBookingArticleId,
                "AccommodationAddress": "",
                "CourseCode": $.trim(item.unallocatedStudent.CourseCode),
                "HasSTUMArticle":$.trim(item.unallocatedStudent.HasSTUMArticle),
                "UserId": props.user.UserID
            };
            props.unallocatedToAllocated([student]);

        }

    }
};


function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}




class UnallocatedStudent extends React.Component {
    constructor(props) {
        super(props);
        this.loadUnallocatedPopup = this.loadUnallocatedPopup.bind(this);
    }

    loadUnallocatedPopup() {
        this.refs.unallocatedDialog.show();
    }

    render() {
        const { isDragging, connectDragSource } = this.props;
        var myBigGreenDialog = {
            height: '40opx',
            color: '#000',
            width: '40%',
            backgroundColor: 'rgb(62, 62, 61)',
            padding: '0px'
        };

        var title =
            { fontSize: '20px', color: 'white', marginLeft: '20px', };

        let style = "";

        if ($.trim(this.props.unallocatedStudent.CourseCode) === "JU" ||
            $.trim(this.props.unallocatedStudent.CourseCode) === "JI" ||
            this.props.unallocatedStudent.AGE < 18) {
            style = "junior";
        }
        else if ($.trim(this.props.unallocatedStudent.ProgramCode) === "AY")
            style = "ay";
        else
            style = "ls"

        return (
            <div>
                {connectDragSource(
                    <div className={"unallocated-student " + style}
                        id={this.props.unallocatedStudent.BookingId}>
                        {/*<div className={"unallocated-student-checkbox"}>
                            <input type="checkbox" />
                        </div >*/}
                        <div className={"unallocated-student-detail"} onClick={this.loadUnallocatedPopup}>
                            <div>
                                <span>{this.props.unallocatedStudent.Name},{this.props.unallocatedStudent.AGE}</span>
                                <span className={"pull-right"}>{moment(this.props.unallocatedStudent.FlightDateTime).format("HH:mm")}</span>
                            </div>
                            <div>
                                <span>{this.props.unallocatedStudent.Carrier}{this.props.unallocatedStudent.FlightNumber} - {this.props.search.transferType == "TFARR" ? this.props.unallocatedStudent.DepGateCode : this.props.unallocatedStudent.ArrGateCode}
                                </span>
                                {
                                    this.props.search.transferType == "TFARR" ?
                                        <span className={"pull-right"}> {this.props.unallocatedStudent.ArrGateCode}{this.props.unallocatedStudent.ArrTerminal && "-" + this.props.unallocatedStudent.ArrTerminal}</span> :
                                        <span className={"pull-right"}> {this.props.unallocatedStudent.DepGateCode}{this.props.unallocatedStudent.DepTerminal && "-" + this.props.unallocatedStudent.DepTerminal}</span>
                                }
                            </div>
                        </div>
                    </div>
                )}

                {<SkyLight className={"unallocated-student-detail"} dialogStyles={myBigGreenDialog} titleStyle={title} hideOnOverlayClicked ref="unallocatedDialog" title={this.props.unallocatedStudent.Name + ' , ' + this.props.unallocatedStudent.SalesBookingID} >
                    <div className="popup-container">
                        <div className={"field col3"}>
                            <label className={"col33"}>Age</label>
                            <label className={"col33"}>Gender</label>
                            <label className={"col33"}>Course</label>
                        </div>
                        <div className={"value col3"}>
                            <label className={"col33"}>{this.props.unallocatedStudent.AGE}</label>
                            <label className={"col33"}>{this.props.unallocatedStudent.Gender}</label>
                            <label className={"col33"}>{$.trim(this.props.unallocatedStudent.ProgramCode)} - {this.props.unallocatedStudent.CourseCode}</label>
                        </div>
                        <div className={"field col3"}>
                            <label className={"col33"}>Start Week</label>
                            <label className={"col33"}>End Week</label>
                            <label className={"col33"}>TW</label>
                        </div>
                        <div className={"value col3"}>
                            <label className={"col33"}>{this.props.unallocatedStudent.StartWeekCode}</label>
                            <label className={"col33"}>{this.props.unallocatedStudent.EndWeekCode}</label>
                            <label className={"col33"}>{this.props.unallocatedStudent.TogetherWith ? 'Yes' : 'No'}</label>
                        </div>
                        <div className={"field col3"}>
                            <label className={"col33"}>Stum</label>
                            <label className={"col33"}>Transfer Article</label>
                        </div>
                        <div className={"value col3"}>
                            <label className={"col33"}>{this.props.unallocatedStudent.HasSTUMArticle ? 'Yes' : 'No'}</label>
                            <label className={"col33"}>{this.props.unallocatedStudent.TransferArticle}</label>
                        </div>
                        <div className={"field"}>
                            <label >Accommodation</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col100"}>{this.props.unallocatedStudent.AccommodationAddress}</label>
                        </div>
                        <div className={"field"}>
                            <label >Special Notes</label>
                        </div>
                        <div className={"value"}>
                            <label className={"col100"}>{this.props.unallocatedStudent.SpecialNote}</label>
                        </div>
                    </div>
                </SkyLight>}
                {this.props.showAccommodationAddress && this.props.unallocatedStudent.BookingID == this.props.showAccommodationAddressBooking ?
                    <div id="popup1" className="overlay">
                        <div className="popup">
                            <h4>Enter accommodation address</h4>
                            <TextInput onChange={this.props.updateAccommodationAddress} />
                            <div className="pull-right">
                                <button className="btn btn-default btn-primary pull-right" onClick={() => this.props.saveAccommodationAddress()} >Save and Allocate</button>
                                <button className="btn btn-default" onClick={() => this.props.cancelAccommodationAddress()} >Cancel allocation</button>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div >
        )
    }
}

export default DragSource(ItemTypes.UnallocatedStudent, unAllocatedStudentSource, collect)(UnallocatedStudent);
