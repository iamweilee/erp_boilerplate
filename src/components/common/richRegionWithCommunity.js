import React, { PropTypes } from 'react';
import { Select, Input, Icon, Row, Col, Modal, Button, Spin, Tooltip, message } from 'antd';
import _ from 'underscore';

import { transform } from 'common/utils';

import RichRegion from './richRegion';

import { getCommunities } from 'biz/services/frame';

import './richRegion.less';

const Option = Select.Option;

const modalFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

export default class RegionWidthCommunity extends RichRegion {

  getStateFromProps(props) {
    let { value } = props;
    // 只提取其中的部分数据
    let {
      provinceId, cityId, regionId, blockId,
      latitude, longitude, communityName, communityId
    } = value;
    // 根据传入的省市区版块id配置对应的选择下拉数据
    let parsedData = { latitude, longitude, communityName, communityId, ...this.parseDataFromInput(value) };

    // 做两个副本，一个是真实的数据，一个是供地图使用的
    let cacheData = { ...parsedData };
    let realData = { ...parsedData };

    return { cacheData, realData };
  }

  parsePointByAddress = () => {
    let address = this.state.cacheData.address || '';
    let communityName = this.state.cacheData.communityName || '';
    let city = this.getTextFromValue('city', this.state.cacheData) + '市';
    let region = this.getTextFromValue('region', this.state.cacheData);
    let block = this.getTextFromValue('block', this.state.cacheData);

    // 将地址解析结果显示在地图上,并调整地图视野
    this.state.geoc.getPoint(
      city + ' ' + communityName + ' ' + address,
      (point) => {
        this.focusMapByPoint(point);
        this.updateByPoint(point);
      },
      city
    );
  }

  formatCommunities = (communities) => {
    if (!communities) {
      return [];
    }
    return communities.map(({ communityId, name }) => ({ id: communityId, text: name }));
  }

  // 输入小区改变，会引发
  // 1. 搜索提示列表
  // 2. 固定城市，模糊查找获取point
  // 3. 根据point更新：区，版块，地址详情
  // 4. 清空communityId
  onCommunityChange = async (name) => {
    let { provinceId, cityId } = this.state.cacheData;
    const param = {
      name,
      provinceId,
      cityId
    };
    this.updateCacheData({ communityName: name, communityId: null }, this.parsePointByAddress);
    let { data } = await getCommunities(param);
    let communities = data ? data.list : [];
    this.updateCacheData({ communities });
  }

  // 根据HDMP获取社区地理位置并更新
  onCommunitySelect = (id, option) => {
    let community = this.state.cacheData.communities.find(item => item.communityId == id);

    let { name, longitude, latitude, blockId } = community;

    let point = new BMap.Point(longitude, latitude);
    this.focusMapByPoint(point);
    this.updateCacheData({longitude, latitude });

    let data = _.omit(community, 'name');
    data.communityName = name;

    this.onRegionChange(data.regionId).then(regionInfo => {
      this.updateCacheData({ ...data, ...regionInfo, blockId: '' + blockId });
    });
  }

  submitMap = () => {
    let { cacheData } = this.state;
    let { communityName } = cacheData;

    let valid = this.validateBeforeSubmit();


    if (!valid) {
      return false;
    }

    if (!communityName) {
      message.error('请填写小区名！');
      return false;
    }

    this.setState({ realData: { ...cacheData }, showMap: false }, this.fireChange);
  }

  render() {
    let { showMap, realData } = this.state;
    let { address } = realData;
    let { readonly } = this.props;
    return (
      <div className="axg-rich-region">
        { !!!readonly && <Button type="primary" onClick={this.showMap}>{ address ? '修改地址' : '添加地址' }</Button> }
        { this.renderDisplayText() }
        { !!!readonly &&
          <Modal title="小区地址" maskClosable={ false } className="axg-rich-region-modal" width={700} visible={showMap} onOk={ this.submitMap } onCancel={ this.closeMap }>
          { this.renderProvinceAndCity() }
          { this.renderCommunitySelect() }
          { this.renderBlockRegion() }
          { this.renderAddress() }
          { this.renderMap() }
        </Modal> }
      </div>
    );
  }

