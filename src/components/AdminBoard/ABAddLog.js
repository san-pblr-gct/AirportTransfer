import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import styled from 'styled-components';

const ModalHeader = styled.h2`
font-size: 20px;
font-weight: bold;
padding-left: 2%;
margin-top: -2%;
border-bottom: 1px solid #e5e5e5;
padding: 15px;`;

const LogRows = styled.div`
width:90%!important;
padding-left:5%;`;

const LogLabel = styled.div`
color: #999;
font-weight: normal;
font-size:14px;
margin: 0;
padding-left: 12px;
margin-top:10px;
width:45%!important;
`;

const LogCommentsTxt = styled.div`
margin-left: 6%;
margin-top: 3%;`;

const LogEmailLabel = styled.p`
margin: 0 0 10px;
 `;
const LogCheckBox = styled.input.attrs({
  type: 'checkbox'
}) `
margin: 4px 0 0;
margin-top: 1px;
line-height: normal;
margin-right: -25% !important;
margin-left: -23% !important;
margin-top: 3%;
@supports (zoom:2.5) {
   zoom: 2.5;
}
@supports (-ms-ime-align: auto) {
  transform: scale(0.5);
  zoom:0 !important;
}
`;

const CheckBox = styled.div`
box-sizing: content-box;
width: 15px !important;
height: 15px;
border: 1px solid rgba(0, 0, 0, 0.33);
margin-right: 10px;
margin-left: 5px;
`;
const Tick = styled.div`
display: inline-block !important;
width: 4px !important;
height: 9px;
border: solid rgba(0, 128, 0, 0.65);
border-width: 0 2px 2px 0;
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
margin: 0% 0% 13% 35%;
`;

const LogComments = styled.div`
border-radius:7px;
&:focus{
  border-color: #66afe9;
  border-radius:7px;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
}`;

const LogSaveButton = styled.button`
border-radius: 20px;
text-align: center;
cursor: pointer;
border: 1px solid #B4B4B4;
color: #6B6B6B;
padding-left: 12%;
padding-bottom: 3%;
padding-top: 3%;
padding-right: 12%;
margin-left: 200%;
margin-right: 10%;
font-weight: 400;
line-height: 1.42857143;
text-align: center;
white-space: nowrap;
vertical-align: middle;
background-color: white;
width: 100px;
&:hover{
  border: 1px solid #10D345;
  background-color: #10D345;
  color: #fff;
  box-shadow: none;
}`;


const LogCancelButton = styled.button`
border-radius: 20px;
text-align: center;
cursor: pointer;
border: 1px solid #B4B4B4;
color: #6B6B6B;
padding-left: 10%;
padding-bottom: 3%;
padding-top: 3%;
padding-right: 10%;
margin-left: 225%;
margin-right: 10%;
font-weight: 400;
line-height: 1.42857143;
text-align: center;
white-space: nowrap;
vertical-align: middle;
background-color: white;
width: 100px;
&:hover{
  border: 1px solid red;
  background-color: red;
  color: #fff;
  box-shadow: none;
}`;

const LogButtonDiv = styled.div`
width:inherit!important;
margin-top:3%;
margin-bottom:3%;
`;

const LogButtons = styled.div`
display:inline-block;`

