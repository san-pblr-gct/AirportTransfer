import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import mcImg from '../../images/AdminBoard/mc.svg';
import acImg from '../../images/AdminBoard/ac.svg';
import unConfirmedImg from '../../images/AdminBoard/unconfirmed.svg';
import unConfirmedIPImg from '../../images/AdminBoard/inprogress.svg';
import MCIPImg from '../../images/AdminBoard/MCinprogress.svg';
import ACIPImg from '../../images/AdminBoard/ACinprogress.svg';

const StudentBar = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:0.5fr 15fr;
-ms-grid-columns:0.5fr 15fr;
border-bottom:1px solid #ddd;
padding:7px 0;
background-color: ${props => props.selected ? "#E9F6EF" : "white"};
`;
const StudentInfoDetail = styled.div`
grid-column:2;
grid-row:1;
display:grid;
display:-ms-grid;
grid-template-columns:3fr 7fr 3fr 4fr 5fr 1.5fr;
-ms-grid-columns:3fr 7fr 3fr 4fr 5fr 1.5fr;
-ms-grid-column: ${props => props.index};
-ms-grid-row: ${props => props.rowIndex};
`;
const StudentIndicator = styled.div`
grid-row:2;
grid-column:2;
display:grid;
display:-ms-grid;
grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
-ms-grid-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
margin-top:4px;
-ms-grid-column: ${props => props.index};
-ms-grid-row: ${props => props.rowIndex};
`;
const Tag = styled.div`
background-color:${props => props.tag == "on" ? "white" : "#EAF6EF"};
border: 1px solid ${props => props.tag == "on" ? "#71D685" : "none"};
opacity:${props => props.tag == "on" ? "1" : "1"};
border-radius: 10px;
font-size:12px;
text-align: center;
margin-right:10px;
padding-top: 2px;
-ms-grid-column: ${props => props.index};
`;
const StudentInfoRules = styled.div`
position: absolute;
color: #000;
right: 15px;
margin-right: 65px;
margin-top: -20px;
background-color: white;
z-index: 199;
height: 50%;
overflow-y: auto;
width: 70%;
box-shadow: 2px 2px 10px 2px rgba(0,0,0,0.2);
font-family: 'Open Sans', sans-serif;
border-radius: 6px;
font-size: 14px;
 `;
const ConfirmedImage = styled.div`
background-image: url(${props => props.ConfirmedType ? (props.ConfirmedType == "AC" ? (props.InProgress ? ACIPImg : acImg) : (props.InProgress ? MCIPImg : mcImg)) : (props.InProgress ? unConfirmedIPImg : unConfirmedImg)});
background-repeat:no-repeat;
width:20px;
height:20px;
background-size:cover;
background-color:white;
border-radius: 20px;
-ms-grid-column: ${props => props.index};
`;
const Sup = styled.sup`
background-color:${props => props.color};   
border-radius:10px;
width:18px;
height:14px;
font-size:8px;
color:#fff;
padding: 2px 3px;
top:-10px;
margin-left:${props => props.color == "black" ? "0px" : "12px"};
`;
const Panel = styled.div`
${props => props.list ? "margin: 2.5%;-webkit-padding-start: 0px;" : "padding-bottom: 2%;"};
`;
const Record = styled.div`
${props => props.count ? "background-color:#EAD150;margin-bottom: 2%;width: fit-content;padding: 0.5%; float: left;" : ""};
${props => props.log ? "margin-bottom: 2%;padding: 0.5%;text-align: -webkit-right;" : ""};
${props => props.line ? "text-decoration: underline;" : ""};
cursor:pointer;`;
const HR = styled.hr`
padding: 1% 0%;
color: #DDDDDD;
`;
const List = styled.div`
padding: 1%;
`;
const Status = styled.div`
font-size: 10px;
margin-right: 3%;
float: left;
padding: 0.5% 1%;
text-align: center;
border-radius: 8px;
width: 8%;
${props => props.pass ? "background-color:#E7E7E7;" : "background-color:#EAD150;"};
`;
const Rule = styled.div`
${props => props.pass ? "text-decoration: line-through;" : ""};
`;
const Arrow = styled.div`
margin-top: 0.5%;
right: 70px;
position: absolute;
z-index: 99;
border-top: 5px solid transparent;
border-left: 12px solid #E6E6E6;
border-bottom: 5px solid transparent;
`;
const CheckBox = styled.div`
box-sizing: content-box;
width: 14px;
height: 14px;
${props => props.color ? "border: 1px solid #11D245;" : ""};
${props => props.selected ? "background-color: #11D245;" : ""};
-ms-grid-column: ${props => props.index};
`;
const Tick = styled.div`
display:inline-block;
width: 4px;
height: 9px;
border: solid white;
border-width: 0 2px 2px 0;
transform: rotate(45deg);
margin: 0% 0% 13% 35%;
`;
const Span = styled.span`
line-height: 1.6em;
-ms-grid-column: ${props => props.index};
`;

const StudentInfoSpan = styled.div`
-ms-grid-column: ${props => props.index};
`;

class ABStudentInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            AutoConfirmRulesIndicator: false,
            top: [{ top: "auto" }],
            IsSelected: false,
            highlight: false,
            arrowTop: [{ top: "" }],
            studentDetailedViewSelected: false,
            studentDetailedViewSelectedRecord: []
        };
        this.showStudentAutoConfirmationRules = this.showStudentAutoConfirmationRules.bind(this);
        this.hideStudentAutoConfirmationRules = this.hideStudentAutoConfirmationRules.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedStudentData.selectedSalesBookingId !== this.props.Student.SalesBookingId) {
            this.setState({ "IsSelected": false });
        }
        if (nextProps.selectedStudentData.selectedSalesBookingId === this.props.Student.SalesBookingId) {
            this.setState({ studentDetailedViewSelected: true, studentDetailedViewSelectedRecord: nextProps.Student });
        }
        else {
            this.setState({ "IsSelected": false, studentDetailedViewSelected: false, studentDetailedViewSelectedRecord: [] });
        }
        nextProps.selectedStudents && (nextProps.selectedStudents.length > 0) && nextProps.selectedStudents.map((student, index) => {
            if (student.SalesBookingId == this.props.Student.SalesBookingId) {
                this.setState({ "IsSelected": true });
            }
        })
        if (nextProps.selectAll) {
            this.setState({ "IsSelected": true });
        }
        else if (nextProps.clearAll && this.props.selectedStudents.length > 0) {
            this.setState({ "IsSelected": false });
            if (this.state.studentDetailedViewSelectedRecord.length > 0 && nextProps.selectedStudentData.selectedSalesBookingId != studentDetailedViewSelectedRecord.SalesBookingId) {
                this.setState({ studentDetailedViewSelected: false, studentDetailedViewSelectedRecord: [] });
            }
        }
    }

    showStudentAutoConfirmationRules(e) {
        let setTop = e.clientY < document.body.offsetHeight / 2 ? { top: 35 + 'px' } : { top: ((document.body.offsetHeight / 2) - 25) + 'px' };
        this.setState({ AutoConfirmRulesIndicator: true, top: setTop, arrowTop: { top: (e.clientY - 65) } });
    }
    hideStudentAutoConfirmationRules() {
        this.setState({ AutoConfirmRulesIndicator: false, highlight: false });
    }
    selectStudentMethod(indicator) {
        if (this.state.AutoConfirmRulesIndicator == false) {
            if (indicator == '1') {
                this.setState({ IsSelected: !this.state.IsSelected }, this.callParentMethod);
            }
            else if (indicator == '2') {
                this.props.hideLogsSection();
                this.props.onStudentViewClick(this.props.Student);
            }
        }
        else if (indicator == '3') {
            this.props.goToLogsSection();
            this.props.onStudentViewClick(this.props.Student);
            this.props.studentJiraDetails(this.props.Student.SalesBookingId, this.props.selectedDestinationCode);
        }
    }
    highlightStudentRecord() {
        this.setState({ "highlight": true });
    }
    callParentMethod() {
        if (this.state.IsSelected) {
            this.props.clearAllIndicator(0);
            this.props.onSelectionChanged(this.props.Student, 1);
        }
        else {
            this.props.clearAllIndicator(1);
            this.props.onSelectionChanged(this.props.Student, 0);
        }
        this.props.hideLogsSection();
    }

    render() {
        let courses = [];
        this.props.Student.StudentRulesDetails.forEach(function (item) {
            if (courses.length == 0) {
                courses.push({
                    'CourseBookingId': item.CourseBookingId,
                    'CourseTypeCode': item.CourseTypeCode,
                    'StartWeekCode': item.StartWeekCode,
                    'EndWeekCode': item.EndWeekCode,
                    'OpenLogs': item.OpenLogs,
                    'LastUpdated': item.LastUpdated,
                    'LastAutoConfirmed': item.LastAutoConfirmed,
                    'Rules': [
                        {
                            'Rule': item.Rule,
                            'status': item.status
                        }
                    ]
                })
            }
            else {
                let newCourse = [...courses.filter(course => course.CourseBookingId === item.CourseBookingId)];
                if (newCourse.length == 0) {
                    courses.push({
                        'CourseBookingId': item.CourseBookingId,
                        'CourseTypeCode': item.CourseTypeCode,
                        'StartWeekCode': item.StartWeekCode,
                        'EndWeekCode': item.EndWeekCode,
                        'OpenLogs': item.OpenLogs,
                        'LastUpdated': item.LastUpdated,
                        'LastAutoConfirmed': item.LastAutoConfirmed,
                        'Rules': [{
                            'Rule': item.Rule,
                            'status': item.status
                        }]
                    })
                }
                else {
                    newCourse[0].Rules.push({
                        'Rule': item.Rule,
                        'status': item.status
                    });
                }
            }
        })

        return (

            <StudentBar selected={(this.state.IsSelected || this.state.highlight || this.state.studentDetailedViewSelected)} onMouseLeave={() => this.hideStudentAutoConfirmationRules()} onMouseOver={this.highlightStudentRecord.bind(this)}>
                <CheckBox index={1} selected={(this.state.IsSelected)} color={this.state.highlight} onClick={this.selectStudentMethod.bind(this, 1)}>{(this.state.IsSelected) ? <Tick /> : null}</CheckBox>
                <StudentInfoDetail index={2} rowIndex={1} onClick={this.selectStudentMethod.bind(this, 2)}>

                    <StudentInfoSpan index={1}>{this.props.Student.SalesBookingId.trim()}</StudentInfoSpan>
                    <StudentInfoSpan index={2}>{this.props.Student.StudentName}, {this.props.Student.Gender} {this.props.Student.Age} {this.props.Student.Nationality.trim()}</StudentInfoSpan>
                    <StudentInfoSpan index={3}>{this.props.Student.StartWeekCode} - {this.props.Student.EndWeekCode}</StudentInfoSpan>
                    <StudentInfoSpan index={4}>{this.props.Student.ProgramCode.trim()}, {this.props.Student.Course.trim()}, {this.props.Student.CourseStatusCode.trim()} 
                        {this.props.Student.CourseCount == 0 ? null
                            : <Sup color="black">{"+" + this.props.Student.CourseCount} </Sup>}
                   
                    </StudentInfoSpan>
                    {this.props.Student.ArticleCode ?
                        <StudentInfoSpan index={5}>{this.props.Student.ArticleCode}, {this.props.Student.NoOfNights}
                            {this.props.Student.Prenights == 0 ? null
                                : "(" + this.props.Student.Prenights + ")"}
                            {this.props.Student.PostNights == 0 ? null
                                : "(" + this.props.Student.PostNights + ")"}
                            , {this.props.Student.AccommodationStatusCode}
                            {this.props.Student.AccommodationCount == 0 ? null
                                : <Sup color="black">{"+" + this.props.Student.AccommodationCount} </Sup>}
                        </StudentInfoSpan>
                        : <StudentInfoSpan />}

                    {this.props.bookingType != 'cax' ?

                        <ConfirmedImage index={6} InProgress={this.props.Student.IsInProgress} ConfirmedType={this.props.Student.ConfirmedType} onMouseEnter={this.showStudentAutoConfirmationRules} >
                            {this.state.AutoConfirmRulesIndicator && courses.length > 0 ? <Arrow style={this.state.arrowTop} /> : null}
                            {this.props.Student.NoofChanges > 0 ? <Sup color="red">{this.props.Student.NoofChanges}</Sup> : null}
                            {
                                this.state.AutoConfirmRulesIndicator && courses.length > 0 ?
                                    <StudentInfoRules onMouseLeave={() => this.hideStudentAutoConfirmationRules()} style={this.state.top}>
                                        {courses.map((studentRulesCourse, i) => {
                                            return (
                                                <Panel list>
                                                    <Panel>
                                                        {(this.props.Student.NoofChanges > 0 || studentRulesCourse.OpenLogs > 0) ?
                                                            <div>
                                                                <Record count={this.props.Student.NoofChanges > 0}>{this.props.Student.NoofChanges > 0 ? this.props.Student.NoofChanges + " modified" : null}</Record>
                                                                <div>{studentRulesCourse.OpenLogs > 0 ? <Record log line onClick={this.selectStudentMethod.bind(this, 3)}>{studentRulesCourse.OpenLogs} open logs</Record> : <Record log>&nbsp;</Record>}</div>
                                                            </div>
                                                            : null}
                                                        <Record>Last updated: {studentRulesCourse.LastUpdated != null ? moment(studentRulesCourse.LastUpdated).format("DD MMM YYYY") === "01 Jan 1800" ? '' : moment(studentRulesCourse.LastUpdated).format("DD MMM YYYY") : null}</Record>
                                                        <Record>Last/Auto confirmation date: {studentRulesCourse.LastAutoConfirmed != null ? moment(studentRulesCourse.LastAutoConfirmed).format("DD MMM YYYY") === "01 Jan 1800" ? '' : moment(studentRulesCourse.LastAutoConfirmed).format("DD MMM YYYY") : null}</Record>
                                                    </Panel>
                                                    <HR />
                                                    <b>The booking is not auto confirmed if </b><br /><br />
                                                    <div>Rules for Course: {studentRulesCourse.CourseTypeCode}
                                                        <span>({studentRulesCourse.StartWeekCode.trim()}-{studentRulesCourse.EndWeekCode.trim()})</span>
                                                    </div>
                                                    {
                                                        studentRulesCourse.Rules && studentRulesCourse.Rules.map((studentRules, index) => {

                                                            return (
                                                                <List>
                                                                    <Status pass={studentRules.status}>{studentRules.status ? 'False' : 'True'}</Status>
                                                                    <Rule pass={studentRules.status} key={i + index} dangerouslySetInnerHTML={{ __html: studentRules.Rule }}></Rule>
                                                                </List>
                                                            );
                                                        })
                                                    }
                                                </Panel>
                                            );
                                        })}
                                    </StudentInfoRules>
                                    : null
                            }
                        </ConfirmedImage>
                        : null
                    }
                </StudentInfoDetail>

                <StudentIndicator index={2} rowIndex={2} onClick={this.selectStudentMethod.bind(this, 2)}>
                    <Tag index={1} tag={this.props.Student.GroupCode ? "on" : "off"}>Group</Tag>
                    <Tag index={2} tag={this.props.Student.IsXtraNight ? "on" : "off"} > Ex.Night</Tag>
                    <Tag index={3} tag={this.props.Student.IsTransfer ? "on" : "off"} >Transfer</Tag>
                    <Tag index={4} tag={this.props.Student.IsMatchingnotes ? "on" : "off"} >Match</Tag>
                    <Tag index={5} tag={this.props.Student.ISVisaReq ? "on" : "off"} >{this.props.selectedDestinationCode.startsWith('US-')?"I-20":"Visa"}</Tag>
                    <Tag index={6} tag={this.props.Student.IsMeal ? "on" : "off"} >Meal</Tag>
                    <Tag index={7} tag={this.props.Student.IsActivity ? "on" : "off"} >Activity</Tag>
                    {this.props.bookingType == 'mod' || this.props.bookingType == 'cax' ?
                        <Tag index={8} tag={this.props.Student.IsClassAllocated ? "on" : "off"}>Class</Tag>
                        : null}
                    {this.props.bookingType == 'mod' || this.props.bookingType == 'cax' ?
                        <Tag index={9} tag={this.props.Student.IsAccommodationAllocated ? "on" : "off"}>Alloc</Tag>
                        : null}
                    {(this.props.bookingType == 'mod' || this.props.bookingType == 'cax') && this.props.Student.CASNumber && this.props.selectedDestinationCode.startsWith('GB-') ? <Tag index={10} tag={this.props.Student.CASNumber ? "on" : "off"} >CAS#</Tag> : null}
                    {(this.props.bookingType == 'mod' || this.props.bookingType == 'cax') && this.props.Student.SevisNumber && this.props.selectedDestinationCode.startsWith('US-') ? <Tag index={11} tag={this.props.Student.SevisNumber ? "on" : "off"} >Sevis#</Tag> : null}
                </StudentIndicator>

            </StudentBar >

        );
    }
}

ABStudentInfo.propTypes = {
};

export default ABStudentInfo;