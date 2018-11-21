/**
 * Created by Shengchenling711 on 2017/7/4.
 */
import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';
import classnames from 'classnames';

class ErrorRow extends React.Component {

  render = () => {
    const { globalError, fieldErrors } = this.props;
    return (
      <p className="account-error-row">
        <Icon type="close-circle" style={{ marginRight: 10, fontSize: 12, color: '#cc3232' }} />
        {globalError || fieldErrors[0].msg ||'登录错误'}
      </p>
    )
  }
}

export default ErrorRow
