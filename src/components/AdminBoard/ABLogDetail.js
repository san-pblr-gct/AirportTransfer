import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import styled from 'styled-components';
import * as types from './../../constants/actionTypes';
import Alert from 'react-s-alert';

const LogDetails = styled.div`  
background: #F0F0F0;
height: calc(100vh - 290px);
overflow-y: auto;
`;

const LogDetail = styled.div`  
  margin: 15px;  
  border-color: transparent;   
  background: #FFFFFF;
  border-radius: 2%;
  padding-bottom: 3%;  
`;

const LogDetailsField = styled.div`
-ms-grid-column: ${props=>props.index};
padding-right: 0.5%;
vertical-align: center;
text-align: -webkit-match-parent;
font-family: "Open Sans";
${props => props.Header ? 'display:grid; display:-ms-grid;grid-template-columns: 5fr 2fr;-ms-grid-columns: 5fr 2fr;font-weight: bold;font-size: 100%;margin-left: 1%;' : ''};
${props => props.type == "StatusDetail" ? "display:grid;display:-ms-grid;grid-template-columns: 5fr 7fr;-ms-grid-columns: 5fr 7fr;font-size: 90%;color:#B2B2B2;margin-left: 5%;" : ""};
${props => props.type == "LogDate" ? "float: left;margin-left:3%;" : ""};
${props => props.LogStatus ? "background: #F0F0F0;border: 2px;border-radius: 20%;text-align: center;margin: 10px;" : ""};
${props => props.Description ? "margin-left: 5%;padding-top: 3%;color:#B2B2B2" : ""};
${props => props.Outcome ? "padding-bottom: 1.5%;padding-top: 0.25%;margin-left: 5%;display:grid;display:-ms-grid;grid-template-columns: 5fr 8fr;-ms-grid-columns: 5fr 8fr;" : ""};
${props => props.OpenLog ? "color: green" : props => props.ClosedLog ? "color:red;" : props => props.InProgressLog ? "color:#EAD150" : ""};
`;

const LogEllipsis = styled.div`
color:#5C5C5C;
 margin-left: 5%;
 display: block;
 display: -webkit-box;
 max-width: 100%;
 font-size: 14px;
 line-height: 1.5; 
 ${props => props.LogOutComeEllipsis ? "webkit-line-clamp: 1;" : "-webkit-line-clamp: 5;"}; 
 -webkit-box-orient: vertical;
 overflow: hidden;
 word-wrap: break-word;
 &:hover {content: attr(data-text);
 overflow: visible;
 display: block;
 cursor: pointer; 
 transition: display 1s;}
`;
const LogEllipsisOutCome = styled.div`
color:#5C5C5C;
margin-left: 5%;
padding-top: 3%;
display: block;
display: -webkit-box;
max-width: 100%;
font-size: 14px;
line-height: 1.5; 
-webkit-line-clamp: 2; 
-webkit-box-orient: vertical;
overflow: hidden;
word-wrap: break-word;
&:hover {content: attr(data-text);
overflow: visible;
display: block;
cursor: pointer;
transition: display 1s;}
`;
const StyledLink = styled.a`
background: #FFFFFF;
color:#5C5C5C;
margin:5%;
-ms-grid-column: ${props=>props.index};
`;
const LogOutCome = styled.div`  
color:#B2B2B2;
`;
class ABLogDetail extends React.Component {
  constructor(props, context) {
    super(props, context);   
    this.OpenJira = this.OpenJira.bind(this);
  }
  
  OpenJira(student)
  {   
    if(this.props.user.HasJiraAccess)
    {
      let url = types.JIRALOG + "browse/" + student.JiraKey + "?os_username=" + this.props.user.Username.trim() + ".logs" + "&os_password=" + this.props.user.JiraPassword;
      window.open(url,"_blank");
    }
    else
    {
       Alert.error("<ul> User does not have access to open Log!" + '</ul>', {
        position: 'top',
        effect: 'bouncyflip',
        html: true,
        timeout: 5000
    });

    }
  }
  render() {
    return (
      <LogDetails>
        {this.props.studentJiraDetailsResult && this.props.studentJiraDetailsResult.length > 0 ?
          this.props.studentJiraDetailsResult && this.props.studentJiraDetailsResult.map((student, index) => {
            return (
              <LogDetail>
                <LogDetailsField Header>
                  <StyledLink index={1} target="_blank" onClick={() => this.OpenJira(student)}>{student.LogType + ': '} {student.Category}</StyledLink>
                  <LogDetailsField index={2} OpenLog={student.JiraStatus == 'Open' ? true : false} ClosedLog={student.JiraStatus == 'Closed' ? true : false} InProgressLog={student.JiraStatus == 'In Progress' ? true : false} LogStatus>{student.JiraStatus}</LogDetailsField></LogDetailsField>
                {student.JiraAssignTo != '' ?
                  <LogDetailsField  index={1} type="StatusDetail">Assignee:{student.JiraAssignTo} <LogDetailsField type="LogDate" index={2}>Date:{moment(student.JiraDateCreated).format("DD MMM YYYY")}</LogDetailsField> </LogDetailsField>
                  :
                  <LogDetailsField  index={2} type="StatusDetail">Date:{moment(student.JiraDateCreated).format("DD MMM YYYY")} </LogDetailsField>
                }
                <LogDetailsField Description>Description: </LogDetailsField>
                <LogEllipsis>{student.Description}</LogEllipsis>
                {student.JiraOutCome != '' ?
                  // <LogDetailsField Outcome>Outcome: <LogEllipsisOutCome>{student.JiraOutCome}</LogEllipsisOutCome></LogDetailsField>   
                  <LogEllipsisOutCome Outcome><LogOutCome>Outcome:</LogOutCome> {student.JiraOutCome}</LogEllipsisOutCome>
                  : null
                }
                {/* <LogEllipsis LogOutComeEllipsis>Outcome:{student.JiraOutCome}</LogEllipsis>    */}
                {/* <LogEllipsis LogOutComeEllipsis>{student.JiraOutCome}</LogEllipsis>            */}

              </LogDetail>
            );
          })
          : null
        }
      </LogDetails>
    )
  }
}
ABLogDetail.propTypes = {
};

export default ABLogDetail;