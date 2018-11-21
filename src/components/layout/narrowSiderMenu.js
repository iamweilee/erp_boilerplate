import { Menu, Icon } from 'antd';
import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import './narrowSiderMenu.less';

const SubMenu = Menu.SubMenu;

function SiderMenu({ handleSelect, frame }) {
  const { menus, current } = frame.sider;

  function pMenu(menuItem, index, current) {
    let paddingPos = 24 * index;
    let menuClass = 'leaf-menu-' + paddingPos;
    let pathName = window.location.pathname;

    return (
      <Menu.Item key={menuItem.key} className={menuClass}>
        {
          pathName === menuItem.path
          &&
          <div>
            <Icon type={menuItem.icon} />
            <span className="nav-text">{menuItem.name}</span>
          </div>
        }
        {
          pathName !== menuItem.path
          &&
          <Link to={menuItem.path}>
            <Icon type={menuItem.icon} />
            <span className="nav-text">{menuItem.name}</span>
          </Link>
        }
      </Menu.Item>
    );
  }

  let defaultOpenKeys = menus.map(menuItem => menuItem.key);

  return (
    <div className="narrow-sider-menu">
      <Link to="/index/housing/list" className="logo" />
      <Menu
        theme={frame.theme}
        onSelect={handleSelect}
        selectedKeys={[current]}
        defaultOpenKeys={defaultOpenKeys}
        className="sider-menu"
        >
        {menus.map((menuItem, index) => pMenu(menuItem, index, current))}
      </Menu>
    </div>
  );
}

SiderMenu.propTypes = {
  frame: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default SiderMenu;
