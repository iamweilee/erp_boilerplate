import React, { PropTypes } from 'react';
import { Icon } from 'antd';

import { transform } from 'common/utils';

function Header({ logoutPage, frame, title }) {
  const { date, day, meridiem } = transform.getToday();
  if (frame.userId) {
    return (
      <div>
        <div className="logo">{title}</div>
        <div className="user-info">
          <span className="day">{date}&nbsp;{day}</span>
          <span className="info">{frame.userName}，{meridiem}好！</span>
          <a href="javascript:;" className="user-logout" onClick={logoutPage} title="退出">退出<Icon type="logout" /></a>
        </div>
      </div>
    );
  }

  return (<div></div>);
}

Header.propTypes = {
  logoutPage: PropTypes.func.isRequired,
};

export default Header;
