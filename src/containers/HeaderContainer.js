import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../components/common/Header';

class HeaderContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <Header {...this.props} />
        );
    }
}

HeaderContainer.propTypes = {
    user: PropTypes.object,
    search: PropTypes.object,
    modifiedStudents: PropTypes.array
};

function mapStateToProps(state) {
    return {
        user: state.user,
        modifiedStudents: state.modifiedStudents,
        search:state.search,
        path:state.path
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderContainer);