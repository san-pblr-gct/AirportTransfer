import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchActions from '../actions/searchActions';
import Search from '../components/top/Search';
import Alert from 'react-s-alert';
import moment from 'moment';

class SearchContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            destinations: [],
            transferTypes: [],
            gateways: [],
            errors: {},
            searching: false,
            search: props.search
        };

        this.onSearch = this.onSearch.bind(this);
        this.updateDestination = this.updateDestination.bind(this);
        this.updateTransferType = this.updateTransferType.bind(this);
        this.updateGateway = this.updateGateway.bind(this);
        this.updateTransferDate = this.updateTransferDate.bind(this);
        this.updateTransferDateMobile = this.updateTransferDateMobile.bind(this);
    }

    onSearch() {
        Alert.closeAll();
        let message = "<h4>Please select a value for the fields below</h4><ul>";
        let error = false;
        let search = {};
        if ($.trim(this.state.search.destination) === "") {
            error = true;
            message += '<li>Destination  </li>';
        }
        if ($.trim(this.state.search.transferDate) === "") {
            this.setState({
                'search': Object.assign({}, this.state.search, {
                    transferDate: moment(new Date()).format("YYYY-MM-D")
                })
            });
            search = Object.assign({}, this.state.search, {
                transferDate: moment(new Date()).format("YYYY-MM-D")
            });
        }
        else
            search = Object.assign({}, this.state.search);
        if ($.trim(this.state.search.transferType) === "") {
            error = true;
            message += '<li>Transfer type  </li>';
        }
        if (!error) {
    
            this.props.searchActions.Search(search, this.props.user.SecurityToken)
                .then(data => {
                    this.refs.searchDialog.hide();
                })
                .catch(error => {
                });
        }
        else
    
            Alert.error(message + '</ul>', {
                position: 'top',
                effect: 'bouncyflip',
                html: true
            });
    }   

    updateDestination(event) {
        this.setState({
            'search': Object.assign({}, this.state.search, {
                destination: event.target.value
            })
        });

        this.props.searchActions.updateDestination(event.target.value)
            .then()
            .catch(error => {
            });
    }
    updateGateway(event) {
        this.setState({
            'search': Object.assign({}, this.state.search, {
                gateway: event.target.value
            })
        });
    }
    updateTransferType(event) {
        this.setState({
            'search': Object.assign({}, this.state.search, {
                transferType: event.target.value
            })
        });
    }

    updateTransferDate(dateString) {
        let d = new Date(dateString);
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

        let formatted = new Date(d),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        this.setState({
            'search': Object.assign({}, this.state.search, {
                transferDate: [year, month, day].join('-')
            })
        });
    }

    updateTransferDateMobile(event) {
        this.state.search = Object.assign({}, this.state.search, {
            transferDate: event.target.value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.search !== this.props.search) {
            this.setState({ search: nextProps.search });
        }
    }

    render() {

        return (
            <div>
                <Search onSearch={this.onSearch} searching={this.props.searching} gateways={this.props.gateways}
                    destinations={this.props.destinations} updateDestination={this.updateDestination}
                    updateGateway={this.updateGateway} updateTransferType={this.updateTransferType}
                    transferTypes={this.props.transferTypes} updateTransferDate={this.updateTransferDate}
                    updateTransferDateMobile={this.updateTransferDateMobile} search={this.state.search} />

            </div>
        );
    }

}

SearchContainer.propTypes = {
    searchActions: PropTypes.object.isRequired,
    gateways: PropTypes.array,
    destinations: PropTypes.array,
    transferTypes: PropTypes.array,
    searching: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        searching: state.searching,
        destinations: state.destinations,
        transferTypes: state.transferTypes,
        gateways: state.gateways,
        user: state.user,
        search: state.search

    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchActions: bindActionCreators(searchActions, dispatch)

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContainer);