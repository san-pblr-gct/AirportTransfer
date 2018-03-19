import React, { PropTypes } from 'react';
import 'react-date-picker/index.css';
import styled from 'styled-components';
import ABAddlog from './ABAddLog';
import Alert from 'react-s-alert';

const Section = styled.div`
background-color: #F9F9F9;
color: #C3C3C3;
font-family: 'Open Sans', sans-serif;
padding-bottom: 1%;
border-top: 1px solid #E4E4E4;
position: absolute;
bottom: 0px;
width: inherit;
`;
const ButtonGrid = styled.div`
    display:grid;
    display:-ms-grid;
    grid-template-columns: ${props => props.hasJiraAccess ? '1fr 1fr' : '1fr 1.15fr'};
    -ms-grid-columns: ${props => props.hasJiraAccess ? '1fr 1fr' : '1fr 1.15fr'};
        padding:5%;

`;
const ActionGrid = styled.div`
display:grid;
display:-ms-grid;
grid-template-columns:3fr 4fr;
-ms-grid-columns:3fr 4fr;
    padding: 1% 5% 2% 5%;
`;
const Button = styled.div`
border-radius: 20px;
text-align: center;
justify-content:center;
margin-right:5%;
cursor: pointer;
-ms-grid-column: ${props => props.index};
${props => props.green ? 'background-color: #11D245; color: #DAF8E2;' : 'border: 1px solid #B4B4B4; color: #6B6B6B;'}
${props => props.paddingTop ?'padding-top:5px;':null}
`;
const Label = styled.div`
-ms-grid-column: ${props => props.index};
${props => props.support ? 'margin-top: 15%;': ''}
${props => props.green ? 'color: #3BDA66;font-size: 14px;margin: 2% 0% 0% 32%;': 'padding: 0% 0% 2% 5%;color: #9F9F9F;'}
`;
const PrintTemplate = styled.div`
color: #6B6B6B;
`;
const Export = styled.div`
color: #6B6B6B;
`;
const Support = styled.div`
 display: grid;
 display: -ms-grid;
    grid-template-columns: auto auto;
    -ms-grid-columns: auto 5% auto;
    grid-column-gap: 5%;
    justify-content: right;
    -ms-grid-column-align:end;

color: #6B6B6B;
cursor: pointer;
`;
const Image = styled.img`
-ms-grid-column: ${props => props.index};
${props => props.print ? 'padding: 0% 6% 0% 10%;float: left;height: 20px;' : ''}
${props => props.excel ? 'padding: 0% 6% 0% 10%;float: left;height: 20px;' : ''}
${props => props.support ? 'width: 32px;margin-right: 10px;' : ''}
${props => props.cancel ? '@supports (width: -webkit-fill-available){width: 15px;}padding-left: 5%;' : ''}
${props => props.help ? 'width: 18px;border-radius: 30px;margin-right: 6%;' : ''}
`;
const Frame = styled.div`
font-family: 'Open Sans',sans-serif;
background-color: black;
position: absolute;
z-index: 1000;
width: 130%;
bottom: 0px;
right: 0px;
padding: 5%;
opacity: 0.9;
`;
const Line = styled.div`
${props => props.header ? 'font-size:medium;': ''}
${props => props.category ? 'padding: 2% 0% 4% 0%;': ''}
padding: 1% 0% 1% 0%;
font-size: 14px;
display:grid;
display:-ms-grid;
grid-template-columns:1fr 1fr;  
-ms-grid-columns:1fr 1fr;   
${props => props.header ? 'grid-template-columns:10fr 0.5fr;-ms-grid-columns:10fr 0.5fr;': ''}
${props => props.category ? 'grid-template-columns:2fr 5fr;-ms-grid-columns:2fr 5fr;': ''}
`;
const HorizontalLine = styled.hr`
padding: 2% 0% 2% 0%;
`;
const Menu = styled.ul`
color: #6B6B6B;
background-color: #F9F9F9;   
list-style-type: none;
padding: 3% 4%;
text-align: center;
display: inline-block;
position: absolute;
z-index: 50;
bottom: 92px;
${props => props.hasJiraAccess ? 'right: 18px;' : 'right: 110px;'}
width: 60%;
border-radius: 20px;
line-height: 1.8em;
border: 1px solid #F0F0F0;
box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
`;
const List = styled.li`
cursor: pointer;
${props => props.border ? 'border-bottom: 1px solid #CCCCCC;padding: 4% 0%;' : 'padding: 3% 0%;'}
`;
const ArrowDown = styled.div`
border-left: 8px solid transparent;
border-right: 8px solid transparent;
border-top: 8px solid #E4E4E4;
bottom: -10px;
${props => props.hasJiraAccess ? 'right: 25px;' : 'right: 65px;'}
position: absolute;
`;
const Name = styled.div`
width: 100%;
&:hover {border-radius: 20px;background-color: #11D245; color: #DAF8E2;}
${props => props.accom ? '&:hover {padding: 0.5% 3% 0.5% 3%;}' : ''}
`;
const Text = styled.div`
${props => props.close ? 'font-size:16px;padding: 4%;font-family: cursive;' : 'padding: 5%;cursor: pointer;'}
`;
const SupportText = styled.div`
-ms-grid-column: ${props => props.index};
border-radius: 10px;
text-align: center;
color: black;
${props => props.missing ? 'margin-right: 10px;background-color: white;border: 2px solid #71D685;' : 'margin-right: 65%;background-color: #b5d5b5;border: 1px solid #b5d5b5;'}
`;

