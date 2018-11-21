import React, { PropTypes } from 'react';
import { Checkbox, Card } from 'antd';
import _ from 'underscore';

import Label from 'components/common/label';
import './rolesTree.less';

const CheckboxGroup = Checkbox.Group;

function mixData(allRoles, value) {
  return allRoles.map(role => {
    if (role.roles) {
      let checkedRoles = _.intersection(_.pluck(role.roles, 'value'), value);
      return {
        ...role,
        checkedRoles
      };
    }
    else {
      return { ...role, isSelected: value.includes(role.value) };
    }
  });
}

function checkIsAll(roles, checkedRoles) {
  return checkedRoles.length === roles.length;
}

function checkIsPartial(checkedRoles) {
  return checkedRoles.length > 0;
}

function getModuleIndexByKey(key, datasource) {
  return datasource.findIndex(item => item.key === key);
}

function getValueFromMixedData(data) {
  return data.reduce(
    (roles, module) => {
      if (module.checkedRoles) {
        let currentRoles = module.checkedRoles;
        roles = [ ...roles, ...currentRoles ];
      }
      else if (module.isSelected) {
        roles.push(module.value);
      }
      return roles;
    },
    []
  );
}

function buildDirectMap(topModules) {
  return topModules.reduce(
    (map, topModule) => {
      if (topModule.roles) {
        let newMap = topModule.roles.forEach(role => {
          map[role.value] = role.label;
        });
      }
      else {
        map[topModule.value] = topModule.title;
      }

      return map;
    },
    {}
  );
}

export default class RolesTree extends React.Component {
  constructor(props) {
    super(props);
    let state = this.getStateFromProps(props);
    this.state = { ...state };
  }

  getStateFromProps(props) {
    let { value = [], datasource = []} = props;
    let directMap = buildDirectMap(datasource);
    let mixedData = mixData(datasource, value);
    return { mixedData, directMap };
  }

  componentWillReceiveProps(nextProps) {
    let state = this.getStateFromProps(nextProps);
    this.setState({ ...state });
  }

  fireChange = () => {
    this.props.onChange && this.props.onChange(getValueFromMixedData(this.state.mixedData));
  }


  buildTopRolesCheck = (modules) => {
    return modules.map(({ key, title, roles, isSelected, checkedRoles }) => {
      return (
        <div className="roles-tree-module-wrapper" key={key + '_module'}>
          <div className="roles-tree-module-title">
            <Checkbox
              onChange={this.checkAllHandler(key)}
              checked={roles ? checkIsAll(roles, checkedRoles) : (isSelected ? true : false)}
              indeterminate={roles ? checkIsPartial(checkedRoles) : false }
              key={key + '_module_all_roles'}
            >{title}</Checkbox>
          </div>
          {
            roles !== undefined && <div className="roles-tree-module-content">
            <CheckboxGroup
              options={roles} value={checkedRoles}
              onChange={this.changeHandler(key)} key={key} key={key + '_module_roles'}/>
            </div>
          }
        </div>
      );
    });
  }


  buildTopRolesLabel = (modules) => {
    return modules.map(({ key, title, isSelected, roles, checkedRoles }) => {
      let isEmpty = roles ? (!checkIsAll(roles, checkedRoles) && !checkIsPartial(checkedRoles)) : !isSelected;

      let labels = roles ? checkedRoles.map(role => this.state.directMap[role]) : (isSelected ? [title] : []);
      return (
        isEmpty ? '' : <div className="roles-tree-module-wrapper" key={key + '_module'}>
          <div className="roles-tree-module-title">{title}</div>
          {labels.length ? <Label key={key + '_submodule'} value={ labels.join('、') } /> : ''}
        </div>
      );
    });
  }

  changeHandler = (key) => {
    return (checkedRoles) => {
      let mixedData = [ ...this.state.mixedData ];
      let topModuleKey = getModuleIndexByKey(key, mixedData);
      let { roles } = mixedData[topModuleKey];
      mixedData[topModuleKey].checkedRoles = [ ...checkedRoles ];
      this.setState({ mixedData }, this.fireChange);
    }
  }

  checkAllHandler = (key) => {
    return (e) => {
      let mixedData = [ ...this.state.mixedData ];
      let topModuleKey = getModuleIndexByKey(key, mixedData);
      let { roles } = mixedData[topModuleKey];
      if (!roles) {
        mixedData[topModuleKey].isSelected = e.target.checked;
      }
      else {
        let checkedRoles = [];
        if (e.target.checked) {
          checkedRoles = _.pluck(roles, 'value');
        }
        mixedData[topModuleKey].checkedRoles = [ ...checkedRoles ];
      }
      this.setState({ mixedData }, this.fireChange);
    }
  }

  render() {
    let { mixedData } = this.state;
    let { readonly } = this.props;
    return (
      <div className="roles-tree">
      { !readonly && this.buildTopRolesCheck(mixedData) }
      { readonly && this.buildTopRolesLabel(mixedData) }
      </div>
    );
  }
}

RolesTree.propTypes = {};
