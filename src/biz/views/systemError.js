import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';

import '../../components/biz/error.less';

function Page({}) {

  return (
    <div className="no-sider-page error-page">
      <div className="error-page-content">
        <div className="error-page-content-image system-error" />
        <div className="error-page-content-label">哎呀，系统出错啦，请稍后重试~</div>
        <Link className="error-page-content-button ant-btn-primary link-like-button" to={`/page`}>重试</Link>
      </div>
    </div>
  );
}

Page.propTypes = {
};

export default connect(({}) => ({}))(Page);