const EmptyDiv = styled.div`
-ms-grid-column: ${props => props.index};
`;

class ABGlobalAction extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSupport: false,
            confirmDropdown: false
        };
    }

    showSupportDetails () {
        this.setState({ showSupport: true });
    }
    hideSupportDetails () {
        this.setState({ showSupport: false });
    }
    showConfirmDropdown () {
        this.setState({ confirmDropdown: true, showInProgress: false });
        this.props.setConfirmDropdownState();
    }
    hideConfirmDropdown () {
        this.setState({ confirmDropdown: false });
    }
    toggleConfirmDropdown() {
        this.setState({ confirmDropdown: !this.state.confirmDropdown });
    }
    onInProgressClick() {
        if ($.trim(this.props.selectedStudents.length) == 0)
        {
            Alert.closeAll();  
            Alert.error('Please select a student before proceeding In Progress', { position: 'top', effect: 'bouncyflip', html: true,timeout:5000 });    
            return;
        }
        this.props.onInProgressChange();
    }

    render() {
        return (
            <Section onMouseLeave={this.hideConfirmDropdown.bind(this)}>
                {this.props.selectedRecordsCount > 0 ? <Label green>{this.props.selectedRecordsCount} records selected</Label> : null}
                <ButtonGrid hasJiraAccess={this.props.HasJiraAccess}>
                    {
                        this.props.HasJiraAccess ?
                            <Button index={1} paddingTop onMouseLeave={this.hideConfirmDropdown.bind(this)} onClick={this.onInProgressClick.bind(this)}>In progress</Button>
                            : null
                    }
                    {this.props.typenewUnCon == true || this.props.typemodUnCon == true ?
                        <Button index={2} green x={this.state.confirmDropdown && this.props.confirmDropdown} onMouseEnter={this.showConfirmDropdown.bind(this)} onClick={this.toggleConfirmDropdown.bind(this)}><Text close={this.state.confirmDropdown && this.props.confirmDropdown}>{this.state.confirmDropdown && this.props.confirmDropdown ? "X" : "Confirm"}</Text></Button>
                        :
                        this.props.typenewCon !== true ?
                            <Button index={2} green onClick={() => this.props.onAcknowledgeClick()}><Text>Acknowledge</Text></Button>
                            : null
                    }
                </ButtonGrid>
                {/*<Label>Offline actions</Label>
            <ActionGrid>
                <PrintTemplate><Image print src={require("../../images/AdminBoard/printer.png")} alt="printer" /> Print template</PrintTemplate>
                <Export><Image excel src={require("../../images/AdminBoard/excel.png")} alt="excel" /> Export</Export>
            </ActionGrid>*/}
                <Support onClick={this.showSupportDetails.bind(this)}><Label index={1} support>Support</Label><Image index={3} support src={require("../../images/AdminBoard/support.svg")} alt="info" /></Support>

                {this.state.showSupport ?
                    <Frame>
                        <Line header>
                            <EmptyDiv index={1}>Screen Help?</EmptyDiv>
                            <Image index={2} cancel src={require("../../images/AdminBoard/cancelwhite.svg")} alt="cancel" onClick={this.hideSupportDetails.bind(this)} />
                        </Line>
                        <Line category>
                            <SupportText index={1} missing>Added</SupportText>
                            <SupportText index={2} >Missing</SupportText>
                        </Line>
                        <HorizontalLine />
                        <Line >
                            <EmptyDiv index={1}><Image help src={require("../../images/AdminBoard/mc.svg")} alt="missing" />Manually confirmed</EmptyDiv>
                            <EmptyDiv index={2} ><Image help src={require("../../images/AdminBoard/MCinprogress.svg")} alt="missing" />MC In progress</EmptyDiv>
                        </Line>
                        <Line >
                            <EmptyDiv index={1} ><Image help src={require("../../images/AdminBoard/ac.svg")} alt="confirmed" />Auto-confirmed</EmptyDiv>
                            <EmptyDiv index={2}><Image help src={require("../../images/AdminBoard/ACinprogress.svg")} alt="confirmed" />AC In progress</EmptyDiv>
                        </Line>
                        <Line >
                            <EmptyDiv index={1}><Image help src={require("../../images/AdminBoard/unconfirmed.svg")} alt="notconfirm" />Not confirmed</EmptyDiv>
                            <EmptyDiv index={2}><Image help src={require("../../images/AdminBoard/inprogress.svg")} alt="activeinprogress" />Not confirmed In progress</EmptyDiv>
                        </Line>
                    </Frame>
                    : null
                }
                {this.state.confirmDropdown && this.props.confirmDropdown ?
                    <Menu onMouseLeave={this.hideConfirmDropdown.bind(this)} hasJiraAccess={this.props.HasJiraAccess}>
                        <List border onClick={this.props.onConfirmBookingButtonClick.bind(this, 3)}><Name accom>Accommodation</Name></List>
                        <List border onClick={this.props.onConfirmBookingButtonClick.bind(this, 2)}><Name>Courses</Name></List>
                        <List border onClick={this.props.onConfirmBookingButtonClick.bind(this, 4)}><Name>UP</Name></List>
                        <List onClick={this.props.onConfirmBookingButtonClick.bind(this, 1)}><Name>All</Name></List>
                        <ArrowDown hasJiraAccess={this.props.HasJiraAccess} />
                    </Menu>
                    : null
                }
                {this.props.showInProgress ?
                    <div>
                        {this.props.addLogDropDowns ?
                            <ABAddlog addLogDropDowns={this.props.addLogDropDowns}
                                showInProgress={this.props.showInProgress} closeLogPopup={this.props.closeLogPopup}
                                onAssignedToChange={this.props.onAssignedToChange}  HasLoggedInUser={this.props.HasLoggedInUser} addLogDialogClose={this.props.addLogDialogClose} saveLogDetails={this.props.saveLogDetails} />
                            : null
                        }
                    </div>
                    :
                    null}
            </Section>
        )
    }
    }

        ABGlobalAction.propTypes = {
        };

export default ABGlobalAction;