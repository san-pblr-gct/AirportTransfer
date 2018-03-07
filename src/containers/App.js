import React, { PropTypes } from 'react';
import './../styles/styles.css'; //Webpack can import CSS files too!
import HeaderContainer from './HeaderContainer';
import AllocationContainer from './AllocationContainer';
import KPIContainer from './KPIContainer';
import SearchContainer from './SearchContainer';
import LoginContainer from './LoginContainer';
import FlightSearchContainer from './FlightSearchContainer';
import ABSearchContainer from './AdminBoard/ABSearchContainer';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import 'babel-polyfill';
import Modernizr from 'browsernizr';
import Alert from 'react-s-alert';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
import ItemTypes from '../constants/itemTypes';
import moment from 'moment';



class App extends React.Component {
    constructor(props) {
        super(props);      
    }
    componentWillMount() {
        if (sessionStorage.getItem("user") === null) {
            browserHistory.push('/login');
        }
    }

    generatePreview(type, item, style) {
        Object.assign(style, { backgroundColor: "#ddd#", width: '30%', height: '5%' });


        if (type === ItemTypes.UnallocatedStudent) {
            let css = "";

            if ($.trim(item.unallocatedStudent.CourseCode) === "JU" ||
                $.trim(item.unallocatedStudent.CourseCode) === "JI" ||
                item.unallocatedStudent.AGE < 18) {
                css = "junior";
            }
            else if ($.trim(item.unallocatedStudent.ProgramCode) === "AY")
                css = "ay";
            else
                css = "ls";
            return <div style={style} className={"unallocated-student-drag " + css}>
                <div className={"unallocated-student-detail"}>
                    <div>
                        <span>{item.unallocatedStudent.Name},{item.unallocatedStudent.AGE}</span>
                        <span>{moment(item.unallocatedStudent.FlightDateTime).format("HH:mm")}</span>
                    </div>
                    <div>
                        <span>{item.Carrier}{item.unallocatedStudent.FlightNumber} - {item.unallocatedStudent.DepGateCode}</span>
                        <span></span>
                    </div>
                </div>
            </div>;
        }
        else {
            return <div style={style}>
                <img src={require("../images/seat.png")} />
                <span>{item.allocatedStudent.FlightNum}</span>
                <span>{moment(item.allocatedStudent.FlightDateTime).format("HH:mm")}</span>
                <span>{item.allocatedStudent.Name}</span>
                <span> - {item.allocatedStudent.Age}</span>
            </div>;
        }

    }

    render() {
        return (
            <div className={"App"}>

                <HeaderContainer />
                {this.props.path == "AirportTransfer" ?
                    <SearchContainer /> : null}
                {this.props.path == "AirportTransfer" ?
                    <AllocationContainer />
                    :
                    <FlightSearchContainer />
                }

                <Alert stack={{ limit: 15, spacing: 10 }} timeout={5000} />
                <Preview generator={this.generatePreview} />
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        path: state.path
    };
}

App = DragDropContext(MultiBackend(HTML5toTouch))(App);
export default connect(mapStateToProps)(App);
