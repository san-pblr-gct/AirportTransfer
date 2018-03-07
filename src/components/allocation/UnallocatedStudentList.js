import React, { PropTypes } from 'react';
import { DropTarget, DragLayer } from 'react-dnd';
import ItemTypes from '../../constants/itemTypes';
import UnallocatedStudentGroup from './UnallocatedStudentGroup';
import SelectInput from '../common/SelectInput';
import Alert from 'react-s-alert';


const unallocatedTarget = {
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



class UnallocatedStudentList extends React.Component {
    constructor(props) {
        super(props);
        this.onSortChange = this.onSortChange.bind(this);
        this.onGroupChange = this.onGroupChange.bind(this);
        this.compareValues = this.compareValues.bind(this);
        this.sortBy = this.sortBy.bind(this);
        this.updateAccommodationAddress = this.updateAccommodationAddress.bind(this);
        this.openAccommodationAddress = this.openAccommodationAddress.bind(this);
        this.cancelAccommodationAddress = this.cancelAccommodationAddress.bind(this);
        this.saveAccommodationAddress = this.saveAccommodationAddress.bind(this);
        this.state = {
            unallocatedStudentsGroup: localStorage.getItem("unallocatedStudentsGroup") == null ? [] : JSON.parse(localStorage.getItem("unallocatedStudentsGroup")),
            sortBy: "",
            groupBy: "",
            showAccommodationAddress: false,
            showAccommodationAddressBooking: null,
            showAccommodationStudent: {}
        }

    }

    openAccommodationAddress(value, booking, showAccommodationStudent) {
        this.setState({
            'showAccommodationAddress': value,
            'showAccommodationAddressBooking': booking,
            'showAccommodationStudent': Object.assign({}, showAccommodationStudent)
        });
    }

    updateAccommodationAddress(event) {
        this.setState({
            'showAccommodationStudent': Object.assign({}, this.state.showAccommodationStudent, {
                AccommodationAddress: $.trim(event.target.value)
            })
        })
    }

    saveAccommodationAddress() {
        if ($.trim(this.state.showAccommodationStudent.AccommodationAddress) === "")
            Alert.error("Enter Accommodation address" + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true
            });
        else {
            this.props.unallocatedToAllocated([this.state.showAccommodationStudent]);
            this.setState({
                'showAccommodationAddress': false,
                'showAccommodationAddressBooking': null,
                'showAccommodationStudent': Object.assign({}, )
            });
        }
    }
    cancelAccommodationAddress() {
        this.setState({
            'showAccommodationAddress': false,
            'showAccommodationAddressBooking': null,
            'showAccommodationStudent': Object.assign({}, )
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.unallocatedStudents != this.props.unallocatedStudents) {
            this.group(this.state.groupBy, this.state.sortBy);
        }
    }


    compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }
            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };
    }

    onSortChange(event) {
        this.setState({
            'sortBy': event.target.value
        });
        this.group(this.state.groupBy, event.target.value);
    }

    onGroupChange(event) {
        this.setState({
            'groupBy': event.target.value
        });
        this.group(event.target.value, this.state.sortBy);
    }

    group(field, sortByField) {
        let groups = {};
        let key = "";
        let gateway=this.props.search.transferType;
        this.props.unallocatedStudents.forEach(function (item) {
            if (field == "") {
                key = gateway=="TFARR" ?$.trim(item.ArrGateCode):$.trim(item.DepGateCode);
            }
            else if (field == "Residence") {
                key = $.trim(item.AccommodationType) == "RE" ? $.trim(item.AllocatedSupplierName) : "Non residence";
            }
            else if (field == "Host family") {
                key = $.trim(item.AccommodationType) == "HF" ? $.trim(item.AllocatedSupplierName) : "Non HF";
            }
            else if (field == "Post code") {
                key = $.trim(item.PostCode) != "" ? $.trim(item.PostCode) : "No Post code";
            }
            else if (field == "Age") {
                key = $.trim(item.AGE);
            }
            else if (field == "Group") {
                key = $.trim(item.GroupCode) == "" ? "Not Group Booking" : $.trim(item.GroupCode)
            }
            else if (field == "Accommodation") {
                key = $.trim(item.AccommodationType) == "" ? "No Accommodation detail" : $.trim(item.AccommodationType)
            }
            else if (field == "STUM") {
                key = $.trim(item.HasSTUMArticle) === true ? "Students with STUM" : "Students without STUM"
            }

            var list = groups[key];
            if (list) {
                list.push(item);
            } else {
                groups[key] = [item];
            }
        });
        var groups2 = [];
        var prop;
        for (prop in groups) {
            if (groups.hasOwnProperty(prop)) {
                groups2.push({
                    'key': prop,
                    'keySort': (prop == "Non HF" || prop == "Not Group Booking" || prop == "No Accommodation detail"
                        || prop == "Non residence" || prop == "No Post code") ? "zzzz" + prop : prop,
                    'value': groups[prop]
                });
            }
        }
        if ((sortByField == "Age (Desc)" && field == "Age") || (sortByField == "Name (Desc)" && (field == "Group" || field == "Residence" || field == "Host family" || field == "Post code")))
            groups2.sort(this.compareValues('keySort', 'desc'))
        else
            groups2.sort(this.compareValues('keySort', 'asc'))
        groups2.map((g, i) => {
            this.sortBy(g.value, sortByField)
        });
        this.setState({
            'unallocatedStudentsGroup': groups2
        });
        localStorage.unallocatedStudentsGroup = JSON.stringify(groups2)
    }


    sortBy(collections, field) {

        if (field == "Name (Asc)") {
            collections.sort(this.compareValues('Name', 'asc'))
        }
        else if (field == "Name (Desc)") {
            collections.sort(this.compareValues('Name', 'desc'))
        }
        else if (field == "Age (Asc)") {
            collections.sort(this.compareValues('AGE', 'asc'))
        }
        else if (field == "Age (Desc)") {
            collections.sort(this.compareValues('AGE', 'desc'))
        }
        else if (field == "") {
            collections.sort(this.compareValues('FlightDateTime', 'asc'))
        }
        else if (field == "Time (Desc)") {
            collections.sort(this.compareValues('FlightDateTime', 'desc'))
        }
    }

    render() {
        const { isOver, canDrop, connectDropTarget } = this.props;
        const sortBy = [{ "Code": "Time (Desc)", "Name": "Sort by: Time (Desc)" },
        { "Code": "Name (Asc)", "Name": "Sort by: Name (Asc)" },
        { "Code": "Name (Desc)", "Name": "Sort by: Name (Desc)" },
        { "Code": "Age (Asc)", "Name": "Sort by: Age (Asc)" },
        { "Code": "Age (Desc)", "Name": "Sort by: Age (Desc)" }]

        const groupBy = [
            { "Code": "Post code", "Name": "Group by : Post code" },
            { "Code": "Accommodation", "Name": "Group by : Accommodation" },
            { "Code": "Residence", "Name": "Group by : Residence" },
            { "Code": "Host family", "Name": "Group by : Host family" },
            { "Code": "Group", "Name": "Group by : Group" },
            { "Code": "Age", "Name": "Group by : Age" },
            { "Code": "STUM", "Name": "Group by : STUM" }
        ]

        return connectDropTarget(
            <div className="unallocated-student-list" >
                <div className="unallocated-top">
                    <div className="white"><b>Unallocated ({this.props.unallocatedStudents.length})</b></div>
                    <SelectInput defaultOption="Sort by : Time (Asc)"
                        name="sort By"
                        label="sort By"
                        options={sortBy}
                        onChange={this.onSortChange}
                    />
                    <SelectInput defaultOption="Group by : Gateway"
                        name="group by"
                        label="group By"
                        options={groupBy}
                        onChange={this.onGroupChange}
                    />
                </div>
                <hr className="white" />

                {
                    this.state.unallocatedStudentsGroup && this.state.unallocatedStudentsGroup.map((g, i) => {
                        return (
                            <UnallocatedStudentGroup key={g.key} user={this.props.user} showAccommodationAddressBooking={this.state.showAccommodationAddressBooking}
                                showAccommodationAddress={this.state.showAccommodationAddress} updateAccommodationAddress={this.updateAccommodationAddress}
                                openAccommodationAddress={this.openAccommodationAddress} cancelAccommodationAddress={this.cancelAccommodationAddress}
                                saveAccommodationAddress={this.saveAccommodationAddress}
                                unallocatedStudentsGroup={g} unallocatedToAllocated={this.props.unallocatedToAllocated}
                                search={this.props.search} ></UnallocatedStudentGroup>

                        )
                    })
                }
            </div>
        );
    }
}

export default DropTarget(ItemTypes.AllocatedStudent, unallocatedTarget, collect)(UnallocatedStudentList);
