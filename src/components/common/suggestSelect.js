import React, { PropTypes, Component } from 'react';
import { Select, Input, Icon, Row, Col, Modal, Button, Spin, Tooltip, message } from 'antd';
import _ from 'underscore';

import { transform } from 'common/utils';

const Option = Select.Option;

export default class SuggestSelect extends Component {

  constructor(props) {
    super(props);
    let state = this.setStateFromProps(props);
    this.state = { ...state };
  }

  componentWillReceiveProps(nextProps) {
    let state = this.setStateFromProps(nextProps);
    this.setState({ ...state });
  }

  setStateFromProps(props) {
    return { ...props.value };
  }

  fireChange = () => {
    this.props.onChange({ ...this.state });
  }

  onInputChange = async (value) => {
    let { data } = await list(param);
    let suggestList = data ? data.list : [];
    this.setState({ suggestList });
  }

  onSelect = (id, option) => {
    let target = this.state.suggestList.find(item => item.id == id);
    this.setState({ value: { ...target }}, this.fireChange);
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
