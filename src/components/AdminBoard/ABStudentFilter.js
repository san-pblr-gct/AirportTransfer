import React, { PropTypes } from 'react';
import 'react-date-picker/index.css';
import styled from 'styled-components';
import SelectInput from '../common/SelectInput';
import TextInput from '../common/TextInput';
import ABGlobalAction from '../../components/AdminBoard/ABGlobalAction';
import { DateField, MultiMonthView, DatePicker } from 'react-date-picker';


const InfoCategory = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:2.5fr 3.5fr 2fr 2fr 2fr;
-ms-grid-columns:2.5fr 3.5fr 2fr 2fr 2fr;
`;
const InfoType = styled.div`
float: left;
font-weight: bold;
padding: 3%;
text-decoration: ${props => props.selected ? 'underline' : 'none'};
&:hover {cursor: pointer;text-decoration: underline;}  
`;
const RightMenu = styled.div`
float: right;
width: 23%;
color: black;
background-color: #F0F7F0;
height: calc(100vh - 66px);
text-align: left;
font-family: 'Open Sans', sans-serif;
`;
const DropDownDisplay = styled.div`
display: grid;
display:-ms-grid;
grid-template-columns: 1fr 0.1fr;
-ms-grid-columns: 1fr 0.1fr;
overflow: hidden;
height: 34px;
padding: 6px 12px;
font-size: 14px;
line-height: 1.42857143;
color: #555555;
background-image: none;
border: 1px solid #cccccc;
border-radius: 30px;
background: inherit;
`;
const DisplaySelected = styled.div`
overflow: hidden;
text-overflow: ellipsis;
word-break: break-all;
-ms-grid-column: ${props => props.index};


