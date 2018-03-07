import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import styled from 'styled-components';

const Section = styled.div`
margin-left: 5%;
font-family: 'Open Sans', sans-serif;
color: #585858;
height: calc(100vh - 290px);
`;
const HistoryDateGrid = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns: 10fr 2fr;
-ms-grid-columns: 10fr 2fr;
margin-bottom: 3%;
@supports (-moz-appearance:none) { margin-bottom: 5%; }
`;
const DatesList = styled.div`
white-space: nowrap;
overflow: hidden;
-ms-grid-column: 1;
`;
const MenuName = styled.div`
border-bottom: 1px solid #E9E9E9;
margin-bottom: 2%;
font-weight: bold;
`;
const HistoryDate = styled.div`
font-size: small;
float: left;
padding: 0% 0.5% 0% 0.5%;
margin: 1%;
&:hover {cursor: pointer; background: #333333; color: #E4E4E4; border-radius: 20px;}

${props => props.selected ?
    'cursor: pointer; background: #333333; color: #E4E4E4; border-radius: 20px;'
    : ''}
`;
const HistoryDateClock = styled.div`
position: relative;
-ms-grid-column: 2;
`;
const Menu = styled.ul`
background-color: white;
list-style-type: none;
padding: 0% 0.5% 0% 0.5%;
text-align: center;
display: inline-block;
position: absolute;
z-index: 1000;
top: 160px;
right: 5px;
border-radius: 8px;
width: 11%;
line-height: 1.8em;
`;
const List = styled.li`
cursor: pointer;
`;
const UserSection = styled.div`
overflow-y: scroll;
${props => props.historyDate ?  'height: calc(100vh - 300px);' : 'height: calc(100vh - 250px);'}
`;
const SectionHeaderGrid = styled.div`
display:grid;
display:-ms-grid;
@supports (width: -webkit-fill-available) { grid-template-columns: 10.5fr 1.65fr;}
@supports (-ms-ime-align:auto) { grid-template-columns: 10.5fr 1.45fr;}
@supports (-moz-appearance:none) { grid-template-columns: 10.5fr 1.45fr;}
-ms-grid-columns:10.5fr 1.45fr;
font-weight: bold;
color: #333333;
`;

const SectionHeaderSpan = styled.span`
-ms-grid-column:1;
`;
const FieldDataGrid = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns: 4fr 6fr;
-ms-grid-columns: 4fr 6fr;
color: #8D8D8D;
-ms-grid-column:1;
`;
const FieldData = styled.div`
color: #3B3B3B;
-ms-grid-column:2;
${props => props.change ?
    'background-color:#f5f5b4; &:hover {cursor: pointer;}'
    : ''}  
${props => props.matching ?
    'overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical; &:hover {content: attr(data-text); overflow: visible; display: block; transition: display 1s;}'
    : ''}  
word-break:break-all;`;
const Image = styled.img`
width: 24px;
-ms-grid-column:2;
`;
const ImageTag = styled.img`
cursor: pointer;
width: 24px;
`;

class ABDetailedGeneralView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDates: false,
      latestDate: '',
      selectedDate: '',
      showFields: true,
      showSelectedDate: true,
      selectedDateIndex: 0,
      limitDateIndex: 3,
      generalSection: true,
      courseSection: true,
      accomSection: true,
      articleSection: true,
      matchSection: true,
      MatchingNotesChange: false,
      MatchingNotesChangeDate: ''
    };
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.selectedStudentData.selectedSalesBookingId != this.props.selectedStudentData.selectedSalesBookingId)
      {
        this.state.showDates = false,
        this.state.latestDate = "",
        this.state.selectedDate = "",
        this.state.showFields = true,
        this.state.showSelectedDate = true,
        this.state.selectedDateIndex = 0,
        this.state.limitDateIndex = 3,
        this.state.generalSection = true,
        this.state.courseSection = true,
        this.state.accomSection = true,
        this.state.articleSection = true,
        this.state.matchSection = true,
        this.state.MatchingNotesChange = false,
        this.state.MatchingNotesChangeDate = null
      }
    if(nextprops.studentDetailedInfoResult && nextprops.studentDetailedInfoResult.MatchingNotes && nextprops.studentDetailedInfoResult.MatchingNotes.length > 0 && nextprops.studentDetailedInfoResult.MatchingNotes[0].LastChangedDate != null) {
      let defaultDate = moment("2010-01-01").format("DD MMM YYYY");
      let currentDate = moment(nextprops.studentDetailedInfoResult.MatchingNotes[0].LastChangedDate).format("DD MMM YYYY");
      if(currentDate != null && currentDate != "" && new Date(currentDate) > new Date(defaultDate)) {
        this.state.MatchingNotesChange = true,
        this.state.MatchingNotesChangeDate = currentDate
      }
      else {
        this.state.MatchingNotesChange = false,
        this.state.MatchingNotesChangeDate = ''
      }
    }
    else {
      this.state.MatchingNotesChange = false
    }
  }

  showHistoryList() {
    this.setState({ showDates: true });
  }
  hideHistoryList() {
    this.setState({ showDates: false });
  }

  toggleGeneralSection() {
    this.setState({ generalSection: !this.state.generalSection });
  }
  toggleCourseSection() {
    this.setState({ courseSection: !this.state.courseSection });
  }
  toggleAccomSection() {
    this.setState({ accomSection: !this.state.accomSection });
  }
  toggleArticleSection() {
    this.setState({ articleSection: !this.state.articleSection });
  }
  toggleMatchSection() {
    this.setState({ matchSection: !this.state.matchSection });
  }

  openHistory(changeDate) {
    var defaultDate = moment("01-01-2010").format("DD MMM YYYY");
    if(changeDate != null && changeDate != "" && new Date(changeDate) > new Date(defaultDate)) {
      this.state.selectedDate = changeDate;
      this.state.showDates = false;
      if (this.state.latestDate == '' || this.state.latestDate == changeDate) {
        this.state.showFields = true;
        this.state.selectedDateIndex = 0;
      }
      else {        
        this.state.showFields = false;
        this.state.selectedDateIndex = 100;
      }
      this.props.getDetailedInfoForDate(changeDate);
    }    
  }

  render() {
    let isUP = this.props.selectedStudentData.selectedProgramcode.includes("UP");

    let ExtraNights = this.props.selectedStudentData.extraNight;
    let DaysBefore = this.props.selectedStudentData.daysBefore;
    let DaysAfter = this.props.selectedStudentData.daysAfter;

    let TransportArticle = this.props.studentDetailedInfoResult.TransportArticles;
    let InsuranceArticle = this.props.studentDetailedInfoResult.InsuranceArticle;
    let MealArticle = this.props.studentDetailedInfoResult.MealArticle;
    let ActivityArticle = this.props.studentDetailedInfoResult.ActivityArticle;
    let VisaArticle = this.props.studentDetailedInfoResult.VisaArticle;
    let OtherArticle = this.props.studentDetailedInfoResult.OtherArticle;

    let TransportArticleName = this.props.studentDetailedInfoResult.TransportArticlesName;
    let InsuranceArticleName = this.props.studentDetailedInfoResult.InsuranceArticleName;
    let MealArticleName = this.props.studentDetailedInfoResult.MealArticleName;
    let ActivityArticleName = this.props.studentDetailedInfoResult.ActivityArticleName;
    let VisaArticleName = this.props.studentDetailedInfoResult.VisaArticleName;
    let OtherArticleName = this.props.studentDetailedInfoResult.OtherArticleName;

    let BookingStatusTrack = null;
    let GroupCodeTrack = null;
    let ProductCodeTrack = null;
    let ProgramCodeTrack = null;
    let AgeTrack = null;
    let GenderTrack = null;
    let NationalityCodeTrack = null;
    let TransferArticleTrack = null;
    let InsuranceArticleTrack = null;
    let MealsArticleTrack = null;
    let ActivityArticleTrack = null;
    let VisaArticleTrack = null;
    let OtherArticleTrack = null;
    let NeedVisaTrack = null;
    let VisaStatusTrack = null;

    let defaultDate = moment("2010-01-01").format("DD MMM YYYY") 

    if (this.props.studentDetailedInfoResult.HistoryTracking != null) {
      this.props.studentDetailedInfoResult.HistoryTracking.BookingStatusTrack && this.props.studentDetailedInfoResult.HistoryTracking.BookingStatusTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.BookingStatusTrack.ModifiedDate > defaultDate ?
        BookingStatusTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.BookingStatusTrack.ModifiedDate).format("DD MMM YYYY")      
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.GroupCodeTrack && this.props.studentDetailedInfoResult.HistoryTracking.GroupCodeTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.GroupCodeTrack.ModifiedDate > defaultDate ?
        GroupCodeTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.GroupCodeTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.ProductCodeTrack && this.props.studentDetailedInfoResult.HistoryTracking.ProductCodeTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.ProductCodeTrack.ModifiedDate > defaultDate ?
        ProductCodeTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.ProductCodeTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.ProgramCodeTrack && this.props.studentDetailedInfoResult.HistoryTracking.ProgramCodeTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.ProgramCodeTrack.ModifiedDate > defaultDate ?
        ProgramCodeTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.ProgramCodeTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.AgeTrack && this.props.studentDetailedInfoResult.HistoryTracking.AgeTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.AgeTrack.ModifiedDate > defaultDate ?
        AgeTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.AgeTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.GenderTrack && this.props.studentDetailedInfoResult.HistoryTracking.GenderTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.GenderTrack.ModifiedDate > defaultDate ?
        GenderTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.GenderTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.NationalityCodeTrack && this.props.studentDetailedInfoResult.HistoryTracking.NationalityCodeTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.NationalityCodeTrack.ModifiedDate > defaultDate ?
        NationalityCodeTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.NationalityCodeTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.TransferArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.TransferArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.TransferArticleTrack.ModifiedDate > defaultDate ?
        TransferArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.TransferArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.InsuranceArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.InsuranceArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.InsuranceArticleTrack.ModifiedDate > defaultDate ?
       InsuranceArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.InsuranceArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.MealsArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.MealsArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.MealsArticleTrack.ModifiedDate > defaultDate ?
        MealsArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.MealsArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.ActivityArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.ActivityArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.ActivityArticleTrack.ModifiedDate > defaultDate ?
        ActivityArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.ActivityArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.VisaArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.VisaArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.VisaArticleTrack.ModifiedDate > defaultDate ?
        VisaArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.VisaArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.OtherArticleTrack && this.props.studentDetailedInfoResult.HistoryTracking.OtherArticleTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.OtherArticleTrack.ModifiedDate > defaultDate ?
        OtherArticleTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.OtherArticleTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.NeedVisaTrack && this.props.studentDetailedInfoResult.HistoryTracking.NeedVisaTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.NeedVisaTrack.ModifiedDate > defaultDate ?
        NeedVisaTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.NeedVisaTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
      this.props.studentDetailedInfoResult.HistoryTracking.VisaStatusTrack && this.props.studentDetailedInfoResult.HistoryTracking.VisaStatusTrack.ModifiedDate && this.props.studentDetailedInfoResult.HistoryTracking.VisaStatusTrack.ModifiedDate > defaultDate ?
        VisaStatusTrack = moment(this.props.studentDetailedInfoResult.HistoryTracking.VisaStatusTrack.ModifiedDate).format("DD MMM YYYY")
        : ""
    }
   return (
      <Section>
        {
          <div>
            {this.props.studentDetailedInfoResult.ChangeHistory && this.props.studentDetailedInfoResult.ChangeHistory.length > 0 ?
              <HistoryDateGrid>
                <DatesList>
                  {this.props.studentDetailedInfoResult.ChangeHistory.map((historyDate, index) => {
                    let date = moment(historyDate.InsertedDate).format("DD MMM YYYY");
                    if (this.state.latestDate == '' || (this.state.latestDate == date && this.state.selectedDateIndex == 0)) {
                      this.state.latestDate = date;
                      this.state.selectedDate = date;
                      this.state.showSelectedDate = true;
                      this.state.selectedDateIndex = 0;
                      this.state.limitDateIndex = 3;
                    }
                    else if (this.props.studentDetailedInfoResult.ChangeHistory.length > 3 && this.state.selectedDate == date) {                      
                      this.state.selectedDateIndex = index;
                      this.state.limitDateIndex = index + 3;
                      this.state.showSelectedDate = true;
                    }
                    else if (this.props.studentDetailedInfoResult.ChangeHistory.length < 4)
                    {
                      this.state.showSelectedDate = true;
                    }
                    return (
                      (this.state.showSelectedDate && ((index >= this.state.selectedDateIndex || this.state.selectedDateIndex == 100) && index < this.state.limitDateIndex)) ?
                        <HistoryDate selected={(date == this.state.selectedDate) ? true : false} onClick={this.openHistory.bind(this, date)}>{date}</HistoryDate>
                        : null
                    );
                  })}
                  {this.state.showSelectedDate = false}
                </DatesList>
                <HistoryDateClock>
                  {this.props.studentDetailedInfoResult.ChangeHistory.length > 3 || 1 == 1 ?
                    <ImageTag src={require("../../images/AdminBoard/clock.svg")} alt="clock" onMouseEnter={this.showHistoryList.bind(this)} />
                    : null
                  }
                  &nbsp;<br />
                </HistoryDateClock>
              </HistoryDateGrid>
              : null
            }

            <UserSection historyDate={this.props.studentDetailedInfoResult.ChangeHistory && this.props.studentDetailedInfoResult.ChangeHistory.length > 0}>
            <div id="generalInfo">
              <SectionHeaderGrid><SectionHeaderSpan>General Info</SectionHeaderSpan>{this.state.generalSection ? <Image src={require("../../images/AdminBoard/collapse.svg")} alt="diminish" onClick={this.toggleGeneralSection.bind(this)} /> : <Image src={require("../../images/AdminBoard/maximize.svg")} alt="maximize" onClick={this.toggleGeneralSection.bind(this)} />}</SectionHeaderGrid>
              {this.state.generalSection ?
                <div>                  
                  <FieldDataGrid>Name <FieldData>{this.props.selectedStudentData.selectedName}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Booking <FieldData>{this.props.selectedStudentData.selectedSalesBookingId}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Booking Status <FieldData change={BookingStatusTrack} onClick={this.openHistory.bind(this, BookingStatusTrack)}>{this.props.studentDetailedInfoResult.BookingStatus}</FieldData></FieldDataGrid>
                  {this.state.showFields ? <FieldDataGrid>Date Of Birth <FieldData>{moment(this.props.studentDetailedInfoResult.DOB).format("DD MMM YYYY")}</FieldData></FieldDataGrid> : null}
                  <FieldDataGrid>Age <FieldData change={AgeTrack} onClick={this.openHistory.bind(this, AgeTrack)}>{this.props.studentDetailedInfoResult.Age != null && this.props.studentDetailedInfoResult.Age > 0 ? this.props.studentDetailedInfoResult.Age : this.props.selectedStudentData.selectedAge}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Gender <FieldData change={GenderTrack} onClick={this.openHistory.bind(this, GenderTrack)}>{this.props.studentDetailedInfoResult.Gender != null && this.props.studentDetailedInfoResult.Gender != "" ? this.props.studentDetailedInfoResult.Gender : this.props.selectedStudentData.selectedGender}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Nationality <FieldData change={NationalityCodeTrack} onClick={this.openHistory.bind(this, NationalityCodeTrack)}>{this.props.studentDetailedInfoResult.Nationality != null && this.props.studentDetailedInfoResult.Nationality != "" ? this.props.studentDetailedInfoResult.Nationality : this.props.studentDetailedInfoResult.Nationality}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Group <FieldData change={GroupCodeTrack} onClick={this.openHistory.bind(this, GroupCodeTrack)}>{this.props.studentDetailedInfoResult.GroupCode}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Product <FieldData change={ProductCodeTrack} onClick={this.openHistory.bind(this, ProductCodeTrack)}>{this.props.selectedStudentData.selectedProductcode}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Program <FieldData change={ProgramCodeTrack} onClick={this.openHistory.bind(this, ProgramCodeTrack)}>{this.props.selectedStudentData.selectedProgramcode}</FieldData></FieldDataGrid>
                  {this.state.showFields ? <FieldDataGrid>Exam <FieldData>{this.props.studentDetailedInfoResult.Exam}</FieldData></FieldDataGrid> : null}
                  {this.state.showFields ? <FieldDataGrid>Mentor <FieldData>{this.props.studentDetailedInfoResult.Mentor}</FieldData></FieldDataGrid> : null}
                  {this.state.showFields ? <FieldDataGrid>School Contact <FieldData>{this.props.studentDetailedInfoResult.SchoolContact}</FieldData></FieldDataGrid> : null}
                  {this.state.showFields ? <FieldDataGrid>Is Ambassador <FieldData>{this.props.studentDetailedInfoResult.IsAmbassador ? "Yes" : "No"}</FieldData></FieldDataGrid> : null}
                  <FieldDataGrid>Needs Visa <FieldData change={NeedVisaTrack} onClick={this.openHistory.bind(this, NeedVisaTrack)}>{this.props.studentDetailedInfoResult.NeedsVisa ? "Yes" : "No"}</FieldData></FieldDataGrid>
                  <FieldDataGrid>Visa Status <FieldData change={VisaStatusTrack} onClick={this.openHistory.bind(this, VisaStatusTrack)}>{this.props.studentDetailedInfoResult.VisaStatus}</FieldData></FieldDataGrid>
                  {this.state.showFields && this.props.selectedStatus == 'cax' ? <FieldDataGrid>CAX Reason <FieldData>{this.props.studentDetailedInfoResult.CAXReason}</FieldData></FieldDataGrid> : null}
                </div>
                : null}
              <br />
            </div>
            <div id="course">
              <SectionHeaderGrid><SectionHeaderSpan>Courses</SectionHeaderSpan>{this.state.courseSection ? <Image src={require("../../images/AdminBoard/collapse.svg")} alt="diminish" onClick={this.toggleCourseSection.bind(this)} /> : <Image src={require("../../images/AdminBoard/maximize.svg")} alt="maximize" onClick={this.toggleCourseSection.bind(this)} />}</SectionHeaderGrid>
              {this.state.courseSection ?
                <div>
                  {this.props.studentDetailedInfoResult.Courses && this.props.studentDetailedInfoResult.Courses.map((studentCourses, index) => {
                    let courseCodeTrack = null;
                    let CourseStatusTrack = null;
                    let CourseStartWeekTrack = null;
                    let CourseEndWeekTrack = null;
                    let CourseWeeksTrack = null;
                    let CourseStatus = '';

                    studentCourses.CourseCodeTrack && studentCourses.CourseCodeTrack.ModifiedDate ?
                      courseCodeTrack = moment(studentCourses.CourseCodeTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentCourses.CourseStatusTrack && studentCourses.CourseStatusTrack.ModifiedDate ?
                      CourseStatusTrack = moment(studentCourses.CourseStatusTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentCourses.CourseStartWeekTrack && studentCourses.CourseStartWeekTrack.ModifiedDate ?
                      CourseStartWeekTrack = moment(studentCourses.CourseStartWeekTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentCourses.CourseEndWeekTrack && studentCourses.CourseEndWeekTrack.ModifiedDate ?
                      CourseEndWeekTrack = moment(studentCourses.CourseEndWeekTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentCourses.CourseWeeksTrack && studentCourses.CourseWeeksTrack.ModifiedDate ?
                      CourseWeeksTrack = moment(studentCourses.CourseWeeksTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""

                    if(studentCourses.CourseStatus != null && studentCourses.CourseStatus != "")
                    {
                      if ((studentCourses.CourseStatus).includes('AC'))
                      {
                        CourseStatus = 'Active';
                      }
                      else if ((studentCourses.CourseStatus).includes('CF'))
                      {
                        CourseStatus = 'Confirmed';
                      }
                      else if ((studentCourses.CourseStatus).includes('CA'))
                      {
                        CourseStatus = 'Cancelled';
                      }
                    }                    

                    return (
                      <div>
                        <FieldDataGrid>Course {index + 1}<FieldData change={courseCodeTrack} onClick={this.openHistory.bind(this, courseCodeTrack)}>{studentCourses.CourseCode}</FieldData></FieldDataGrid>
                        <FieldDataGrid>Course Status<FieldData change={CourseStatusTrack} onClick={this.openHistory.bind(this, CourseStatusTrack)}>{CourseStatus}</FieldData></FieldDataGrid>
                        <FieldDataGrid>Start Week<FieldData change={CourseStartWeekTrack} onClick={this.openHistory.bind(this, CourseStartWeekTrack)}>{studentCourses.WeekFrom}</FieldData></FieldDataGrid>
                        <FieldDataGrid>End Week<FieldData change={CourseEndWeekTrack} onClick={this.openHistory.bind(this, CourseEndWeekTrack)}>{studentCourses.WeekTo}</FieldData></FieldDataGrid>
                        <FieldDataGrid>No. Weeks<FieldData change={CourseWeeksTrack} onClick={this.openHistory.bind(this, CourseWeeksTrack)}>{studentCourses.NoOfWeeks > 0 ? studentCourses.NoOfWeeks : ''}</FieldData></FieldDataGrid>
                      </div>
                    );
                  })}
                  {this.state.showFields ?
                    <div>
                      <FieldDataGrid>Is ExPax: <FieldData>{this.props.studentDetailedInfoResult.IsExpax ? "Yes" : "No"}</FieldData></FieldDataGrid>
                      <FieldDataGrid>Transfer From <FieldData>{this.props.studentDetailedInfoResult.TransferredFrom}</FieldData></FieldDataGrid>
                      <FieldDataGrid>Class <FieldData>{this.props.studentDetailedInfoResult.Class}</FieldData></FieldDataGrid>
                      {isUP ? <FieldDataGrid>Confirmed UP <FieldData>{this.props.studentDetailedInfoResult.IsUP ? "Yes" : "No"}</FieldData></FieldDataGrid> : ""}
                    </div>
                    : null}
                </div>
                : null}
              <br />
            </div>
            <div id="acommodation">
              <SectionHeaderGrid><SectionHeaderSpan>Accommodation</SectionHeaderSpan>{this.state.accomSection ? <Image src={require("../../images/AdminBoard/collapse.svg")} alt="diminish" onClick={this.toggleAccomSection.bind(this)} /> : <Image src={require("../../images/AdminBoard/maximize.svg")} alt="maximize" onClick={this.toggleAccomSection.bind(this)} />}</SectionHeaderGrid>
              {this.state.accomSection ?
                <div>
                  {this.props.studentDetailedInfoResult.Accommodation && this.props.studentDetailedInfoResult.Accommodation.map((studentAccom, index) => {
                    let AccCodeTrack = null;
                    let AccStatusTrack = null;
                    let AccStartWeekTrack = null;
                    let AccEndWeekTrack = null;
                    let AccWeeksTrack = null;
                    let AccStatus = '';
                    let AccWeeks = '';

                    studentAccom.AccCodeTrack && studentAccom.AccCodeTrack.ModifiedDate ?
                      AccCodeTrack = moment(studentAccom.AccCodeTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentAccom.AccStatusTrack && studentAccom.AccStatusTrack.ModifiedDate ?
                      AccStatusTrack = moment(studentAccom.AccStatusTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentAccom.AccStartWeekTrack && studentAccom.AccStartWeekTrack.ModifiedDate ?
                      AccStartWeekTrack = moment(studentAccom.AccStartWeekTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentAccom.AccEndWeekTrack && studentAccom.AccEndWeekTrack.ModifiedDate ?
                      AccEndWeekTrack = moment(studentAccom.AccEndWeekTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""
                    studentAccom.AccWeeksTrack && studentAccom.AccWeeksTrack.ModifiedDate ?
                      AccWeeksTrack = moment(studentAccom.AccWeeksTrack.ModifiedDate).format("DD MMM YYYY")
                      : ""

                    AccWeeks = studentAccom.NoOfWeeks;

                    if(studentAccom.StatusCode != null && studentAccom.StatusCode != "")
                    {
                      if ((studentAccom.StatusCode).includes('AC'))
                      {
                        AccStatus = 'Active';
                      }
                      else if ((studentAccom.StatusCode).includes('CF'))
                      {
                        AccStatus = 'Confirmed';
                      }
                      else if ((studentAccom.StatusCode).includes('CA'))
                      {
                        AccStatus = 'Cancelled';
                      }
                    }

                    return (
                      <div>
                        <FieldDataGrid>Accommodation {index + 1}<FieldData change={AccCodeTrack} onClick={this.openHistory.bind(this, AccCodeTrack)}>{studentAccom.ArticleCode}</FieldData></FieldDataGrid>
                        <FieldDataGrid>Status<FieldData change={AccStatusTrack} onClick={this.openHistory.bind(this, AccStatusTrack)}>{AccStatus}</FieldData></FieldDataGrid>
                        <FieldDataGrid>Start Date<FieldData change={AccStartWeekTrack} onClick={this.openHistory.bind(this, AccStartWeekTrack)}>{studentAccom.StartDate != null ? moment(studentAccom.StartDate).format("DD MMM YYYY") : ''}</FieldData></FieldDataGrid>
                        <FieldDataGrid>End Date<FieldData change={AccEndWeekTrack} onClick={this.openHistory.bind(this, AccEndWeekTrack)}>{studentAccom.EndDate != null ? moment(studentAccom.EndDate).format("DD MMM YYYY") : ''}</FieldData></FieldDataGrid>
                        <FieldDataGrid>No. Nights<FieldData change={AccWeeksTrack} onClick={this.openHistory.bind(this, AccWeeksTrack)}>{studentAccom.NoOfNights != null && studentAccom.NoOfNights != '' ? studentAccom.NoOfNights : ''}</FieldData></FieldDataGrid>
                        {this.state.showFields ? <FieldDataGrid>No. Of Weeks <FieldData>{AccWeeks}</FieldData></FieldDataGrid> : "" }
                      </div>
                    );
                  })}
                  {this.state.showFields ?
                    <div>
                      <FieldDataGrid>Has Extra Nights <FieldData>{(ExtraNights == null || ExtraNights == false) ? "No" : "Yes"}</FieldData></FieldDataGrid>                      
                      <FieldDataGrid>Days Before/After <FieldData>{(DaysBefore == null) ? "0" : DaysBefore}/{(DaysAfter == null) ? "0" : DaysAfter}</FieldData></FieldDataGrid>
                      <FieldDataGrid>Latest Allocation Status <FieldData>{this.props.studentDetailedInfoResult.AccommodationStatus}</FieldData></FieldDataGrid>
                      <FieldDataGrid>Allocation Supplier <FieldData>{this.props.studentDetailedInfoResult.AccommodationSupplier}</FieldData></FieldDataGrid>
                    </div>
                    : null}
                </div>
                : null}
              <br />
            </div>
            <div id="articles">
              <SectionHeaderGrid><SectionHeaderSpan>Articles</SectionHeaderSpan>{this.state.articleSection ? <Image src={require("../../images/AdminBoard/collapse.svg")} alt="diminish" onClick={this.toggleArticleSection.bind(this)} /> : <Image src={require("../../images/AdminBoard/maximize.svg")} alt="maximize" onClick={this.toggleArticleSection.bind(this)} />}</SectionHeaderGrid>
              {this.state.articleSection ?
                <div>
                  <FieldDataGrid>Transport 
                    <FieldData change={TransferArticleTrack} onClick={this.openHistory.bind(this, TransferArticleTrack)}>
                      {(TransportArticle == null || TransportArticle == '') ? "No" : <span data-tooltip={TransportArticleName} data-tooltip-position="bottom">{TransportArticle}</span>}                      
                    </FieldData>
                  </FieldDataGrid>
                  <FieldDataGrid>Insurance 
                    <FieldData change={InsuranceArticleTrack} onClick={this.openHistory.bind(this, InsuranceArticleTrack)}>
                      {(InsuranceArticle == null || InsuranceArticle == '') ? "No" : <span data-tooltip={InsuranceArticleName} data-tooltip-position="bottom">{InsuranceArticle}</span>}                    
                    </FieldData>
                  </FieldDataGrid>
                  <FieldDataGrid>Meals 
                    <FieldData change={MealsArticleTrack} onClick={this.openHistory.bind(this, MealsArticleTrack)}>
                      {(MealArticle == null || MealArticle == '') ? "No" : <span data-tooltip={MealArticleName} data-tooltip-position="bottom">{MealArticle}</span>}
                    </FieldData>
                  </FieldDataGrid>
                  <FieldDataGrid>Activity 
                    <FieldData change={ActivityArticleTrack} onClick={this.openHistory.bind(this, ActivityArticleTrack)}>
                      {(ActivityArticle == null || ActivityArticle == '') ? "No" : <span data-tooltip={ActivityArticleName} data-tooltip-position="bottom">{ActivityArticle}</span>}
                    </FieldData>
                  </FieldDataGrid>
                  <FieldDataGrid>VISA 
                    <FieldData change={VisaArticleTrack} onClick={this.openHistory.bind(this, VisaArticleTrack)}>
                      {(VisaArticle == null || VisaArticle == '') ? "No" : <span data-tooltip={VisaArticleName} data-tooltip-position="bottom">{VisaArticle}</span>}
                    </FieldData>
                  </FieldDataGrid>
                  <FieldDataGrid>Other Articles 
                    <FieldData change={OtherArticleTrack} onClick={this.openHistory.bind(this, OtherArticleTrack)}>
                      {(OtherArticle == null || OtherArticle == '') ? "No" : <span data-tooltip={OtherArticleName} data-tooltip-position="bottom">{OtherArticle}</span>}
                    </FieldData>
                  </FieldDataGrid>
                </div>
                : null}
              <br />
            </div>
            <div id="matchingNotes">
              <SectionHeaderGrid><SectionHeaderSpan><FieldData change={this.state.MatchingNotesChange} onClick={this.openHistory.bind(this, this.state.MatchingNotesChangeDate)}>Matching Notes</FieldData></SectionHeaderSpan>{this.state.matchSection ? <Image src={require("../../images/AdminBoard/collapse.svg")} alt="diminish" onClick={this.toggleMatchSection.bind(this)} /> : <Image src={require("../../images/AdminBoard/maximize.svg")} alt="maximize" onClick={this.toggleMatchSection.bind(this)} />}</SectionHeaderGrid>
              {this.state.matchSection ?
                <div>
                  {this.props.studentDetailedInfoResult.MatchingNotes && this.props.studentDetailedInfoResult.MatchingNotes.map((studentMatchNotes, index) => {
                    return (
                      <FieldDataGrid>{studentMatchNotes.MatchingCategory} <FieldData matching>{studentMatchNotes.Name}</FieldData></FieldDataGrid>
                    );
                  })}
                </div>
                  : null}
                <br />
                <br />
                <br />
            </div>
            </UserSection>
          </div>
        }
        {
          this.state.showDates ?
            <Menu onMouseLeave={this.hideHistoryList.bind(this)}> 
              <MenuName>History</MenuName>
              {this.props.studentDetailedInfoResult.ChangeHistory && this.props.studentDetailedInfoResult.ChangeHistory.map((historyDates, index) => {
                let date = moment(historyDates.InsertedDate).format("DD MMM YYYY");
                return (
                  <List onClick={this.openHistory.bind(this, date)}>{date}</List>
                );
              })}
            </Menu>
            : null
        }
      </Section>
    )
  }
}
ABDetailedGeneralView.propTypes = {
};

export default ABDetailedGeneralView;