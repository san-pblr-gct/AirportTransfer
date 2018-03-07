import React, { PropTypes } from 'react';
import KPI from '../components/top/KPI';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class KPIContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <KPI  {...this.props} />
        );
    }

}
KPIContainer.propTypes = {
    kpi: PropTypes.object
};

function mapStateToProps(state) {
    return {
        kpi: state.kpi
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(KPIContainer);