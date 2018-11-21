import React, { PropTypes } from 'react';
import { Select, Input, Icon, Row, Col, Modal, Button, Spin, Tooltip, message } from 'antd';
import _ from 'underscore';

import { transform } from 'common/utils';

import RegionWithCommunity from './richRegionWithCommunity';

import { getCommunities, getCities, getRegions, getBlock } from 'biz/services/frame';

import './richRegion.less';

const Option = Select.Option;

function formatCommunities(communities) {
  if (!communities) {
    return [];
  }
  return communities.map(({ communityId, name }) => ({ id: communityId, text: name }));
}

export default class RegionCreate extends RegionWithCommunity {
  fireChange = (data, cb) => {
    this.props.onChange(data, cb);
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
    };

    this.fireChange(cacheData, () => {
      this.setState({ realData: {}, cacheData: {}, showMap: false });
    });
  }

  render() {
    let modalFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    let { showMap, cacheData, realData, mapLoading } = this.state;

    return (
      <div className="axg-rich-region">
        <Button type="primary" className="axg-button-like-link" onClick={this.showMap} style={{ marginBottom: 10 }}>
          <Icon type="plus-square-o" style={{fontSize: 14}}/>添加小区
        </Button>
        <Modal title="小区地址" maskClosable={ false } className="axg-rich-region-modal" width={700} visible={showMap} onOk={ this.submitMap } onCancel={ this.closeMap }>
          <Spin tip="地图卖力加载中..." spinning={ mapLoading }/>
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
          { cacheData.cityId &&
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
                  { transform.selectOptions(formatCommunities(cacheData.communities)) }
                </Select>
              </div>
            </Col>
          </Row>}
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
          { cacheData.cityId &&
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
          }
          <Row className="axg-rich-region-form-item">
            <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
            </Col>
            <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
              <div id="axg-map" style={{ height: 300 }}></div>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

RegionCreate.propTypes = {};
