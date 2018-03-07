import React, { PropTypes } from 'react';

const TextInput = ({ name, label, onChange, placeholder, value, error, style, required, type ,disabled}) => {
  let wrapperClass = 'form-group ' + style;
  if (error && error.length > 0) {
    wrapperClass += " " + 'has-error';
  }

  return (
    <div className={wrapperClass}>
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required} disabled={disabled} />
      {error && <div className="alert alert-danger">{error}</div>}

    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  class: PropTypes.string
};

export default TextInput;