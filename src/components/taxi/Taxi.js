import React, { PropTypes } from 'react';
import { DropTarget, DragLayer } from 'react-dnd';
import ItemTypes from '../../constants/itemTypes';
import AllocatedStudent from '../allocation/allocatedStudent'
import moment from 'moment';
import Alert from 'react-s-alert';
const taxiTarget = {
    canDrop(props, monitor) {
        // You can disallow drop based on props or item
        const item = monitor.getItem();
        return true;
    },

    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            // If you want, you can check whether some nested
            // target already handled drop
            return;
        }

        // Obtain the dragged item
        const item = monitor.getItem();
        // You can do something with it
        //ChessActions.movePiece(item.fromPosition, props.position);

        // You can also do nothing and return a drop result,
        // which will be available as monitor.getDropResult()
        // in the drag source's endDrag() method
        return { taxi: props.taxi };
    }
};


function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        // You can ask the monitor about the current drag state:
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType()
    };
}


class Taxi extends React.Component {
    constructor(props) {
        super(props);
        this.DeleteTaxi = this.DeleteTaxi.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.state = {
            collapsed: true
        };

    }

    DeleteTaxi() {
        if (this.props.taxi.AllocatedStudent.length > 0)
            Alert.error('Taxi has allocations. Please unallocate before deleting the taxi', {
                position: 'top',
                effect: 'bouncyflip'
            });
        else
            this.props.deleteTaxi(this.props.taxi.LSTransportationTaxiDetailID);
    }

    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }


    render() {
        const isCollapsed = this.state.collapsed;
        let array = [...this.props.taxi.AllocatedStudent];
        array.sort(function (a, b) {
            return new Date(a.FlightDateTime) - new Date(b.FlightDateTime);
        });
        let lowest = "";
        let highest = "";
        if (array.length > 0) {
            lowest = array[0].FlightDateTime.substring(11, 16);
            highest = array[array.length - 1].FlightDateTime.substring(11, 16);
        }
        const { isOver, canDrop, connectDropTarget } = this.props;
        let rows = [], i = 0;
        while (++i <= this.props.taxi.TotalSeat) rows.push(i);

        return (connectDropTarget(
            <div className={"taxis"}>

                <div className={"taxi-gateway"}>
                    <span><b>{$.trim(this.props.search.transferType) == "TFARR" ? this.props.taxi.GateWayCode : this.props.search.destination.substring(3, 6)}- {$.trim(this.props.search.transferType) == "TFARR" ? this.props.search.destination.substring(3, 6) : this.props.taxi.GateWayCode}</b></span>
                    <span className="hidden-mob-inline"><i>First  {$.trim(this.props.search.transferType) == "TFARR" ? "Arr" :" Dep" } Flight : <b>{lowest}</b></i></span>
                    <span className="hidden-mob-inline"><i>Last {$.trim(this.props.search.transferType) == "TFARR" ? "Arr" :" Dep" } Flight : <b>{highest}</b></i></span>
                    <span className="hidden-desk-inline"><i>F{$.trim(this.props.search.transferType) == "TFARR" ? "A" :" D" }F : <b>{lowest}</b></i></span>
                    <span className="hidden-desk-inline"><i>L{$.trim(this.props.search.transferType) == "TFARR" ? "A" :" D" }F : <b>{highest}</b></i></span>
                    <div>
                        <button className="glyphicon glyphicon-trash" onClick={this.DeleteTaxi} ></button>
                    </div>
                </div>
                <div className={"taxi-name"} onClick={this.toggleCollapse}>
                    <div className={"taxi-name-left"}>
                        <span><b>{this.props.taxi.TaxiSupplierName},{this.props.taxi.LSTransportationTaxiDetailID}</b></span>
                    </div>
                    <div className={"taxi-name-right"}>
                        <span className="hidden-mob-inline"> <b>Total Seats-{this.props.taxi.TotalSeat}</b></span>
                        <span className="hidden-mob-inline"><b>Seats Available-{this.props.taxi.TotalSeat - this.props.taxi.AllocatedStudent.length}</b></span>
                        <span className="hidden-desk-inline">TS-{this.props.taxi.TotalSeat}</span>
                        <span className="hidden-desk-inline">SA-{this.props.taxi.TotalSeat - this.props.taxi.AllocatedStudent.length}</span>
                        <span><b>{this.props.taxi.TotalCost} {this.props.taxi.CurrencyCode}</b></span>

                        {!isCollapsed ?
                            <button className="glyphicon glyphicon-chevron-up"  ></button>
                            :
                            <button className="glyphicon glyphicon-chevron-down"  ></button>
                        }
                    </div>
                </div>
                {!isCollapsed ?
                    <div className={"allocated-student-detail"}>
                        {this.props.taxi.AllocatedStudent && this.props.taxi.AllocatedStudent.map((student, index) => {
                            return (
                                <AllocatedStudent key={student.LSTransportationAllocatedStudentId} allocatedStudent={student} allocatedToUnallocated={this.props.allocatedToUnallocated}
                                    loadAllocatedStudentPopup={this.props.loadAllocatedStudentPopup} user={this.props.user} search={this.props.search}
                                    saveAllocatedStudentPopup={this.props.saveAllocatedStudentPopup} studentPopup={this.props.allocatedStudent}
                                    style={index % 2 == 0 ? "odd" : "even"}></AllocatedStudent>
                            )
                        })}

                        {rows && rows.map((taxi, index) => {
                            return (
                                index >= this.props.taxi.AllocatedStudent.length &&
                                <div key={index} className={(index % 2 == 0 ? "odd" : "even")}>drag and drop here</div>
                            )
                        })}
                    </div>
                    : <div />
                }
            </div>
        )
        )
    }
}

export default DropTarget(ItemTypes.UnallocatedStudent, taxiTarget, collect)(Taxi);
