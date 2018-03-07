import React, { PropTypes } from 'react';
import AddTaxi from './../taxi/AddTaxi';

const BottomSection = (props) => {
  return (
   
      <div className="footer">
        <div className="clearfix">
          <div className="sub-footer">
            <div className="pull-left">
              <div className="status-mark">
                <div className="status-ls">LS</div>
                <div className="status-ay">AY</div>
                <div className="status-junior">Junior</div>
              </div>
            </div>
            <div className="pull-right">
              <AddTaxi {...props} /> </div>
          </div>
        </div>
      </div> 
  );
};



export default BottomSection;