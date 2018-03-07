import React, { PropTypes } from 'react';
import UnallocatedStudentList from './UnallocatedStudentList';
import BottomSection from './BottomSection';
import TaxiList from './../taxi/TaxiList';


const Allocation = (props) => {
    return (


        <div >
            {props.searchLoading ?
                <div id="loadingTakeOff">
                    <div id="flight" className="flight run"></div>
                    <div className="flighttext">Please sit tight while we fetch the students for you!!!</div>
                </div> : null
            }
            {props.search.destination ?
                <div className="allocation">

                    <div id="taxisection">
                        <TaxiList {...props} /> </div>
                    <div id="unallocated">
                        <UnallocatedStudentList {...props} />
                    </div>

                    <BottomSection {...props} />
                </div>
                : null
            }
        </div>

    );
};

export default Allocation;