  renderDisplayText() {

    let { communityName, address } = this.state.realData;

    if (!address) {
      return '';
    }

    let regionDetail = `
      ${this.getTextFromValue('province')} ${this.getTextFromValue('city')}
      ${this.getTextFromValue('region')} ${this.getTextFromValue('block')}
      ${ communityName || '' } ${ address || ''}`;

    return (<span><Icon type="environment" /> }{ regionDetail }</span>)
  }

  renderProvinceAndCity() {
    let { cacheData } = this.state;
    return (
      <Row className="axg-rich-region-form-item">
        <Col className="ant-form-item-label" { ...modalFormItemLayout.labelCol }>
          <label className="ant-form-item-required" title="省份/城市">省份/城市</label>
        </Col>
        <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
          <div className="ant-form-item-control">
            <Select value={cacheData.provinceId} placeholder="所在省份"
              className="axg-rich-region-select-item"
              onChange={this.onProvinceChange}>
              { transform.selectOptions(cacheData.provinces) }
            </Select>
            <Select value={cacheData.cityId} placeholder="所在城市"
              className="axg-rich-region-select-item"
              onChange={this.onCityChange}>
              { transform.selectOptions(cacheData.cities) }
            </Select>
          </div>
        </Col>
      </Row>
    );
  }

  renderCommunitySelect() {
    let { cacheData } = this.state;
    if (!cacheData.cityId) {
      return '';
    }
    return (
      <Row className="axg-rich-region-form-item">
        <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
          <label className="ant-form-item-required" title="小区名">小区名</label>
        </Col>
        <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
          <div className="ant-form-item-control">
            <Select
              className="axg-rich-region-select-item"
              mode="combobox"
              value={cacheData.communityName}
              placeholder="输入或选择小区名"
              notFoundContent=""
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.onCommunityChange}
              onSelect={this.onCommunitySelect}
              ref="regionSelect"
              style={{width: 227}}
            >
              { transform.selectOptions(this.formatCommunities(cacheData.communities)) }
            </Select>
          </div>
        </Col>
      </Row>
    )
  }

  renderBlockRegion() {
    let { cacheData } = this.state;
    if (!cacheData.cityId) {
      return '';
    }
    return (
      <Row className="axg-rich-region-form-item">
        <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
          <label className="ant-form-item-required" title="地址">地址</label>
        </Col>
        <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
          <div className="ant-form-item-control">
            <Select value={cacheData.regionId} placeholder="所在区域"
              className="axg-rich-region-select-item"
              onChange={this.onRegionChange}>
              { transform.selectOptions(cacheData.regions) }
            </Select>
            <Select value={cacheData.blockId} placeholder="所在版块"
              className="axg-rich-region-select-item"
              onChange={this.onBlockChange}>
              { transform.selectOptions(cacheData.blocks) }
            </Select>
          </div>
        </Col>
      </Row>
    );
  }

  renderAddress() {
    let { cacheData } = this.state;
    if (!cacheData.cityId) {
      return '';
    }
    return (
      <Row className="axg-rich-region-form-item">
        <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
        </Col>
        <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
          <div className="ant-form-item-control">
            <Input value={cacheData.address} placeholder="输入详细地址"
              className="axg-rich-region-input-item"
              onChange={this.onAddressChange}/>
              <Button className="axg-rich-region-search-button" type="primary" onClick={this.search}>刷新定位点</Button>
              <Tooltip placement="top" title="定位不准确？挪动图钉纠正下~">
              <Icon type="info-circle" />
              </Tooltip>
          </div>
        </Col>
      </Row>
    );
  }

  renderMap() {
    let { mapLoading } = this.state;
    return (
      <div>
        <Spin tip="地图卖力加载中..." spinning={ mapLoading }/>
        <Row className="axg-rich-region-form-item">
          <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
          </Col>
          <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
            <div id="axg-map" style={{ height: 300 }}></div>
          </Col>
        </Row>
      </div>
    );
  }
}

RegionWidthCommunity.propTypes = {};
