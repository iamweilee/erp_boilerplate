import { Menu, Icon } from 'antd';
import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import './siderMenu.less';

const SubMenu = Menu.SubMenu;

function SiderMenu({ handleSelect, frame }) {
  const { menus, current } = frame.sider;

  function pTopMenu(topItem, current) {
    if (topItem.path) {
      return (
        <Menu.Item key={topItem.key}>
          <div className="ant-menu-topmenu-title">
            <span>
              <Icon type={topItem.icon} />
              {
                topItem.isExternal
                ? <a href={topItem.path} target="_blank">
                    <span className="nav-text">{topItem.name}</span>
                  </a>
                : <Link to={topItem.path}>
                    <span className="nav-text">{topItem.name}</span>
                  </Link>
              }
            </span>
          </div>
        </Menu.Item>
      );
    }
    return (
      <SubMenu key={topItem.key} title={<span><Icon type={topItem.icon} /><span>{topItem.name}</span></span>}>
        {topItem.children.map(menuItem => pMenu(menuItem, current))}
      </SubMenu>
    );
  }

  function pMenu(menuItem, current) {
    let pathName = window.location.pathname;
    return (
      <Menu.Item key={menuItem.key}>
        {
          pathName === menuItem.path
          &&
          <div>
            <span className="nav-text">{menuItem.name}</span>
          </div>
        }
        {
          pathName !== menuItem.path
          &&
          <Link to={menuItem.path}>
            <span className="nav-text">{menuItem.name}</span>
          </Link>
        }
      </Menu.Item>
    );
  }

  let defaultOpenKeys = menus.map(menuItem => menuItem.key);

  return (
    <div className="sider-menu">
      <Menu
        mode="inline"
        theme={frame.theme}
        onSelect={handleSelect}
        selectedKeys={[current]}
        defaultOpenKeys={defaultOpenKeys}
        className="sider-menu"
        >
        {menus.map(menuItem => pTopMenu(menuItem, current))}
      </Menu>
    </div>
  );
}

SiderMenu.propTypes = {
  frame: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
};

export default SiderMenu;
