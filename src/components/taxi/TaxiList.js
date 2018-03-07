import React, { PropTypes } from 'react';
import Taxi from './Taxi';
import SelectInput from '../common/SelectInput';



class TaxiList extends React.Component {
    constructor(props) {
        super(props);
        this.onSortChange = this.onSortChange.bind(this);
        this.compareValues = this.compareValues.bind(this);
        this.sort = this.sort.bind(this);
        this.state = {
            taxis: props.taxis,
            sortBy: "Gateway (Asc)"
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.taxis != nextProps.taxis) {
            this.setState({ taxis: [...nextProps.taxis] });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.taxis != this.state.taxis)
            this.sort(this.state.sortBy);
    }


    compareValues(key, key2, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }
            if (!a.hasOwnProperty(key2) || !b.hasOwnProperty(key2)) {
                // property doesn't exist on either object
                return 0;
            }
            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];
            const varC = (typeof a[key2] === 'string') ?
                a[key2].toUpperCase() : a[key2];
            const varD = (typeof b[key2] === 'string') ?
                b[key2].toUpperCase() : b[key2];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            else {
                if (varC > varD) {
                    comparison = 1;
                } else if (varC < varD) {
                    comparison = -1;
                }

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
        this.sort(event.target.value);
    }
    sort(field) {

        if (field == "Gateway (Asc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('GateWayCode', 'LSTransportationTaxiDetailID', 'asc'))
            });
        }
        else if (field == "Gateway (Desc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('GateWayCode', 'LSTransportationTaxiDetailID', 'desc'))
            });
        }
        else if (field == "Empty Seats (Asc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('AvaliableSeat', 'LSTransportationTaxiDetailID', 'asc'))
            });
        }
        else if (field == "Empty Seats (Desc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('AvaliableSeat', 'LSTransportationTaxiDetailID', 'desc'))
            });
        }
        else if (field == "Suppliers (Asc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('TaxiSupplierName', 'LSTransportationTaxiDetailID', 'asc'))
            });
        }
        else if (field == "Suppliers (Desc)") {
            this.setState({
                'taxis': this.state.taxis.sort(this.compareValues('TaxiSupplierName', 'LSTransportationTaxiDetailID', 'desc'))
            });
        }
    }

    render() {
        const sortBy = [{ "Code": "Gateway (Asc)", "Name": "Gateway (Asc)" },
        { "Code": "Gateway (Desc)", "Name": "Gateway (Desc)" },
        { "Code": "Empty Seats (Asc)", "Name": "Empty Seats (Asc)" },
        { "Code": "Empty Seats (Desc)", "Name": "Empty Seats (Desc)" },
        { "Code": "Suppliers (Asc)", "Name": "Suppliers (Asc)" },
        { "Code": "Suppliers (Desc)", "Name": "Suppliers (Desc)" }];
        return (

            <div >
                <div className="container kpi">Average Transfer Cost : <b> Per transfer:{this.props.kpi.PerTransfer} {this.props.kpi.CurrencyCode}/Per pax: {this.props.kpi.PerPax} {this.props.kpi.CurrencyCode}</b>

                    <SelectInput
                        name="sort By"
                        label="sort By"
                        options={sortBy}
                        defaultOption="Sort By"
                        onChange={this.onSortChange}
                    />
                </div>
                {this.state.taxis && this.state.taxis.map((taxi, index) => {
                    return (
                        <Taxi key={taxi.LSTransportationTaxiDetailID} taxi={taxi} deleteTaxi={this.props.deleteTaxi} allocatedToUnallocated={this.props.allocatedToUnallocated}
                            loadAllocatedStudentPopup={this.props.loadAllocatedStudentPopup} search={this.props.search}
                            saveAllocatedStudentPopup={this.props.saveAllocatedStudentPopup}
                            allocatedStudent={this.props.allocatedStudent} user={this.props.user} />
                    );
                })}
            </div>
        );
    }
}
export default TaxiList;