import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import ABStudentInfo from './ABStudentInfo';
import styled from 'styled-components';
import Alert from 'react-s-alert';

const StudentGridColumn = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:0.5fr 15fr;  
-ms-grid-columns:0.5fr 15fr; 
`;
const StudentGridResult = styled.div`
overflow-y: auto;
height: calc(100vh - 120px);
width: 100%;
`;
const StudentList = styled.div`
padding: 1%;
width: 100%; 
height: calc(100vh - 75px);
overflow-y: hidden;
float: left;            
position: relative; 
z-index: 150;
border-right: 1px solid #F0F0F0;

-webkit-transition: all .8s ease;
-moz-transition: all .8s ease;
-ms-transition: all .8s ease;
-o-transition: all .8s ease;
transition: all .8s ease;

width: 72%;
${props => props.left && props.right == false ? 'width:60%;' : ''}
${props => props.left && props.right ? 'width:55%;' : ''}            
${props => props.left == false && props.right ? 'width:67%;' : ''} 
`;
const TeaserHeader = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:3fr 7fr 3fr 4fr 5fr 1.5fr;  
-ms-grid-columns:3fr 7fr 3fr 4fr 5fr 1.5fr;
-ms-grid-column: ${props=>props.index};
`;
const HeaderName = styled.div` 
display: -webkit-inline-box;
display: -ms-inline-flexbox;
cursor: pointer;
-ms-grid-column: ${props=>props.index};
`;
const Arrow = styled.div`
width: 6px;
height: 6px;
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
margin: 5% 0% 0% 10%;
${props => props.down.length>0? (props.down[0].order==='desc'?'border-left: none;border-top: none;border-right: 1px black solid;border-bottom: 1px black solid;' : 'border-right: none;border-bottom: none;border-left: 1px black solid;border-top: 1px black solid;'):''};
${props => props.name ? 'margin: 2% 0% 0% 6%;' : ''};
${props => props.code ? 'margin: 3% 0% 0% 8%;' : ''};
`;
const CheckBox = styled.div`
box-sizing: content-box;
width: 14px;
height: 14px;
${props => props.all ? "background-color: #11D245;" : "border: 1px solid #D8D8D8;"};
-ms-grid-column: ${props=>props.index};
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
const Panel = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:3fr 5fr 0.2fr;
-ms-grid-columns:3fr 5fr 0.2fr;
background-color: #DEF1E3;
font-size: 9px;
padding: 0.25%; 
margin-bottom: 0.85%;
`;
const Text = styled.div`
-ms-grid-column: ${props=>props.index};
${props => props.count ? "margin-left: 15%;" : "margin-left: 8%;"};
`;
const Image = styled.img`
width: 10px;
margin: 10% 0%;
`;


class ABStudentList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectAll: false,
            clearAll: true,
            filterCount: true
        };
        this.clearAllIndicator = this.clearAllIndicator.bind(this);
    }
    componentWillReceiveProps(nextprops) {
        if (nextprops.selectedStudents && nextprops.selectedStudents.length == 0 && this.state.clearAll == false)
        {
            this.setState({
                selectAll: false,
                clearAll: true,
                filterCount: true
            });
        }
    }

    toggleSelectAll() {
        if(this.state.selectAll) {
            this.state.selectAll = false;
            this.state.clearAll = true;
            this.props.onClearSelection();
        }
        else {
            this.state.selectAll = true;
            this.state.clearAll = false;
            this.props.onSelectAllRecords();
        }    
    }
    hideFilterCount() {
        this.setState({ filterCount: false });
    }
    clearAllIndicator(indicator) {
        if(this.state.clearAll) {
            this.setState({ clearAll: false });
        }
        else if (indicator == 1 && this.state.selectAll) {
            this.setState({ selectAll: false });
        }      
    }

    render() {
        return (
          <StudentList left={this.props.left} right={this.props.right}>
          <Alert stack={{ limit: 15, spacing: 10 }} timeout={8000} />
            {this.state.filterCount ?
              <Panel>
                <Text index={1}><b>Filters applied: {this.props.totalAppliedFilterCount>0?this.props.totalAppliedFilterCount:0}</b></Text>
                <Text index={2} count>{this.props.filteredResults.length} results found.</Text>
               </Panel>
          : null}
        <StudentGridColumn>
          <CheckBox index={1} all={this.state.selectAll} onClick={this.toggleSelectAll.bind(this)}>{(this.state.selectAll) ? <Tick /> : null}</CheckBox>
          <TeaserHeader index={2}>
            <HeaderName index={1} onClick={this.props.filterResult.bind(this, this.props.quickFilterType, 'SalesBookingId')}><span>Bkn</span><Arrow down={this.props.sortParameters.filter(m=>m.field==='SalesBookingId')} /></HeaderName>
            <HeaderName index={2} onClick={this.props.filterResult.bind(this, this.props.quickFilterType, 'StudentName')}><span>Name</span><Arrow down={this.props.sortParameters.filter(m=>m.field==='StudentName')}  name /></HeaderName>
            <HeaderName index={3} onClick={this.props.filterResult.bind(this, this.props.quickFilterType, 'StartWeekCode')}><span>Travel Date</span><Arrow down={this.props.sortParameters.filter(m=>m.field==='StartWeekCode')}  /></HeaderName>
            <HeaderName index={4} onClick={this.props.filterResult.bind(this, this.props.quickFilterType, 'Course')}><span>Course</span><Arrow down={this.props.sortParameters.filter(m=>m.field==='Course')}  code/></HeaderName>
            <HeaderName index={5} onClick={this.props.filterResult.bind(this, this.props.quickFilterType, 'ArticleCode')}><span>Accom.</span><Arrow down={this.props.sortParameters.filter(m=>m.field==='ArticleCode')}  code /></HeaderName>
          </TeaserHeader>
        </StudentGridColumn>
        <StudentGridResult>
          {
              this.props.filteredResults && this.props.filteredResults.map((student, index) => {
                  return (
                    <ABStudentInfo key={student.BookingId} Student={student} onStudentViewClick={this.props.onStudentViewClick} bookingType={this.props.bookingType} clearAllIndicator={this.clearAllIndicator} 
onSelectionChanged={this.props.onSelectionChanged} selectedStudents={this.props.selectedStudents} selectAll={this.state.selectAll} clearAll={this.state.clearAll} studentJiraDetails={this.props.studentJiraDetails}
selectedStudentData={this.props.selectedStudentData} goToLogsSection={this.props.goToLogsSection} hideLogsSection={this.props.hideLogsSection} selectedDestinationCode={this.props.selectedDestinationCode}/>
);
})
}
          <br />
        </StudentGridResult>
      </StudentList>
    );
}
}

ABStudentList.propTypes = {
};

export default ABStudentList;