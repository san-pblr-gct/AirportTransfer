import React, { PropTypes } from 'react';
import SkyLight from 'react-skylight';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import * as ABSearchActions from '../../actions/AdminBoard/ABSearchActions';
import styled from 'styled-components';

const HeaderGrid = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns: 5fr 5fr;
-ms-grid-columns:5fr 5fr;
padding: 1%;
border-bottom: 1px solid grey;
font-family: 'Open Sans', sans-serif;
`;
const StudentFilterGrid = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns: 0.075fr 0.165fr 0.13fr 0.085fr 0.18fr 0.08fr ;
-ms-grid-columns: 0.075fr 0.165fr 0.13fr 0.085fr 0.18fr 0.08fr ;
text-align: -webkit-right;
padding-top: 1%;
-ms-grid-column: ${props=>props.index};
`;
const StudentFilter = styled.div`
color: black;
font-weight: bold;
font-size: 15px;
${props => props.selected ? 'text-decoration: underline;' : ''}  
-ms-grid-column: ${props=>props.index};

&:hover {cursor: pointer;text-decoration: underline;}
`;
const SearchImage = styled.div`
grid-row: 1;
${props => props.box ? 
    'display:grid;display:-ms-grid;grid-template-columns: 1fr 7fr 1fr;-ms-grid-columns: 1fr 7fr 1fr;border: 1px solid #D8D8D8;border-radius: 25px;padding: 0% 2% 0% 2%;height: fit-content;' 
    : ''
}
-ms-grid-column: ${props=>props.index};
-ms-grid-row: 1;
`;
const SearchInput = styled.input`
border: none;
outline: 0;
width: 100%;
font-size: 15px;
-ms-grid-column: ${props=>props.index};
`;
const UserProfile = styled.div`
width: auto;
margin-top: 3px;
grid-row:1;

-ms-grid-row: 1;
-ms-grid-column: ${props=>props.index};
`;
const UserName = styled.label`
font-weight: bold;
font-size: 15px;
border: 1px solid #D8D8D8;
border-radius: 25px;
padding: 2px 5px 2px 5px;
&:hover {text-decoration: underline;}
`;
const Destination = styled.label`
font-weight: bold;
font-size: 12px;
border: 1px solid #D8D8D8;
border-radius: 25px;
padding: 3px 5px 3px 5px;
max-width:120px;
display: inline-block; 
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
&:hover {text-decoration: underline;}
`;
const Menu = styled.ul`
top: 58px;
${props => props.userProfile ? 'width: 15%;right: 140px;'  : 'width: 25%;right: 0px;'}
display: inline-block;
background-color: white;
box-shadow:  0px 2px 8px 0px rgba(0,0,0,0.2);
list-style-type: none;
padding: 1%;
position: absolute;
z-index: 500;
border-radius: 10px;
font-weight: bold;
overflow-y: auto;
overflow-x: hidden;
height: auto;
max-height: calc(100vh - 75px);
`;
const MenuName = styled.div`
border-bottom: 1px solid grey;
${props => props.destination ? 'padding-top: 5%;'  : ''}
`;
const List = styled.div`
display: -webkit-box;
cursor: pointer;
${props => props.padding ? '@supports (-ms-ime-align:auto){padding: 3% 0%;}; @supports (-moz-appearance:none){padding: 3% 0%;};' : '' }
`;
const Image = styled.img`
-ms-grid-column: ${props=>props.index};
${props => props.search ? 'width: 22px;height:100%;padding: 20% 20% 0% 15%;'  : ''}
${props => props.close ?  'width: 18px;padding: 25% 0% 0% 25%;'  : ''}
 ${props => props.logout ? 'width: 18px;margin-right:10px;'  : ''}
${props => props.default ? 'width: 32px; height:100%'  : ''}
`;
const Name = styled.div`
cursor: pointer;
font-weight: normal;
padding: 1% 1% 1% 3%;
margin: 1%;
width: 100%;
${props => props.selected ? 'border-radius: 20px;background-color: #11D245; color: #DAF8E2;' : ''}
${props => props.destination ? '&:hover {border-radius: 20px;background-color: #11D245; color: #DAF8E2;}' : ''}
`;
const ArrowUp = styled.div`
border-left: 9px solid transparent;
border-right: 9px solid transparent;
border-bottom: 9px solid #f3f3f3;
${props => props.userProfile ? 'right: 180px;'  : 'right: 45px;'}
position: absolute;
`;
const Setting = styled.div`
justify-content: right;
display: grid;
display:-ms-grid;
grid-template-columns: auto auto auto auto;
-ms-grid-columns: auto 20px auto 20px auto 20px auto;
-ms-grid-column: ${props=>props.index};
grid-column-gap: 4%;
-ms-grid-column-align:end;
`;
const Box = styled.div`
margin-top: 3px;
grid-row:1;
-ms-grid-column: ${props=>props.index};
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
margin-left:${props => props.color == "black" ? "0px" : "-6px"};
`;

