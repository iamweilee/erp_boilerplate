import React, { PropTypes } from 'react';
import { Button } from 'antd';

function LinkButton({ children, onClick }) {
  return <Button type="primary" size={'default'} onClick={onClick} className="button-like-link">{children}</Button>;
}

LinkButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default LinkButton;
