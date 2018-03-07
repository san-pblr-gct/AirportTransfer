import React, { PropTypes } from 'react';
import moment from 'moment';
import SelectInput from '../common/SelectInput';
import $ from 'jquery';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';
import 'react-date-picker/index.css';
import SkyLight from 'react-skylight';
import TextInput from '../common/TextInput';
import styled from 'styled-components';
import efLogoimg from '../../images/ef_logo.png';

class ABLeftMenu extends React.Component {
  constructor(props, context) {
    super(props, context);
  
    this.state = {
      listVisible:true,
      selected: ""
    }
     this.onDropDownItemChange = this.onDropDownItemChange.bind(this);

    this.onDropDownClickOut = this.onDropDownClickOut.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }


  
onDropDownClickOut(){
  if (this.state )
   this.setState({"listVisible": !this.state.listVisible});

}
  onDropDownItemChange(event){
    this.setState({ "listVisible" : !this.state.listVisible,
                    "selected": event}); 
  }

  toggleDropDown(){
    this.setState({
      "listVisible": !this.state.listVisible
    })
  }
 
  render() {


    const LeftMenu = styled.section`
    float: left;
    height: calc(100vh);    
    color: black;
    padding: 10px 5px;
    background-color: #F0F7F0;
    border-bottom: 1px solid #ccc;
    display: block !important;
    ${props => props.expand ? "width: 17%;" : "width: 5%;"};
    `;

    const LogoImg = styled.div`
    width:60px;
    background-image: url(${efLogoimg});
    padding-top:42px;
    `;

    const Title = styled.div`
    float: left;
    font-size: 20px;
    font-family: Open sans-serif;
    margin-left: 6px;
    margin-top: 7px;
    display: inline;
    padding-bottom:7%;
    padding-top:7%;
    `;


    const Collapsible = styled.div`
    top: 1%;
    position: absolute;
    margin-left:${props => props.expand ? "13%" : "0%"};
    cursor: pointer;`;


    const BookingTypeList = styled.ul`
    list-style-type: none;
    padding-left:3%;`;


    const BookingTypes =  styled.div`
    font-weight:${props => props.selected ? "bold" : "none"};
    color:#545c63;
    ${props => props.selected ? "text-decoration:underline" : ''};
    padding-bottom: 10%;
    font-size:15px;
    &:hover{
      text-decoration:underline;
      cursor: pointer;
    }
   
    `;

   const DropDownDisplay = styled.button`
   display: block;
   width: 90%;
   height: 34px;
   padding: 6px 12px;
   font-size: 14px;
   line-height: 1.42857143;
   color: #555;
   background-color: #F0F7F0;
   background-image: none;
   border: 1px solid #ccc;
   border-radius: 30px;
   &:focus{
    display: inline-block;
    box-shadow: 0 0 0 1px #349aef;
    outline: none;
   }`;

   const DropDown= styled.div`
   margin-top:30%;`;

   const ArrowDown = styled.span`
   display: inline-block;
   width: 0;
   height: 0;
   margin-left: 95px !important;
   vertical-align: middle;
   border-top: 4px dashed;
   border-top: 4px solid !important;
   border-right: 4px solid transparent;
   border-left: 4px solid transparent;
   top: 10%;
   margin-left: 50%;
   margin-top: -25%;`;

   const DropDownList = styled.ul`
   display: ${props => props.display ? "none" : "block"};
   background: #fff;
   margin-top: -1%;
   width: 14.5%;
   border: 1px solid rgba(0,0,0,.15);
   border-radius: 10px;
   list-style-type:none;
   padding-left:0;
   position:absolute;
   margin-left:-10px;
   box-shadow: 0 6px 12px rgba(0,0,0,.175);`;

   const DropDownItem = styled.button`
   border:none;
    background-color:white;
   margin: 0px;
   text-align: center;
   padding:6px 20px;
   cursor:pointer;`;

   const DropDownItemLi = styled.li`
   margin:0px;
   width:100%;
    ${props => props.border ? "border-bottom: 1px solid #ddd": ""};
   `;

   const DisplaySelected = styled.div`
   overflow: hidden;
   text-overflow: ellipsis;
   text-align:left;
  
   `;
    var bookingTypes = [{ Code: "1", Name: "Arriving" }, { Code: "2", Name: "In School" }];
    return (
  <LeftMenu expand={this.props.expandLeftMenu}>
        {this.props.expandLeftMenu ?
          <div className="contentBookingType">
            <LogoImg > </LogoImg>
            <Title>Admin Board</Title>
            
                <DropDownDisplay  onClick={this.toggleDropDown}> 
                    <DisplaySelected >{this.state.selected != '' ? this.state.selected : 'Arriving'} </DisplaySelected>
                    <ArrowDown/>    
                    <DropDownList display={this.state.listVisible} onMouseLeave={this.onDropDownClickOut}>
                  {bookingTypes && bookingTypes.map((option) => {

                    if(option.Code == "1")
    return <DropDownItemLi border><DropDownItem  key={option.Code} value={option.Code} onClick={()=>{console.log(option.Name);this.onDropDownItemChange(option.Name);this.props.onBookingTypeChange(option.Code);}}>{option.Name}</DropDownItem></DropDownItemLi>;
                    else
                     return <DropDownItemLi><DropDownItem key={option.Code} value={option.Code} onClick={()=>{console.log(option.Name);this.onDropDownItemChange(option.Name);this.props.onBookingTypeChange(option.Code);}}>{option.Name}</DropDownItem></DropDownItemLi>;
                  
                  }) }
                  </DropDownList>               
                  </DropDownDisplay>             
                
 

            <br />
            <BookingTypeList>
              {
                this.props.bookingTypeInd == '1' ? <div>
                  <li><BookingTypes selected={this.props.typenewUnCon} onClick={this.props.onBookingStatusChange}>New</BookingTypes></li>
                  <li><BookingTypes selected={this.props.typenewCon} onClick={this.props.onBookingStatusChange}>Recently confirmed</BookingTypes></li>
                  <li><BookingTypes selected={this.props.typecax} onClick={this.props.onBookingStatusChange}>CAX</BookingTypes></li>
                </div>
                  : null
              }
              <li><BookingTypes selected={this.props.typemodCon} onClick={this.props.onBookingStatusChange}>Modified confirmed</BookingTypes></li>
              <li><BookingTypes selected={this.props.typemodUnCon} onClick={this.props.onBookingStatusChange}>Modified unconfirmed</BookingTypes></li>
            </BookingTypeList>
           
          </div> : null
        }

        <Collapsible expand={this.props.expandLeftMenu} onClick={this.props.onExpandChange}>{this.props.expandLeftMenu?<img src={require("../../images/AdminBoard/expand.png")}/>:<img src={require("../../images/AdminBoard/collapse.png")}/>}
      </Collapsible>

      </LeftMenu>


    );
  }
}

ABLeftMenu.propTypes = {
};

export default ABLeftMenu;