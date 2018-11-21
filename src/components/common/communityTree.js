import React, { PropTypes } from 'react';
import { Checkbox } from 'antd';
import _ from 'underscore';

import Label from 'components/common/label';

import RegionCreate from 'components/common/regionCreate';

import './communityTree.less';


const CheckboxGroup = Checkbox.Group;

function checkIsAll(communities) {
  let notAllChecked = communities.find(community => !community.isChecked);
  if (notAllChecked) {
    return false;
  }
  return true;
}

function checkIsPartial(communities) {
  let checkedCommunity = communities.find(community => community.isChecked);
  if (checkedCommunity) {
    return true;
  }
  return false;
}

export default class CommunityTree extends React.Component {

  static propTypes = {
    datasource: PropTypes.array.isRequired
  }

  buildSubCheck = (communities, topIndex) => {
    return communities.map((community, index) => {
      return (
        <Checkbox
          onChange={this.changeHandler(topIndex, index)}
          value={community.id} checked={community.isChecked}>{community.name}</Checkbox>
      );
    });
  }

  buildTopCheck = (communitiesByCity) => {
    return communitiesByCity.map(({ cityName, cityId, list }, index) => {
      return (
        <div className="axg-community-tree-city-wrapper" key={cityId + '_city'}>
          <div className="axg-community-tree-city-title">
            <Checkbox
              onChange={this.checkAllHandler(index)}
              checked={checkIsAll(list)}
              indeterminate={checkIsPartial(list)}
              key={cityId + '_communities'}
            >{cityName}</Checkbox>
          </div>
          <div className="ant-card ant-card-bordered">
            {this.buildSubCheck(list, index)}
          </div>
        </div>
      );
    });
  }

  buildTopLabel = (communitiesByCity) => {
    return communitiesByCity.map(({ cityName, cityId, list }) => {
      let isEmpty = !checkIsAll(list) && !checkIsPartial(list);
      return (
        isEmpty ? '' : <div className="axg-community-tree-city-wrapper" key={cityId + '_city'}>
          <div className="axg-community-tree-city-title">{cityName}</div>
          {this.buildSubLabel(list, cityId)}
        </div>
      );
    });
  }

  buildSubLabel = (communities, cityId) => {
    let labels = _.pluck(communities.filter(community => community.isChecked), 'name')
                  .map(item => (<span className="axg-community-tree-community-label">{item}</span>));

    if (labels.length) {
      return (<div>{ labels }</div>);
    }

    return '';
  }

  changeHandler = (cityIndex, communityIndex) => {
    return (e) => {
      let { value, checked } = e.target;
      let { datasource } = this.props;
      datasource[cityIndex]['list'][communityIndex].isChecked = checked;
      this.props.onChange(datasource);
    }
  }

  checkAllHandler = (cityIndex) => {
    return (e) => {
      let { checked } = e.target;
      let { datasource } = this.props;
      let communities = datasource[cityIndex].list.map(community => {
        return {
          ...community,
          isChecked: checked
        }
      });

      datasource[cityIndex].list = [ ...communities ];
      this.props.onChange(datasource);
    }
  }

  render() {
    let { readonly, datasource } = this.props;
    datasource = datasource || [];
    return (
      <div className="axg-community-tree">
      { !readonly && this.buildTopCheck(datasource) }
      { !readonly &&
        <div>没有找到小区？<RegionCreate onChange={this.props.createCommunity} value={{}}/></div>
      }
      { readonly && this.buildTopLabel(datasource) }
      </div>
    );
  }
}
