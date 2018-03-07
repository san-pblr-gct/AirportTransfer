import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SkyLight from 'react-skylight';
import SelectInput from '../common/SelectInput';
import TextInput from '../common/TextInput';
import * as taxiActions from '../../actions/taxiActions';
import Alert from 'react-s-alert';

class AddTaxi extends React.Component {
  constructor(props) {
    super(props);
    this.loadTaxiPopup = this.loadTaxiPopup.bind(this);
    this.supplierChange = this.supplierChange.bind(this);
    this.gatewayChange = this.gatewayChange.bind(this);
    this.vehicleChange = this.vehicleChange.bind(this);
    this.noOfVechileChange = this.noOfVechileChange.bind(this);
    this.addTaxi = this.addTaxi.bind(this);
    this.state = {
      SupplierId: "",
      VehicleTypeCode: "",
      NoOfVechile: "",
      Gateway: "",
      Vehicle: {},
      Suppliers: [],
      Vehicles: []
    };
  }



  loadTaxiPopup() {
    this.refs.addTaxiDialog.show();
    this.props.taxiActions.loadTaxiPopup(this.props.search.destination, this.props.search.transferType, this.props.search.transferDate, this.props.user.SecurityToken)
      .then()
      .catch(error => {
      });
  }

  gatewayChange(event) {
    this.setState({ Gateway: event.target.value });
    this.setState({ Suppliers: this.props.vehicles.filter(m => m.GateWay == event.target.value) });
  }

  supplierChange(event) {
    this.setState({ SupplierId: event.target.value });
    this.setState({ Vehicles: this.props.vehicles.filter(m => m.GateWay == this.state.Gateway && m.Supplier_Id == event.target.value) });
  }

  vehicleChange(event) {
    this.setState({ VehicleTypeCode: event.target.value });
    this.setState({
      Vehicle: this.props.vehicles.filter(m => m.GateWay == this.state.Gateway && m.Supplier_Id == this.state.SupplierId
        && m.VechileTypeCode === event.target.value)[0]
    });
  }

  noOfVechileChange(event) {
    this.setState({ NoOfVechile: event.target.value });
  }

  addTaxi() {
    let taxi = {
      "SupplierID": this.state.SupplierId, "DestinationCode": this.props.search.destination, "TransferTypeCode": this.props.search.transferType,
      "VehicleTypeCode": this.state.VehicleTypeCode, "GateWayCode": this.state.Gateway, "CurrencyCode": this.state.Vehicle.CurrencyCode,
      "UserID": this.props.user.UserID, "NoOfVechile": this.state.NoOfVechile, "TransferDate": this.props.search.transferDate, "TotalSeat": this.state.Vehicle.TotalSeat,
      "AvaliableSeat": this.state.Vehicle.TotalSeat, "TotalCost": this.state.Vehicle.Price
    }
    Alert.closeAll();
    let message = "<h4>Please select a value for the fields below</h4><ul>"
    let error = false;
    if ($.trim(this.state.SupplierId) === "") {
      error = true;
      message += '<li>Supplier  </li>';
    }
    if ($.trim(this.state.VehicleTypeCode) === "") {
      error = true;
      message += '<li>Vehicle Type  </li>';
    }
    if ($.trim(this.state.Gateway) === "") {
      error = true;
      message += '<li>Gateway </li>';
    }
    if ($.trim(this.state.NoOfVechile) === "") {
      error = true;
      message += '<li>Number of Vehicle </li>';
    }

    if (!error) {
      if (/^([0-1]?[0-9]|20)$/.test(this.state.NoOfVechile)) {
        this.props.taxiActions.addTaxi(taxi, this.props.user.SecurityToken)
          .then(data => {
            this.refs.addTaxiDialog.hide();
            this.setState({ Gateway: "" });
            this.setState({ NoOfVechile: "" });
            this.setState({ VehicleTypeCode: "" });
            this.setState({ SupplierId: "" });
          })
          .catch(error => {
          });
      }
      else
        Alert.error("Enter valid number for Vehicle (between 1-20)" + '</ul>', {
          position: 'top',
          effect: 'bouncyflip',
          html: true
        });
    }

    else
      Alert.error(message + '</ul>', {
        position: 'top',
        effect: 'bouncyflip',
        html: true
      });


  }


  render() {

    var myBigGreenDialog = {
      width: '40vw',
      height: '40ovh',
      backgroundColor: 'rgb(62, 62, 61)',
      fontSize: '12px',
      padding: '0px'
    };

    var title =
      {
        fontSize: '2vh',
        height: '5%',
        marginLeft: '20px',
        color: 'white'
      };

    return (

      <div>
        <button id="addTaxi" className="btn btn-default btn-primary to-popup" onClick={this.loadTaxiPopup}>Add Taxi</button>

        {<SkyLight dialogStyles={myBigGreenDialog} hideOnOverlayClicked titleStyle={title} ref="addTaxiDialog" title="Add Taxi" >
          <div className="popup-container">
            <div className="value">
              <label >Gateway</label><SelectInput
                name="gatewayAddTaxi"
                label="gatewayAddTaxi"
                defaultOption="Select" options={this.props.vehicles}
                onChange={this.gatewayChange}
              />
            </div>
            <div className=" value">
              <label >Supplier</label><SelectInput
                name="supplier"
                label="supplier"
                defaultOption="Select" options={this.state.Suppliers}
                onChange={this.supplierChange}
              />
            </div>
            <div className=" value">
              <label >Vehicle type</label><SelectInput
                name="vehicle"
                label="vehicle"
                defaultOption="Select" options={this.state.Vehicles}
                onChange={this.vehicleChange}
              />
            </div>
            <div className=" value">
              <label >No. of vehicles</label>
              <TextInput onChange={this.noOfVechileChange} />
            </div>
          </div>
          <div className={"popup-button-container"}>
            <button id="add" className="btn btn-default btn-primary pull-right" onClick={this.addTaxi} >Add</button>
          </div>
        </SkyLight>}
      </div>
    )
  }
}

AddTaxi.propTypes = {
  taxiActions: PropTypes.object.isRequired

};

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taxiActions: bindActionCreators(taxiActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTaxi);
