import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';


class Search extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.searchPopup = this.searchPopup.bind(this);
  }

  searchPopup() {
    this.refs.searchDialog.show();
  }

  render() {


    var myBigGreenDialog = {
      width: '40vw',
      height: '35opx',
      backgroundColor: 'rgb(62, 62, 61)',
      fontSize: '14px',
      padding: '0px'
    };

    var title =
      {
        fontSize: '18px',
        height: '5%',
        marginLeft: '20px',
        color: 'white'
      };

    return (
      <div>
        <div className="search hidden-mob">
          <ul className="list-unstyled">
            <li className="list-unstyled-field"> <label className="search-param ">Destination</label> </li>
            <li className="list-unstyled-value"><SelectInput
              name="destination"
              label="destination"
              defaultOption="Select" value={this.props.search && this.props.search.destination}
              options={this.props.destinations}
              onChange={this.props.updateDestination}
            /> </li>
            <li className="list-unstyled-field"><label className="search-param">Transfer Date</label> </li>
            <li className="list-unstyled-value"> <DateField value={this.props.search && this.props.search.transferDate && new Date(this.props.search.transferDate)}
              dateFormat="YYYY-MM-DD" onChange={this.props.updateTransferDate} expandOnFocus={true} locale={"en-Gb"}
              updateOnDateClick={true} collapseOnDateClick={true} defaultValue={new Date()} clearIcon={false}>
              <DatePicker footer={false} />
            </DateField> </li>
            <li className="list-unstyled-field"><label className="search-param">Transfer Type</label> </li>
            <li className="list-unstyled-value"> <SelectInput
              name="transferType"
              label="Transfer type"
              value={this.props.search && this.props.search.transferType}
              options={this.props.transferTypes} onChange={this.props.updateTransferType}
            /></li>
            <li className="list-unstyled-field"><label className="search-param">Airport</label> </li>
            <li className="list-unstyled-value"><SelectInput
              name="airport"
              label="Airport"
              value={this.props.search && this.props.search.gateway}
              options={this.props.gateways} onChange={this.props.updateGateway}
            /> </li>
            <li className="pull-right">
              <button className="btn btn-default" onClick={this.props.onSearch}>Search</button>
            </li>
          </ul>
        </div>
        <div className="search hidden-desk">
          <button className="btn btn-default " onClick={this.searchPopup}>Search</button>
          {<SkyLight dialogStyles={myBigGreenDialog} hideOnOverlayClicked titleStyle={title} ref="searchDialog" title="Search" >
            <div className="popup-container">
              <div className="row field">
                <label >Destination</label>
              </div>
              <div className="row value">
                <SelectInput
                  name="destination"
                  label="destination"
                  defaultOption="Select" value={this.props.search && this.props.search.destination}
                  options={this.props.destinations}
                  onChange={this.props.updateDestination}
                />
              </div>
              <div className="row field">
                <label >Transfer Date <small> (yyyy-mm-dd)</small></label>
              </div>
              <div className="row value">
                <TextInput onChange={this.props.updateTransferDateMobile} value={this.props.search && this.props.search.transferDate} />
              </div>
              <div className="row field">
                <label >Transfer Type</label>
              </div>
              <div className="row value">
                <SelectInput
                  name="transferType"
                  label="Transfer type"
                  value={this.props.search && this.props.search.transferType}
                  options={this.props.transferTypes} onChange={this.props.updateTransferType}
                />
              </div>
              <div className="row field">
                <label >Airport</label>
              </div>
              <div className="row value">
                <SelectInput
                  name="airport"
                  label="Airport"
                  value={this.props.search && this.props.search.gateway}
                  options={this.props.gateways} onChange={this.props.updateGateway}
                />
              </div>
            </div>
            <div className={"popup-button-container"}>
              <button id="add" className="btn btn-default pull-right" onClick={this.props.onSearch} >Search</button>
            </div>
          </SkyLight>}
        </div>
      </div>
    );
  };
}

Search.propTypes = {
  gateways: PropTypes.array,
  transferTypes: PropTypes.array,
  destinations: PropTypes.array,
  onSearch: PropTypes.func,
  updateDestination: PropTypes.func,
  updateGateway: PropTypes.func,
  updateTransferType: PropTypes.func,
  updateTransferDate: PropTypes.func,
};



export default Search;