class ABHeader extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        all: true,
        u18: false,
        ju: false,
        t4: false,
        i20:false,
        up: false,
        intern: false,
        searchBox: false,
        showUserDetails: false,
        searchText: '',
        clearSearch: false,
        showDestinations:false
      };
      
    this.logout = this.logout.bind(this);
    this.highlightFilterType= this.highlightFilterType.bind(this);
  }

  componentWillReceiveProps(nextprops) {
     if (nextprops.quickFilterType == '')
      {
        this.highlightFilterType('All');
        this.setState({
            searchText: ''
        })
      }  
      else{
        this.highlightFilterType(nextprops.quickFilterType);
      }   
  }

  highlightFilterType(type){
    switch (type) {   
        case "All": this.setState({ all: true,  u18: false, ju: false, t4: false, i20:false, up: false, intern: false });
            break;         
        case "U18": this.setState({ all: false,  u18: true, ju: false, t4: false, i20:false, up: false, intern: false });
            break;
        case "JU": this.setState({ all: false,  u18: false, ju: true, t4: false, i20:false, up: false, intern: false });
            break;
        case "T4":this.setState({ all: false,  u18: false, ju: false, t4: true, i20:false, up: false, intern: false });
            break;
        case "I20":this.setState({ all: false,  u18: false, ju: false, t4: false, i20:true, up: false, intern: false });
            break;
        case "UP":this.setState({ all: false,  u18: false, ju: false, t4: false, i20:false, up: true, intern: false });
            break;
        case "INT":this.setState({ all: false,  u18: false, ju: false, t4: false, i20:false, up: false, intern: true });
            break;
    }
  }
  selectFilter(type)
  {
    this.highlightFilterType(type);
    this.props.filterResult(type, 0);
  }
  toggleSearchBox() {
    this.setState({ searchBox: !this.state.searchBox });
  }
  showUserInfo() {
    this.setState({ showUserDetails: true });
    this.props.setUserProfileState();
  }
  hideUserInfo() {
    this.setState({ showUserDetails: false });
  }
  logout() {
    this.props.ABSearchActions.logout();
  }
  getSearchText(text) {
      if (text != undefined && text.target != undefined)
      {
          this.setState({ searchText: text.target.value, clearSearch: false});
          this.props.onQuickSearchInputChange(text.target.value);
      }
  }
  ClearSearchText() {
    this.setState({ searchText: '', clearSearch: true});
    this.props.onQuickSearchInputChange('');
    if(this.props.quickFilterType!='')
    {
        this.highlightFilterType(this.props.quickFilterType);
        this.props.filterResult(this.props.quickFilterType,3);
    }
    this.props.filterResult(this.props.quickFilterType,4);
    
  }
  selectDestination(code) {
    this.setState({ showUserDetails: false });
    this.props.onDestinationChange(code);
  }

  showDestinations(){
      this.setState({ showDestinations:true});
  }

  hideDestinations(){
    this.setState({ showDestinations:false});
  }

  render() {  

    let selectDestinationName ="";
    this.props.destinations && this.props.destinations.map((dest) => {
        if(this.props.selectedDestination == dest.Code)
         selectDestinationName = dest.Name
    });
            return (
                <HeaderGrid>
                    <StudentFilterGrid index={1}>
                        <StudentFilter index={1} selected={this.state.all} onClick={this.selectFilter.bind(this, 'All')}>All</StudentFilter>
                        <StudentFilter index={2} selected={this.state.u18} onClick={this.selectFilter.bind(this, 'U18')}>Under 18</StudentFilter>
                        <StudentFilter index={3} selected={this.state.ju} onClick={this.selectFilter.bind(this, 'JU')}>Junior</StudentFilter>
                        <StudentFilter index={4} selected={this.state.up} onClick={this.selectFilter.bind(this, 'UP')}>UP</StudentFilter>
                        <StudentFilter index={5} selected={this.state.intern} onClick={this.selectFilter.bind(this, 'INT')}>Internship</StudentFilter>                                                
                        {
                           this.props.selectedDestinationCode.startsWith('GB-') ? 
                           <StudentFilter index={6} selected={this.state.t4} onClick={this.selectFilter.bind(this, 'T4')}>T4</StudentFilter>
                           : this.props.selectedDestinationCode.startsWith('US-') ?
                            <StudentFilter index={6} selected={this.state.i20} onClick={this.selectFilter.bind(this, 'I20')}>I-20</StudentFilter>
                            :null
                        }
                        
                    </StudentFilterGrid>
                    
                    <Setting index={2}>
                        {this.state.searchBox ?
                            <Box index={1}>
                                <SearchImage box>
                                    {this.state.searchText == '' ? 
                                        <Image index={1} search src={require("../../images/AdminBoard/search_icon.svg")} onClick={this.toggleSearchBox.bind(this)} /> 
                                        : <Image index={1} search src={require("../../images/AdminBoard/white.png")} />
                                    }
                                    <SearchInput index={2} onChange={this.getSearchText.bind(this)} value={this.state.searchText?this.state.searchText:this.props.filteredsearchText} autoFocus />
                                    {this.state.searchText != '' || this.props.filteredsearchText !=''? 
                                        <Image index={0} close src={require("../../images/AdminBoard/cancel.svg")} onClick={this.ClearSearchText.bind(this)} /> 
                                        : <Image  index={0} close src={require("../../images/AdminBoard/white.png")}/> 
                                    }
                                </SearchImage>  
                            </Box>
                            :                            
                            <SearchImage index={1}>                                 
                                <Image default src={require("../../images/AdminBoard/search.svg")} onClick={this.toggleSearchBox.bind(this)} />
                            </SearchImage>    
                        }
                        <SearchImage index={3}>                            
                            <Image default src={require("../../images/AdminBoard/filter_default.svg")} onClick={this.props.toggleStudentFilterView}/>
                            {this.props.totalAppliedFilterCount > 0 ? <Sup color="red">{this.props.totalAppliedFilterCount}</Sup> : null}
                        </SearchImage>
                        <UserProfile index={5}>
                            <UserName onMouseEnter={this.showUserInfo.bind(this)} onClick={this.showUserInfo.bind(this)}>{this.props.user.Name}</UserName>
                            {this.state.showUserDetails && this.props.userProfile ? <ArrowUp userProfile/> : null}
                        </UserProfile>
                        <UserProfile >
                        <Destination onMouseEnter={this.showDestinations.bind(this)} onClick={this.showDestinations.bind(this)}>{selectDestinationName}</Destination>
                        {this.state.showDestinations ? <ArrowUp /> : null}
                         </UserProfile>
                    </Setting>

                   { this.state.showUserDetails && this.props.userProfile ? 
                        <Menu userProfile onMouseLeave={this.hideUserInfo.bind(this)}>
                            <MenuName>Profile</MenuName>
                            <List onClick={this.logout.bind(this)}>
                               
                                <Name logout> <Image logout src={require("../../images/AdminBoard/logout.svg")} />Logout</Name>                    
                            </List>
                           
                        </Menu>
                        : null
                    }     

                   {this.state.showDestinations ?
                        <Menu onMouseLeave={this.hideDestinations.bind(this)}>
                            <MenuName destination>Destination</MenuName>
                            { this.props.destinations && this.props.destinations.map((dest, index) => {
                                return (                                 
                                    <List padding key={dest.Code} onClick={this.selectDestination.bind(this, dest.Code)}>
                                        <Name destination selected={((this.props.selectedDestination == '' && index == 0) || (this.props.selectedDestination == dest.Code))? true: false}>{dest.Name}</Name>                                        
                                    </List>                                    
                                );
                            })}    
                            </Menu>
                            :null
                        }           
                </HeaderGrid>                
            );
        } 
}

ABHeader.propTypes = {    
};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ABSearchActions: bindActionCreators(ABSearchActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ABHeader);

