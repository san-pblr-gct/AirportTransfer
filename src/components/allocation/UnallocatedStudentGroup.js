import React, { PropTypes } from 'react';
import UnallocatedStudent from './UnallocatedStudent';


class UnallocatedStudentGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };

    }


    render() {
        let isCollapsed = this.state.collapsed;
        return (
            <div >
                <div className="white unallocated-top" onClick={() => { this.setState({ collapsed: !this.state.collapsed }); }}><b>{this.props.unallocatedStudentsGroup.key + ' (' + this.props.unallocatedStudentsGroup.value.length + ') '} </b>
                    {isCollapsed ?
                        <button className="glyphicon glyphicon-plus" ></button>
                        :
                        <button className="glyphicon glyphicon-minus"></button>
                    }
                </div>
                {!isCollapsed ?
                    this.props.unallocatedStudentsGroup.value && this.props.unallocatedStudentsGroup.value.length > 0 && this.props.unallocatedStudentsGroup.value.map((student, index) => {
                        return (
                            <UnallocatedStudent key={student.BookingID} user={this.props.user} showAccommodationAddressBooking={this.props.showAccommodationAddressBooking}
                                showAccommodationAddress={this.props.showAccommodationAddress} updateAccommodationAddress={this.props.updateAccommodationAddress}
                                openAccommodationAddress={this.props.openAccommodationAddress} cancelAccommodationAddress={this.props.cancelAccommodationAddress}
                                saveAccommodationAddress={this.props.saveAccommodationAddress}
                                unallocatedStudent={student} unallocatedToAllocated={this.props.unallocatedToAllocated} search={this.props.search} >
                            </UnallocatedStudent>
                        )
                    }) : ""
                }
            </div >

        );
    };
}

export default UnallocatedStudentGroup;