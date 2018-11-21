import { connect } from 'dva';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';

function NotFound({}) {

  return (
    <div id="content" className="warn-wrapper-content">
      <div className="warn-wrapper">
        <div className="warn-image notfound-empty" />
        <div className="warn-label">哎呀，您访问的页面找不到啦~</div>
        <Link className="ant-btn-primary ant-btn link-like-button" to={`/page`}>返回首页</Link>
      </div>
    </div>
  );
}

NotFound.propTypes = {
};

export default connect(({}) => ({}))(NotFound);