class ABAddLog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      logTypeChangeIndicator: true,
      selectedLogTypeCode: "BookingDetails",
      selectedLogType: "Booking Details",
      selectedLogCategory: "",
      selectedLogHandleIn: "",
      selectedLogDueDate: "",
      selectedLogEmailSalesOffice: true,
      selectedLogComments: ""
    }
    this.onLogTypeChange = this.onLogTypeChange.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onHandleInChange = this.onHandleInChange.bind(this);
    this.onDueOnChange = this.onDueOnChange.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.onEmailSalesOfficeChange = this.onEmailSalesOfficeChange.bind(this);
    this.addLogDialogClose = this.addLogDialogClose.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showInProgress === true) {
      this.refs.addLogDialog.show();
    }
    else if (nextProps.showInProgress === false || nextProps.showInProgress === this.props.showInProgress) {
      this.refs.addLogDialog.hide();
    }
  }


  onCancelClick() {
    this.setState({
      "selectedLogTypeCode": "BookingDetails",
      "selectedLogCategory": "",
      "selectedLogHandleIn": "",
      "selectedLogAssignedTo": "",
      "selectedLogDueDate": "",
      "selectedLogEmailSalesOffice": "",
      "selectedLogComments": ""
    });

    this.props.closeLogPopup();
    this.refs.addLogDialog.hide();

  }

  onLogTypeChange(event) {
    if (event.target.value !== "") {
      this.setState({
        'selectedLogTypeCode': event.target.value,
        'selectedLogType': event.target.value == "BookingDetails" ? "Booking Details" : event.target.value,
        'logTypeChangeIndicator': true,
        'selectedLogCategory': ""
      });
    }
  }
  onCategoryChange(event) {
    if (event.target.value !== "") {
      this.setState({
        'selectedLogCategory': event.target.value
      });
    }
  }
  onHandleInChange(event) {
    if (event.target.value !== "") {
      this.setState({
        'selectedLogHandleIn': event.target.value
      });
    }
  }

  onDueOnChange(dateString) {
    let d = new Date(dateString);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    let formatted = new Date(d),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.setState({
      'selectedLogDueDate': [year, month, day].join('-')
    });
  }
  onCommentChange(event) {
    this.setState({
      'selectedLogComments': event.target.value
    });

  }
  onEmailSalesOfficeChange() {
    this.setState({
      'selectedLogEmailSalesOffice': !this.state.selectedLogEmailSalesOffice
    });

  }

  addLogDialogClose() {
    this.setState({
      "selectedLogTypeCode": "BookingDetails",
      "selectedLogCategory": "",
      "selectedLogHandleIn": "",
      "selectedLogAssignedTo": "",
      "selectedLogDueDate": "",
      "selectedLogEmailSalesOffice": "",
      "selectedLogComments": ""
    });
    this.props.closeLogPopup();

  }

  
  render() {
    var inProgressPopup = {
      height: '75%',
      color: '#000',
      width: '50%',
      backgroundColor: 'rgb(255, 255, 255)',
      padding: '0px',
      top: '35%'
    };
    const handleIn = [{ "HandleName": "School" }, { "HandleName": "Sales Office" }];
    var today = new Date();
    var tomorrow = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + 1));

   

    var divStyle = {
      margin: "0 0 0 6%"
    };

    return (

      <div id='footer'>



        <SkyLight dialogStyles={inProgressPopup} ref="addLogDialog" afterClose={this.addLogDialogClose}>

          <ModalHeader>In Progress </ModalHeader>

          <LogRows>
            <LogLabel>Log types</LogLabel>
            <LogLabel>Category</LogLabel>
          </LogRows>
          <SelectInput
            name="logType"
            label="logType"
            options={this.props.addLogDropDowns.adminBoardLogType}
            selectedValue="Booking Details"
            onChange={this.onLogTypeChange}
            value={this.state.selectedLogTypeCode} />

          <div className="form-group">
            <select id="logCategory"
              name="logCategory" className="form-control"
              onChange={this.onCategoryChange}
              value={this.state.selectedLogCategory ? this.state.selectedLogCategory : ""}>
              <option value="">{"Select"}</option>
              {
                this.state.logTypeChangeIndicator ?
                  this.props.addLogDropDowns.adminBoardLogCategory && this.props.addLogDropDowns.adminBoardLogCategory
                    .filter(x => (x.LogTypeCode === this.state.selectedLogTypeCode))
                    .map(function (option) {
                      return (
                        <option key={option.CategoryCode + option.LogTypeCode} value={option.CategoryName}>{option.CategoryName}</option>
                      )
                    })
                  : null
              }
            </select>
          </div>
          <LogRows>
            <LogLabel>Handle in</LogLabel>
            <LogLabel>Assigned to</LogLabel>
          </LogRows>

          <SelectInput
            name="handleIn"
            label="handleIn"
            options={handleIn}
            selectedValue="School" defaultOption={null}
            value={this.state.selectedLogHandleIn ? this.state.selectedLogHandleIn : ""}
            onChange={this.onHandleInChange} />

          <SelectInput
            name="assignedTo"
            label="assignedTo"
            defaultOption={"Select"}
            options={this.props.addLogDropDowns.adminBoardLogAssignedTo}
            value={this.props.HasLoggedInUser}
            onChange={this.props.onAssignedToChange} />
          <LogRows>
            <LogLabel> Due Date </LogLabel>
          </LogRows>
          <div className="datediv" >
            <DateField
              dateFormat="YYYY-MM-DD" expandOnFocus={true} onChange={this.onDueOnChange}
              updateOnDateClick={true} collapseOnDateClick={true} defaultValue={this.state.selectedLogDueDate ? this.state.selectedLogDueDate : tomorrow} >
              <DatePicker footer={false} />
            </DateField>
          </div>
          <div className="email">
            <CheckBox onClick={this.onEmailSalesOfficeChange}>{(this.state.selectedLogEmailSalesOffice) ? <Tick /> : null}</CheckBox>
            <LogEmailLabel>Email Sales Office</LogEmailLabel>
          </div>
          <LogRows>
            <LogLabel>Comments</LogLabel>
          </LogRows>
          <div style={divStyle}>
            <textarea rows="8" cols="74" onChange={this.onCommentChange}>
              {this.state.selectedLogComments ? this.state.selectedLogComments : ""}
            </textarea>
          </div>
          <LogButtonDiv>
            <LogButtons><LogSaveButton onClick={() => { this.props.saveLogDetails(this.state.selectedLogType, this.state.selectedLogCategory, this.state.selectedLogHandleIn, this.state.selectedLogDueDate ? this.state.selectedLogDueDate : tomorrow, this.state.selectedLogEmailSalesOffice, this.state.selectedLogComments) }}>Save</LogSaveButton></LogButtons>
            <LogButtons><LogCancelButton onClick={this.onCancelClick}>Cancel</LogCancelButton></LogButtons>
          </LogButtonDiv>

        </SkyLight>

      </div >
    );
  }
}

ABAddLog.propTypes = {
};

export default ABAddLog;