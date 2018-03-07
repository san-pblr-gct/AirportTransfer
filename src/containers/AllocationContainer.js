import React, { PropTypes } from 'react';
import Allocation from '../components/allocation/allocation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as studentActions from '../actions/studentsActions';
import * as taxiActions from '../actions/taxiActions';
import Alert from 'react-s-alert';

class AllocationContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errors: {}
        };
        this.deleteTaxi = this.deleteTaxi.bind(this);
        this.unallocatedToAllocated = this.unallocatedToAllocated.bind(this);
        this.allocatedToUnallocated = this.allocatedToUnallocated.bind(this);
        this.loadAllocatedStudentPopup = this.loadAllocatedStudentPopup.bind(this);
        this.saveAllocatedStudentPopup = this.saveAllocatedStudentPopup.bind(this);
    }

    deleteTaxi(taxiId) {
        this.props.taxiActions.deleteTaxi(taxiId, this.props.user.UserID, this.props.user.SecurityToken)
            .then()
            .catch(error => {
            });
    }

    unallocatedToAllocated(student) {
        this.props.studentActions.unallocatedToAllocated(student, this.props.user.SecurityToken)
            .then(data => {
                if (data.data.Status == "Fail")
                    Alert.error('Unallocation failed for ' + student[0].Name + ". " + data.data.Description, {
                        effect: 'bouncyflip',
                        position: 'top',
                        timeout: 5000
                    })
                else
                    Alert.success('Allocation successful for ' + student[0].Name, {
                        position: 'top-left',
                        effect: 'bouncyflip',
                        timeout: 2000
                    })
            }
            )
            .catch(error => {
            });
    }

    allocatedToUnallocated(student, name) {
        this.props.studentActions.allocatedToUnallocated(student, this.props.user.SecurityToken)
            .then(data => {
                if (data.data.Status == "Fail")
                    Alert.error('Unallocation failed for ' + name + ". " + data.data.Description, {
                        effect: 'bouncyflip',
                        position: 'top',
                        timeout: 5000
                    })
                else
                    Alert.success('Unallocation successful for ' + name, {
                        position: 'top-left',
                        effect: 'bouncyflip',
                        timeout: 2000
                    })
            }
            )
            .catch(error => {
            });
    }
    loadAllocatedStudentPopup(LSTransportationAllocatedStudentId) {
        this.props.studentActions.loadAllocatedStudentPopup(LSTransportationAllocatedStudentId, this.props.search.transferType, this.props.user.SecurityToken)
            .then()
            .catch(error => {
            });
    }

    saveAllocatedStudentPopup(AllocatedStudentId, PickUpAddress, PickUpTime, DropupAddress, DropofTime, Amount) {
        this.props.studentActions.saveAllocatedStudentPopup(AllocatedStudentId, PickUpAddress, PickUpTime, DropupAddress, DropofTime, Amount, this.props.user.UserID,
            $.trim(this.props.search.destination), this.props.user.SecurityToken)
            .then()
            .catch(error => {
            });
    }
    render() {
        return (

            < Allocation  {...this.props} deleteTaxi={this.deleteTaxi}
                unallocatedToAllocated={this.unallocatedToAllocated}
                allocatedToUnallocated={this.allocatedToUnallocated}
                loadAllocatedStudentPopup={this.loadAllocatedStudentPopup}
                saveAllocatedStudentPopup={this.saveAllocatedStudentPopup} />

        );
    }
}

AllocationContainer.propTypes = {
    studentActions: PropTypes.object.isRequired,
    taxiActions: PropTypes.object.isRequired,
    unallocatedStudents: PropTypes.array,
    taxis: PropTypes.array,
    vehicles: PropTypes.array,
    gateways: PropTypes.array,
    search: PropTypes.object,
    allocatedStudent: PropTypes.object,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        unallocatedStudents: state.unallocatedStudents,
        vehicles: state.vehicles,
        search: state.search,
        taxis: state.taxis,
        gateways: state.gateways,
        allocatedStudent: state.allocatedStudent,
        user: state.user,
        kpi: state.kpi,
        searchLoading:state.searchLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        studentActions: bindActionCreators(studentActions, dispatch),
        taxiActions: bindActionCreators(taxiActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllocationContainer);

