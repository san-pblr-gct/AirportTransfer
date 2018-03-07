import React, { PropTypes } from 'react';

const SelectInput = ({ name, label, onChange,selectedValue, defaultOption, value, error, options }) => {
    return (
        <div className="form-group">
            {/* Note, value is set here rather than on the option - docs: https://facebook.github.io/react/docs/forms.html */}
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="form-control">
                {defaultOption !==null? <option value="">{defaultOption}</option> : null}
                {options && options.map((option) => {
                    if (name == "gatewayAddTaxi") {
                        return <option key={option.GateWay} value={option.GateWay}>{option.GateWay}</option>;
                    }
                    else if(name == "supplier") {
                        return <option key={option.Supplier_Id} value={option.Supplier_Id}>{option.SupplierName}</option>;
                    }
                    else if (name == "vehicle")
                        return <option key={option.VechileTypeCode} value={option.VechileTypeCode}>{option.VechileName}</option>;
                    else if (name == "logType")
                        if( selectedValue !="" && option.LogTypeName == selectedValue)
                        return <option key={option.Code + option.LogTypeName} selected value={option.Code}>{option.LogTypeName}</option>;
                        else
                        return <option key={option.Code + option.LogTypeName} value={option.Code}>{option.LogTypeName}</option>;
                        
                    else if (name == "handleIn")
                       if( selectedValue !="" && option.HandleName == selectedValue)
                       return <option key={option.HandleName + "1"} value={option.HandleName} selected>{option.HandleName}</option>;
                       else
                       return <option key={option.HandleName + "1"} value={option.HandleName}>{option.HandleName}</option>;
                    else if (name == "assignedTo")
                       if( selectedValue !="" && option.Name == selectedValue)
                       return <option key={option.Name + "1"} value={option.Name} selected>{option.Name}</option>;
                       else
                       return <option key={option.Name + "1"} value={option.Name}>{option.Name}</option>;
                    else
                       return <option key={option.Code} value={option.Code}>{option.Name}</option>;
                })
                }
            </select>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>

    );
};

SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    selectedValue:PropTypes.string,
    defaultOption: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object)
};

export default SelectInput;