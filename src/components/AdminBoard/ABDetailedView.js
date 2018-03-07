import React, { PropTypes } from 'react';
import 'react-date-picker/index.css';
import ABDetailedGeneralView from '../../components/AdminBoard/ABDetailedGeneralView';
import ABLogDetail from '../../components/AdminBoard/ABLogDetail';
import ABGlobalAction from '../../components/AdminBoard/ABGlobalAction';
import styled from 'styled-components';

const InfoCategory = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:2.5fr 3.5fr 2fr 2fr 2fr;
-ms-grid-columns:2.5fr 3.5fr 2fr 2fr 2fr;
margin: 5% 0% 5% 5%;
font-family: 'Open Sans', sans-serif;
color: #333333;
font-size: 15px;
`;

const InfoType = styled.div`
float: left;
font-weight: bold;
padding: 3%;
cursor: pointer;
-ms-grid-column: ${props=>props.index};
${props => props.selected ? 'text-decoration: underline;':''}

&:hover {
  cursor: pointer;
  text-decoration: underline;  
}  
`;
const Image = styled.img`
width: 18px;
padding-left: 5%;
`;
const RightMenu = styled.div`
float: right;
width: 28%;
color: black;
background-color: #F0F0F0;
height: calc(100vh - 66px);
`;
const ActionMenu = styled.div`
float: right;
width: 23%;
color: black;
background-color: #F0F0F0;
margin-top: 53.8%;
`;

class ABDetailedView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        general: true,
        // docs: false,
        // cas: false,
        logs: false       
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectToLogs) {
      this.setState({ general: false, logs: true });
    }
    else if (nextProps.studentDetailedInfoResult != this.props.studentDetailedInfoResult) {
      this.setState({ general: true, logs: false });
    }
}
  
  selectTab(item) {
    if (item == 1)
    {
      this.setState({ general: true });
      // this.setState({ docs: false });
      // this.setState({ cas: false });
      this.setState({ logs: false });
      this.props.hideLogsSection();
    }
    // else if (item == 2)
    // {
    //   this.setState({ general: false });
    //   this.setState({ docs: true });
    //   this.setState({ cas: false });
    //   this.setState({ logs: false });
    // }
    // else if (item == 3)
    // {
    //   this.setState({ general: false });
    //   this.setState({ docs: false });
    //   this.setState({ cas: true });
    //   this.setState({ logs: false });
    // }
    else if(item == 4)
    {
      this.setState({ general: false });
      // this.setState({ docs: false });
      // this.setState({ cas: false });
      this.setState({ logs: true });
      this.props.studentJiraDetails(this.props.selectedStudentData.selectedSalesBookingId, this.props.selectedDestinationCode);
    }
  }

  render() { 
    return (
      <div>        
        {
          this.props.showDetailedInfoTab && this.props.studentDetailedInfoResult && this.props.selectedStudentData && this.props.selectedStudentData.selectedSalesBookingId ?
          <RightMenu>
            <InfoCategory>
              <InfoType index={1} selected={this.state.general} onClick={this.selectTab.bind(this, 1)}>General</InfoType>
              {/* <InfoType selected={this.state.docs} onClick={this.selectTab.bind(this, 2)}>Documents</InfoType>
              <InfoType selected={this.state.cas} onClick={this.selectTab.bind(this, 3)}>CAS</InfoType> */}
              <InfoType index={2} selected={this.state.logs} onClick={this.selectTab.bind(this, 4)}>Logs</InfoType>
              <InfoType index={3} /><InfoType index={4} />
              <InfoType index={5}><Image src={require("../../images/AdminBoard/cancel.svg")} alt="cancel" onClick={() => this.props.onStudentViewClick('')} /> </InfoType>
            </InfoCategory>          
            { this.props.redirectToLogs == false && this.state.general && this.props.selectedStudentData.selectedBookingId == this.props.studentDetailedInfoResult.BookingId ? 
              <ABDetailedGeneralView selectedStatus={this.props.selectedStatus} onStudentViewClick={this.props.onStudentViewClick} selectedStudentData={this.props.selectedStudentData} studentDetailedInfoResult={this.props.studentDetailedInfoResult} getDetailedInfoForDate={this.props.getDetailedInfoForDate} />
              : null 
            }
            { this.props.redirectToLogs || this.state.logs ? 
              <ABLogDetail user={this.props.user}  selectedStudentData={this.props.selectedStudentData} selectedDestinationCode={this.props.selectedDestinationCode} studentJiraDetailsResult={this.props.studentJiraDetailsResult} openJiraLog={this.props.openJiraLog}/>
              : null 
            }         

            <ABGlobalAction typenewUnCon={this.props.typenewUnCon} typenewCon={this.props.typenewCon} typecax={this.props.typecax} typemodCon={this.props.typemodCon} typemodUnCon={this.props.typemodUnCon} bookingType={this.props.bookingType} filteredResults={this.props.filteredResults} onInProgressChange={this.props.onInProgressChange} addLogDropDowns={this.props.addLogDropDowns} confirmDropdown={this.props.confirmDropdown} setConfirmDropdownState={this.props.setConfirmDropdownState}
            onAssignedToChange={this.props.onAssignedToChange}  HasLoggedInUser={this.props.HasLoggedInUser}  closeLogPopup={this.props.closeLogPopup} addLogStatus={this.props.addLogStatus} selectedStudents={this.props.selectedStudents} saveLogDetails={this.props.saveLogDetails}  onConfirmBookingButtonClick={this.props.onConfirmBookingButtonClick} showInProgress={this.props.showInProgress} onAcknowledgeClick={this.props.onAcknowledgeClick} userSelected={this.props.userSelected}  selectedRecordsCount={this.props.selectedRecordsCount}  HasJiraAccess={this.props.user.HasJiraAccess}/>

          </RightMenu>
          : 
          <ActionMenu>
            <ABGlobalAction typenewUnCon={this.props.typenewUnCon} typenewCon={this.props.typenewCon} typecax={this.props.typecax} typemodCon={this.props.typemodCon} typemodUnCon={this.props.typemodUnCon} bookingType={this.props.bookingType} filteredResults={this.props.filteredResults} onInProgressChange={this.props.onInProgressChange} addLogDropDowns={this.props.addLogDropDowns} confirmDropdown={this.props.confirmDropdown} setConfirmDropdownState={this.props.setConfirmDropdownState}
            onAssignedToChange={this.props.onAssignedToChange}  HasLoggedInUser={this.props.HasLoggedInUser} closeLogPopup={this.props.closeLogPopup} addLogStatus={this.props.addLogStatus} selectedStudents={this.props.selectedStudents} saveLogDetails={this.props.saveLogDetails} onCommentChange={this.props.onCommentChange} onConfirmBookingButtonClick={this.props.onConfirmBookingButtonClick} showInProgress={this.props.showInProgress} onAcknowledgeClick={this.props.onAcknowledgeClick} userSelected={this.props.userSelected} selectedRecordsCount={this.props.selectedRecordsCount}  HasJiraAccess={this.props.user.HasJiraAccess}/>
          </ActionMenu>
        }
      </div>
    )
  }
}
ABDetailedView.propTypes = {
};

export default ABDetailedView;