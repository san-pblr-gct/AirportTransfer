import React, { Component } from 'react';
import ReactDOM from "react-dom";
import SelectInput from '../common/SelectInput';
import TextInput from '../common/TextInput';
import Alert from 'react-s-alert';


export default class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            terminal: props.value
        }
        this.onTerminalChange = this.onTerminalChange.bind(this);
    }

    componentWillMount() {
        this.setTerminal(this.props.value)
    }

    refresh(params) {
        this.setTerminal(params.value);
    }

    setTerminal(value) {
        this.setState({
            terminal: value
        })
    };

    onTerminalChange(event) {
        if (($.trim(this.props.data.AllocatedSupplier) !== null && $.trim(this.props.data.AllocatedSupplier) !== "")
            && ($.trim(this.props.data.ArrDepGateCode) === null || $.trim(this.props.data.ArrDepGateCode) === "")) {
            Alert.error('This student is already allocated to a taxi. To change the terminal, unallocate the student from the taxi first.', {
                position: 'top',
                effect: 'bouncyflip'
            });
        }
        else {
            this.setTerminal(event.target.value);
            this.props.updateTerminal(this.props.data, event.target.value);
        }
    }

    render() {
       
        let terminalEditor = null;
        if (this.props.data.FlightId > 0) {
            if ($.trim(this.props.data.ArrDepGateCode) === null || $.trim(this.props.data.ArrDepGateCode) === "")
                terminalEditor = <SelectInput
                    name="destination" value={this.state.terminal}
                    label="destination"
                    defaultOption="Select" options={this.props.trainGateways}
                    onChange={this.onTerminalChange} />
            else
                terminalEditor = <TextInput value={this.state.terminal} onChange={this.onTerminalChange} />
        }

        return (
            terminalEditor

        );
    }
}