`;
const ArrowDown = styled.div`
border-top: 4px dashed;
border-right: 4px solid transparent;
border-left: 4px solid transparent;
margin-top: 50%;
width: 8px;
-ms-grid-column: ${props => props.index};
`;

const DropDownList = styled.ul`
display: ${props => props.display ? "block" : "none"};
width: 19%;
border: 1px solid rgba(0,0,0,.15);
border-radius: 10px;
list-style-type: none;
padding-left: 0;
position: absolute;
box-shadow: 0 6px 12px rgba(0,0,0,.175);
margin-left: 0.5%;
background: white;
cursor:pointer;
${props => props.type == "productLists" || props.type == "AccommodationList" || props.type == "StatusList" ? "z-index:300;" : ""};
${props => props.type == "programLists" ? "z-index:300;max-height: 500px;overflow-y: scroll;" : ""};
${props => props.type == "AccommodationList" ? "max-height: 260px;overflow-y: scroll;" : ""};
`;
const DropDownItem = styled.li`
border-bottom: 1px solid #ddd;
margin: 6px 10px;
text-align: left;
padding:6px 20px;`;
const FancyLabel = styled.label`
color: #999;
font-weight: normal;
padding-left: 6%;
`;
const GroupCode = styled.input`
outline: 0;
border-radius: 20px;
border: 1px solid #cccccc;
padding: 3% 6%;
color: #555555;
width: 100%;
background: #F0F7F0;
`;
const FilterCheckBox = styled.input.attrs({
  type: 'checkbox'
}) `
margin: 4px 0 0;
line-height: normal;
float: left;
zoom: 1.8;
margin-top: -1px !important;
margin-right: 5% !important;
`;
const Button = styled.div`
border-radius: 20px;
text-align: center;
cursor: pointer;
font-weight: normal;
-ms-grid-column: ${props => props.index};
&:hover{
  ${props => props.clear ? 'text-decoration:underline;' : ""}
}
${props => props.green ? 'padding: 3%;background-color: #11D245; color: #DAF8E2;':'padding: 1%;background-color: white; color: #4F4F4F;'}
${props => props.margin ? 'margin-right:7%':''}
`;
const Header = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:1fr 0.35fr;
-ms-grid-columns:1fr 0.35fr;
font-weight: bold;
`;
const Panel = styled.div`
overflow-y: auto;
height: calc(100vh - 200px);
margin-top:1.5%;
${props => props.calendar ? 'right: 10px;position: absolute;z-index: 160;' : ' margin: 6%;'}
`;
const DateBox = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:1.75fr 0.2fr;
-ms-grid-columns:1.75fr 0.2fr;
border-radius: 20px;
border: 1px solid #cccccc;
width: 100%;
background-color: inherit;
padding: 3% 6%;
height:34px;
`;
const DateValue = styled.div`
color: #555555;
-ms-grid-column: ${props => props.index};
`;
const Image = styled.img`
width: 20px;
padding-top: -2%;
-ms-grid-column: ${props => props.index};
`;

const Span = styled.span`
-ms-grid-column: ${props => props.index};
`

class ABStudentFilter extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      searchText: '',
      listVisible: false,
      selected: [],
      selectedAccommodationCode: [],
      statuslistVisible: false,
      selectedStatus: [],
      selectedStatusCode: [],
      checkedAll: false,
      checkAllStatus: false,
      checkedAllProduct: true,
      productlistvisible: false,
      selectedProduct: [],
      selectedProductCode: [],
      checkedAllProgram: true,
      programlistvisible: false,
      selectedProgram: [],
      selectedProgramCode: [],
      weekFromCalendar: false,
      weekToCalendar: false,
      filterPrograms: this.props.programs,
      checkedAllAccommodation: false,
      clearAllAC: false,
      top: [{ top: "auto" }],
      checkedIdsProduct: ["APP","CLT","LS","LSP","SCH"],
      checkedIdsProgram: ["AY","AYP","CC","CY","EFC","ILC","ILS","ILS25","ILSP","MLY","MLYP","PRW","UP","UPP"],
      checkedIdsAccommodation: [],
      checkedIdsStatus: []
    };
    this.onAccommodationDropDownChange = this.onAccommodationDropDownChange.bind(this);
    this.onAccommodationDropDownCheckBoxChecked = this.onAccommodationDropDownCheckBoxChecked.bind(this);
    this.onAccommodationDropDownCheckBoxCheckedAll = this.onAccommodationDropDownCheckBoxCheckedAll.bind(this);
    this.onStatusDropDownCheckBoxCheckedAll = this.onStatusDropDownCheckBoxCheckedAll.bind(this);
    this.onStatusDropDownChange = this.onStatusDropDownChange.bind(this);
    this.onStatusDropDownCheckBoxChecked = this.onStatusDropDownCheckBoxChecked.bind(this);
    this.handleWeekFromChange = this.handleWeekFromChange.bind(this);
    this.handleWeekToChange = this.handleWeekToChange.bind(this);
    this.clearbuttonclick = this.clearbuttonclick.bind(this);
    this.onProductDropDownChange = this.onProductDropDownChange.bind(this);
    this.onDropDownClickOut = this.onDropDownClickOut.bind(this);
    this.onProgramDropDownChange = this.onProgramDropDownChange.bind(this);
    this.onProductDropDownItemChange = this.onProductDropDownItemChange.bind(this);
    this.onDropDownItemChange = this.onDropDownItemChange.bind(this);
    this.onProductDropDownCheckBoxCheckedAll = this.onProductDropDownCheckBoxCheckedAll.bind(this);
    this.onProductDropDownCheckBoxChecked = this.onProductDropDownCheckBoxChecked.bind(this);
    this.onProgramDropDownCheckBoxCheckedAll = this.onProgramDropDownCheckBoxCheckedAll.bind(this);
    this.onProgramDropDownCheckBoxChecked = this.onProgramDropDownCheckBoxChecked.bind(this);
    this.filteredProgramBasedOnSelectedProductCode = this.filteredProgramBasedOnSelectedProductCode.bind(this);
    this.filterNonIAPrograms = this.filterNonIAPrograms.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.studentSearch.Destination != nextProps.studentSearch.Destination) {
      this.clearbuttonclick();
    }
    if (this.props.programs != nextProps.programs) {
      this.setState({ 'filterPrograms': nextProps.programs })
    }
    if (nextProps.selectedOfflineFilters.groupcodes != "") {
      this.props.onFilterValueChanged(true, 'group');
    }
    else {
      this.props.onFilterValueChanged(false, 'group');
    }
    if (nextProps.studentSearch.ProductCode != "APP,CLT,LS,LSP,SCH") {
      this.props.onFilterValueChanged(true, 'product')
    }
    else {
      this.props.onFilterValueChanged(false, 'product')
    }
    if (nextProps.studentSearch.ProgramCode != "AY,AYP,CC,CY,EFC,ILC,ILS,ILS25,ILSP,MLY,MLYP,PHS,PRW,UP,UPP") {
      this.props.onFilterValueChanged(true, 'program')
    }
    else {
      this.props.onFilterValueChanged(false, 'program')
    }
    if (nextProps.selectedOfflineFilters.selectedAccommodationtype.length > 0 && nextProps.selectedOfflineFilters.selectedAccommodationtype != "" && nextProps.selectedOfflineFilters.selectedAccommodationtype != "All") {
      this.props.onFilterValueChanged(true, 'Accommodation')
    }
    else {
      this.props.onFilterValueChanged(false, 'Accommodation')
    }
    if (nextProps.selectedOfflineFilters.selectedStatus.length > 0 && nextProps.selectedOfflineFilters.selectedStatus != "" && nextProps.selectedOfflineFilters.selectedStatus != "All") {
      this.props.onFilterValueChanged(true, 'Status')
    }
    else {
      this.props.onFilterValueChanged(false, 'Status')
    }
  }

  onProductDropDownChange() {
    this.setState({ "productlistvisible": !this.state.productlistvisible });
  }

  onDropDownClickOut() {
    if (this.state && this.state.productlistvisible)
      this.setState({ "productlistvisible": !this.state.productlistvisible });
    else if (this.state && this.state.programlistvisible)
      this.setState({ "programlistvisible": !this.state.programlistvisible });
    else if (this.state && this.state.weekFromCalendar)
      this.setState({ "weekFromCalendar": !this.state.weekFromCalendar });
    else if (this.state && this.state.weekToCalendar)
      this.setState({ "weekToCalendar": !this.state.weekToCalendar });
    else if (this.state && this.state.listVisible)
      this.setState({ "listVisible": !this.state.listVisible });
    else if (this.state && this.state.statuslistVisible)
      this.setState({ "statuslistVisible": !this.state.statuslistVisible });
  }


  onProductDropDownItemChange(Name, code) {
    this.setState({
      "productlistvisible": !this.state.productlistvisible,
      "selectedProduct": code
    });
    this.props.onProductChange(code);

  }
  onDropDownItemChange(Name, code) {
    this.setState({
      "programlistvisible": !this.state.programlistvisible,
      "selectedProgram": code
    });
    this.props.onProgramChange(code);
  }
  onProgramDropDownChange(){
    this.setState({"programlistvisible": !this.state.programlistvisible});
    this.filterNonIAPrograms(this.state.filterPrograms);
    
  }
  onAccommodationDropDownChange(e){
      let setTop = e.clientY >300 && e.clientY <400?{'margin-top':-395 + 'px'} : e.clientY < document.body.offsetHeight/2 ? { 'margin-top': 0 + 'px' } : { 'margin-top': (-(e.clientY - 145)) + 'px' };
      this.setState({"listVisible": !this.state.listVisible});
      this.setState({ 'top': setTop });

  }
  onAccommodationDropDownCheckBoxChecked(event) {
      if (event.target.checked) {
          this.setState({
              checkedIdsAccommodation:[...this.state.checkedIdsAccommodation, event.target.value],
              selected: this.state.selected.concat([event.target.name]),
              selectedAccommodationCode: this.state.selectedAccommodationCode.concat([event.target.value])
          }, () => this.props.onAccommodationFilterChange(this.state.selectedAccommodationCode)
          );
      } else {

          if(this.state.selected=="All"){
              var selectedNames =[];
              this.props.accommodationTypes.map((item,j)=>{
                  this.state.checkedIdsAccommodation.map((obj,i)=>{
                      if(item.Code == obj )
                          selectedNames.push(item.Name);
                  })
              });

              this.setState({
                  checkedAll: false,
                  checkedIdsAccommodation:this.state.checkedIdsAccommodation.filter(function (val) { return val !== event.target.value } ),
                  selected: selectedNames.filter(function (val) { return val !== event.target.name }),
                  selectedAccommodationCode:this.state.checkedIdsAccommodation.filter(function (val) { return val !== event.target.value } )
              }, () => this.props.onAccommodationFilterChange(this.state.selectedAccommodationCode));
              return;
          }
          this.setState({
              checkedIdsAccommodation:this.state.checkedIdsAccommodation.filter(function (val) { return val !== event.target.value }),
              selected: this.state.selected.filter(function (val) { return val !== event.target.name }),
              selectedAccommodationCode:  this.state.selectedAccommodationCode.filter(function (val) { return val !== event.target.value })
          }, () => this.props.onAccommodationFilterChange(this.state.selectedAccommodationCode));
      }
  }
  onAccommodationDropDownCheckBoxCheckedAll(event) {
      if (event.target.checked) {
          var AccommodationIds = [];
          this.props.accommodationTypes.map((Item, j) => {
              AccommodationIds.push(Item.Code);
          });
          this.setState({
              checkedAll: true,
              checkedIdsAccommodation:AccommodationIds,
              selected: event.target.name,
              selectedAccommodationCode: event.target.value
          }, () => this.props.onAccommodationFilterChange(this.state.selectedAccommodationCode));
      }
      else {
          this.setState({
              checkedAll: false,
              checkedIdsAccommodation:[],
              selected: [],
              selectedAccommodationCode: []
          }, () => this.props.onAccommodationFilterChange(""));
      }
  }
  onStatusDropDownChange(e){
      let setTop = e.clientY > 400 && e.clientY < 450  ?   { 'margin-top': (-(e.clientY - 145)) + 'px' }: { 'margin-top': 0 + 'px' };
      this.setState({"statuslistVisible": !this.state.statuslistVisible});
      this.setState({ 'top': setTop });

  }
  onStatusDropDownCheckBoxChecked(event){
      if (event.target.checked){
          //append to array
          this.setState({
              checkedIdsStatus:[...this.state.checkedIdsStatus, event.target.value],
              selectedStatus: this.state.selectedStatus.concat([event.target.name]),
              selectedStatusCode: this.state.selectedStatusCode.concat([event.target.value])
          }, () => this.props.onStatusFilterChange(this.state.selectedStatusCode)
          );
      } else {
          //remove from array
          if(this.state.selectedStatus=="All"){
              var selectedNames =[];
              this.props.statuses.map((item,j)=>{
                  this.state.checkedIdsStatus.map((obj,i)=>{
                      if(item.Code == obj )
                          selectedNames.push(item.Name);
                  })
              });
              this.setState({
                  checkAllStatus: false,
                  checkedIdsStatus:this.state.checkedIdsStatus.filter(function (val) { return val !== event.target.value }),
                  selectedStatus: selectedNames.filter(function (val) { return val !== event.target.name}),
                  selectedStatusCode:this.state.checkedIdsStatus.filter(function (val) { return val !== event.target.value })
              }, () => this.props.onStatusFilterChange(this.state.selectedStatusCode));
              return;
          }
          this.setState({
              checkedIdsStatus:this.state.checkedIdsStatus.filter(function (val) { return val !== event.target.value }),
              selectedStatus: this.state.selectedStatus.filter(function (val) { return val !== event.target.name }),
              selectedStatusCode: this.state.selectedStatusCode.filter(function (val) { return val !== event.target.value })
          }, () => this.props.onStatusFilterChange(this.state.selectedStatusCode));
      }
  }
  onStatusDropDownCheckBoxCheckedAll(event) {
    if (event.target.checked) {
      var StatusIds = [];
      this.props.statuses.map((Item, j) => {
        StatusIds.push(Item.Code);
      });
      this.setState({
        checkAllStatus: true,
        checkedIdsStatus:StatusIds,
        selectedStatus: event.target.name,
        selectedStatusCode: event.target.value
      }, () => this.props.onStatusFilterChange(this.state.selectedStatusCode));
    }
    else {
      this.setState({
        checkAllStatus: false,
        checkedIdsStatus:[],
        selectedStatus: [],
        selectedStatusCode: []
      }, () => this.props.onStatusFilterChange(""));
    }
  }
  clearbuttonclick() {
    this.setState({
      selected: [],
      selectedAccommodationCode: [],
      selectedStatus: [],
      selectedStatusCode: [],
      'filterPrograms': this.props.programs,
      selectedProduct: [],
      selectedProductCode: [],
      selectedProgram: [],
      selectedProgramCode: [],
      clearAllAC: true,
      checkedAllProduct: true,
      checkedAllProgram: true,
      checkedAll: false,
      checkAllStatus: false,
      checkedIdsProduct: ["APP","CLT","LS","LSP","SCH"],
      checkedIdsProgram: ["AY","AYP","CC","CY","EFC","ILC","ILC","ILS","ILS25","ILSP","ILSP","MLY","MLYP","PRW","UP","UPP"],
      checkedIdsAccommodation: [],
      checkedIdsStatus: []
    }, () => this.props.onClearAllbtnClick());

  }

  handleWeekFromChange(event) {
    if (event != "") {
      this.props.getWeekFromSelectedDate(event, "from");
    }
    this.setState({ weekFromCalendar: false });
  }
  handleWeekToChange(event) {
    if (event != "") {
      this.props.getWeekFromSelectedDate(event, "to");
    }
    this.setState({ weekToCalendar: false });
  }
  showWeekFromCalendar() {
    this.setState({ weekFromCalendar: true });
  }
  toggleWeekFromCalendar() {
    this.setState({ weekFromCalendar: !this.state.weekFromCalendar });
  }
  showWeekToCalendar() {
    this.setState({ weekToCalendar: true });
  }
  toggleWeekToCalendar() {
    this.setState({ weekToCalendar: !this.state.weekToCalendar });
  }

  onProductDropDownCheckBoxCheckedAll(event) {
   if (event.target.checked) {
      var ProductIds = [];
      this.props.products.map((Item, j) => {
        ProductIds.push(Item.Code.trim());
      });
      this.setState({
        checkedAllProduct: true,
        checkedIdsProduct: ProductIds,
        selectedProduct: event.target.name,
        selectedProductCode: event.target.value,
        filterPrograms: this.props.programs
      }, () => this.filteredProgramBasedOnSelectedProductCode(this.state.selectedProductCode));
    }
    else {
      this.setState({
        checkedAllProduct: false,
        checkedAllProgram: false,
        checkedIdsProduct:  [],
        selectedProduct: [],
        selectedProductCode: [],
        filterPrograms: this.props.programs,
        checkedIdsProgram:[]
      }, () => this.filteredProgramBasedOnSelectedProductCode(""));
    }
  }
  onProductDropDownCheckBoxChecked(event) {

    if (event.target.checked) {
      this.setState({
        checkedIdsProduct:[...this.state.checkedIdsProduct, event.target.value.trim()],
        selectedProduct: this.state.selectedProduct.concat([event.target.value.trim()]),
        selectedProductCode: this.state.selectedProductCode.concat([event.target.value.trim()])
      }, () => this.filteredProgramBasedOnSelectedProductCode(this.state.selectedProductCode, "ALL")
      );
    } else {
      if (this.state.checkedAllProduct) {
        this.setState({
          checkedAllProduct: false,
          checkedIdsProduct:this.state.checkedIdsProduct.filter(function (val) { return val !== event.target.value.trim() }),
          selectedProduct: this.state.checkedIdsProduct.filter(function (val) { return val !== event.target.value.trim() }),
          selectedProductCode:this.state.checkedIdsProduct.filter(function (val) { return val !== event.target.value.trim() })
        }, () => this.filteredProgramBasedOnSelectedProductCode(this.state.selectedProductCode));

        return;
      }

      this.setState({
        checkedIdsProduct:this.state.checkedIdsProduct.filter(function (val) { return val !== event.target.value.trim() }),
        selectedProduct: this.state.selectedProduct.filter(function (val) { return val !== event.target.value.trim() }),
        selectedProductCode: this.state.selectedProductCode.filter(function (val) { return val !== event.target.value.trim() })
      }, () => this.filteredProgramBasedOnSelectedProductCode(this.state.selectedProductCode));

    }
  }

  filterSelectedProgramsOnProduct() {
    this.setState({
      checkedAllProgram: false,
      checkedIdsProgram: this.state.checkedIdsProgram,
      selectedProgram: this.state.checkedIdsProgram,
      selectedProgramCode: this.state.checkedIdsProgram
    }, () => this.props.onProgramChange(this.state.selectedProgramCode));
  }

  filteredProgramBasedOnSelectedProductCode(selectedProductCode, updateProgram = "") {
    let program = [];
    let result = [];
     if (selectedProductCode.length > 0) {

      for (let i = 0; i < this.state.checkedIdsProduct.length; i++) {
        for (let p = 0; p < this.props.programs.length; p++) {
          if (this.state.checkedIdsProduct[i].trim().toUpperCase() == this.props.programs[p].ProductCode.trim().toUpperCase()) {
            program.push(this.props.programs[p]);
          }
        }
      }
     if(!updateProgram == "ALL")
     {
      for (let j = 0; j < program.length; j++) {
         this.state.checkedIdsProgram.map((i)=>{
          if(!(result.indexOf(program[j].Code.trim()) >-1) && i.trim() ===  program[j].Code.trim())
          result.push(i)
        })
      }
     }
     else{
      for (let j = 0; j < program.length; j++) {
          result.push(program[j].Code.trim())
      }
     }
     this.setState({
      'filterPrograms': program
    }, () =>
        this.setState({
          checkedIdsProgram: result.length === 0 ? this.state.checkedIdsProgram : result
        }, () => {
          this.props.onProductChange(selectedProductCode);
          this.filterSelectedProgramsOnProduct();
        }));
     }
    else {
      this.setState({
        'filterPrograms': this.props.programs,
      }, () => {this.props.onProductChange(selectedProductCode);
        });
    }
  }

  filterNonIAPrograms(AllPrograms){
    if(this.state.checkedIdsProduct.length > 0)
    {
      let program = [];
      for (let i = 0; i < this.state.checkedIdsProduct.length; i++) {
        for (let p = 0; p < AllPrograms.length; p++) {
          if (this.state.checkedIdsProduct[i].trim().toUpperCase() == AllPrograms[p].ProductCode.trim().toUpperCase()) {
            program.push(AllPrograms[p]);
          }
        }
      }
      this.setState({
        'filterPrograms': program
      });
     
    }
   
  }
  onProgramDropDownCheckBoxCheckedAll(event) {
    if (event.target.checked) {
      var ProgramIds = [];
      this.state.filterPrograms.map((Item, j) => {
        ProgramIds.push(Item.Code.trim());
      });

      this.setState({
        checkedAllProgram: true,
        checkedIdsProgram:ProgramIds,
        selectedProgram: event.target.name,
        selectedProgramCode: event.target.value
      }, () => this.props.onProgramChange(this.state.selectedProgramCode));
    }
    else {
      this.setState({
        checkedAllProgram: false,
        checkedIdsProgram:[],
        selectedProgram: [],
        selectedProgramCode: []
      }, () => this.props.onProgramChange(""));
    }
  }

  onProgramDropDownCheckBoxChecked(event) {
    if (event.target.checked) {
      //append to array
      this.setState({
        checkedIdsProgram:[...this.state.checkedIdsProgram, event.target.value.trim()],
        'selectedProgram': this.state.selectedProgram.concat([event.target.value.trim()]),
        'selectedProgramCode': this.state.selectedProgramCode.concat([event.target.value.trim()]),
      }, () => this.props.onProgramChange(this.state.selectedProgramCode)
      );
    } else {
      let result=[];
      this.state.checkedIdsProgram.map((item)=>{
        if(item != event.target.value.trim())
         result.push(item)
      })

      //remove from array
      if (this.state.checkedAllProgram) {
        this.setState({
          checkedAllProgram: false,
        });
      }
      this.setState({
        checkedIdsProgram: result,
        selectedProgram: result,
        selectedProgramCode: result,
      }, () => this.props.onProgramChange(this.state.selectedProgramCode));
    }
  }
  render() {
    return (
      <div>

        {
          this.props.showFilterTab ?
            <RightMenu>
              <Panel>
                <Header><Span index={1}>Filter by:</Span><Button index={2} clear onClick={this.clearbuttonclick}>Clear all</Button></Header>
                <br />
                <FancyLabel>Product</FancyLabel>
                <div>
                  <DropDownDisplay onClick={this.onProductDropDownChange}>
                    <DisplaySelected index={1}>{this.state.selectedProduct != '' ? this.state.selectedProduct.toString() : 'All'} </DisplaySelected>
                    <ArrowDown index={2} />
                  </DropDownDisplay>
                  <DropDownList type="productLists" display={this.state.productlistvisible} onMouseLeave={this.onDropDownClickOut}>
                    <DropDownItem key={"All"} value={"All"}><FilterCheckBox onClick={this.onProductDropDownCheckBoxCheckedAll} value={"All"} name={"All"} checked={this.state.checkedAllProduct ? "checked" : ""}/>All</DropDownItem>
                    {
                      this.props.products && this.props.products.map((option) => {
                        return<DropDownItem value={option.Code}><FilterCheckBox key={option.Code} onClick={this.onProductDropDownCheckBoxChecked}
                          value={option.Code} name={option.Name} checked={this.state.checkedIdsProduct && this.state.checkedIdsProduct.some(function(val) {
                        return val.trim() === option.Code.trim(); })} />{option.Code} </DropDownItem>;
                      })
                    }
                  </DropDownList>

                </div>
                <br />

                <FancyLabel>Program</FancyLabel>
                <div>
                  <DropDownDisplay onClick={this.onProgramDropDownChange} >
                    <DisplaySelected index={1}>{this.state.selectedProgram != '' ? this.state.selectedProgram.toString() : 'All'} </DisplaySelected>
                    <ArrowDown index={2} />
                  </DropDownDisplay>
                  <DropDownList type="programLists" display={this.state.programlistvisible} onMouseLeave={this.onDropDownClickOut}>
                    <DropDownItem key={"All"} value={"All"}><FilterCheckBox onClick={this.onProgramDropDownCheckBoxCheckedAll} value={"All"} name={"All"} checked={this.state.checkedAllProgram ? "checked" : ""} />All</DropDownItem>
                    {
                        this.state.filterPrograms && this.state.filterPrograms.map((option) => {
                        return <DropDownItem key={option.Code} value={option.Code}><FilterCheckBox onClick={this.onProgramDropDownCheckBoxChecked}
                          checked={this.state.checkedIdsProgram && this.state.checkedIdsProgram.includes(option.Code.trim())} value={option.Code} name={option.Name} />{option.Code}</DropDownItem>;
                      })
                    }
                  </DropDownList>
                </div>
                <br />
                <DateBox onMouseLeave={this.onDropDownClickOut} >
                  <DateValue index={1}>Start week from {this.props.studentSearch.WeekFrom}</DateValue>
                  <Image index={2} src={require("../../images/AdminBoard/calendar.svg")} onClick={this.toggleWeekFromCalendar.bind(this)} />
                  {this.state.weekFromCalendar ?
                    <Panel calendar><DatePicker footer={false} onChange={this.handleWeekFromChange} minDate={this.props.selectedBookingType == '1' ? new Date() : ""} /></Panel>
                    : null}
                </DateBox>
                <br />
                <DateBox onMouseLeave={this.onDropDownClickOut}>
                  <DateValue index={1}>End week to {this.props.studentSearch.WeekTo}</DateValue>
                  <Image index={2} src={require("../../images/AdminBoard/calendar.svg")} onClick={this.toggleWeekToCalendar.bind(this)} />
                  {this.state.weekToCalendar ?
                    <Panel calendar><DatePicker footer={false} onChange={this.handleWeekToChange} /></Panel>
                    : null}
                </DateBox>
                <br />

                <GroupCode placeholder="Group codes" value={this.props.selectedOfflineFilters.groupcodes} onChange={this.props.onGroupCodeChange} />
                <br /><br />

                <div>
                  <DropDownDisplay onClick={this.onAccommodationDropDownChange}>
                    <DisplaySelected index={1}>{this.state.selected != '' ? this.state.selected.toString() : 'Accommodation'} </DisplaySelected>
                    <ArrowDown index={2}/>
                  </DropDownDisplay>
                  <DropDownList type="AccommodationList" style={this.state.top} display={this.state.listVisible} onMouseLeave={this.onDropDownClickOut}>
                    <DropDownItem key={"All"} value={"All"}><FilterCheckBox onClick={this.onAccommodationDropDownCheckBoxCheckedAll} value={"All"} name={"All"} checked={this.state.checkedAll?"checked":""}/>All</DropDownItem>
                    {
                      this.props.accommodationTypes && this.props.accommodationTypes.map((option) => {
                        return <DropDownItem key={option.Code} value={option.Code}><FilterCheckBox onClick={this.onAccommodationDropDownCheckBoxChecked}
                          checked={this.state.checkedIdsAccommodation.includes(option.Code) ? "checked" : ""}  value={option.Code} name={option.Name} />{option.Name}</DropDownItem>;
                      })
                    }
                  </DropDownList>
                </div>
                <br />

                <div>
                  <DropDownDisplay onClick={this.onStatusDropDownChange}>
                    <DisplaySelected index={1}>{this.state.selectedStatus != '' ? this.state.selectedStatus.toString() : "Status"} </DisplaySelected>
                    <ArrowDown index={2}/>
                  </DropDownDisplay>
                  <DropDownList type="StatusList" style={this.state.top} display={this.state.statuslistVisible} onMouseLeave={this.onDropDownClickOut}>
                    <DropDownItem key={"All"} value={"All"}><FilterCheckBox onClick={this.onStatusDropDownCheckBoxCheckedAll} value={"All"} name={"All"} checked={this.state.checkAllStatus ? "checked" : ""}  />All</DropDownItem>
                    {
                      this.props.statuses && this.props.statuses.map((option) => {
                        return <DropDownItem key={option.Code} value={option.Code}><FilterCheckBox onClick={this.onStatusDropDownCheckBoxChecked}
                          checked={this.state.checkedIdsStatus.includes(option.Code) ? "checked" : ""}  value={option.Code} name={option.Name} />{option.Name}</DropDownItem>;
                      })
                    }
                  </DropDownList>
                </div>
                <br />
                <div><FilterCheckBox onClick={this.props.onExcludeInProgressChecked} value={this.props.excludeInProgress} />Exclude in-progress</div>
                <br />
                <Button green onClick={this.props.onSearchbtnClick}>Apply</Button>
              </Panel>

              <ABGlobalAction typenewUnCon={this.props.typenewUnCon} typenewCon={this.props.typenewCon} typecax={this.props.typecax} typemodCon={this.props.typemodCon} typemodUnCon={this.props.typemodUnCon} bookingType={this.props.bookingType} filteredResults={this.props.filteredResults} onInProgressChange={this.props.onInProgressChange} addLogDropDowns={this.props.addLogDropDowns}
                addLogStatus={this.props.addLogStatus} confirmDropdown={this.props.confirmDropdown} setConfirmDropdownState={this.props.setConfirmDropdownState} selectedRecordsCount={this.props.selectedRecordsCount} HasJiraAccess={this.props.HasJiraAccess}
                onAssignedToChange={this.props.onAssignedToChange} HasLoggedInUser={this.props.HasLoggedInUser} closeLogPopup={this.props.closeLogPopup} selectedStudents={this.props.selectedStudents} saveLogDetails={this.props.saveLogDetails} onConfirmBookingButtonClick={this.props.onConfirmBookingButtonClick} showInProgress={this.props.showInProgress} onAcknowledgeClick={this.props.onAcknowledgeClick} userSelected={this.props.userSelected} />

            </RightMenu>
            :
            null
        }
      </div>
    )
  }
}
ABStudentFilter.propTypes = {
};

function mapStateToProps(state) {

  return {
    filterPrograms: this.props.programs
  };
}

export default ABStudentFilter;