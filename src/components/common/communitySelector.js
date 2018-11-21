import React, { PropTypes } from 'react';
import { Select, Input, Icon, Row, Col, Modal, Button, Spin, Tooltip, message } from 'antd';
import _ from 'underscore';

import { transform } from 'common/utils';
import { PROVINCES } from 'common/global/const';

import RegionWithCommunity from './richRegionWithCommunity';

import { getCommunities, getRegions } from 'biz/services/frame';

import './richRegion.less';

const modalFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default class CommunitySelector extends RegionWithCommunity {
  onCommunityChange = async (name) => {
    let { provinceId, cityId } = this.state.cacheData;
    const param = {
      name,
      provinceId,
      cityId
    };
    this.updateCacheData({ communityName: name, communityId: null });
    let { data } = await getCommunities(param);
    let communities = data ? data.list : [];
    this.updateCacheData({ communities });
  }

  // 根据HDMP获取社区地理位置并更新
  onCommunitySelect = (id, option) => {
    let community = this.state.cacheData.communities.find(item => item.communityId == id);

    let { name, longitude, latitude, blockId, address } = community;

    // let point = new BMap.Point(longitude, latitude);
    // this.focusMapByPoint(point);

    this.updateCacheData({longitude, latitude, address });

    let data = _.omit(community, 'name');
    data.communityName = name;

    this.onRegionChange(data.regionId).then(regionInfo => {
      this.updateCacheData({ ...data, ...regionInfo, blockId: '' + blockId });
    });
  }

  getDataOfProvince = async(provinceId) => {
    let citiesRes = await getRegions(provinceId);
    let cities = citiesRes || [];
    let cityId = cities[0].id;

    return { cities, cityId };
  }

  onCityChange = (cityId) => {
    let newState = { cityId };
    this.updateCacheData(newState);
  }

  onProvinceChange = (provinceId) => {
    this.getDataOfProvince(provinceId).then(provinceData => {
      let newState = { provinceId, ...provinceData };
      this.updateCacheData(newState);
    });
  }

  initMap = () => {
    this.getPCRBData(this.state.realData).then(result => {
      this.setState(
        {
          cacheData: {
            ...this.state.cacheData,
            ...result
          }
        }
      );
    });
  }

  submitMap = () => {
    let { cacheData } = this.state;
    let { communityId } = cacheData;

    if (!communityId) {
      message.error('请选择一个已经存在的小区~ 搜不到小区，请联系BD~');
      return false;
    }

    this.setState({ realData: { ...cacheData }, showMap: false }, this.fireChange);
  }

  renderDisplayText() {

    let { realData } = this.state;

    if (!realData || !realData.address) {
      return '';
    }

    let { communityName, address } = realData;


    let regionDetail = `
      ${this.getTextFromValue('province')} ${this.getTextFromValue('city')}
      ${ communityName || '' } ${ address || ''}`;

    return (<span><Icon type="environment" />{ regionDetail }</span>)
  }

  renderBlockRegion() {
    return '';
  }

  renderAddress() {
    let { cacheData } = this.state;
    return (
      <Row className="axg-rich-region-form-item">
        <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
        </Col>
        <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
          <div className="ant-form-item-control">
              <span>{ cacheData.address || '--' }</span>
          </div>
        </Col>
      </Row>
    );
  }

  renderMap() {
    return '';
  }
}

CommunitySelector.propTypes = {};
