import React, { PropTypes } from 'react';

const KPI = (props) => {
  return (
    <div className="container kpi">
      <div>Average Transfer Cost : <b> Per transfer:{props.kpi.PerTransfer} {props.kpi.CurrencyCode}/Per pax: {props.kpi.PerPax} {props.kpi.CurrencyCode}</b></div>
    </div>
  );
};
export default KPI;