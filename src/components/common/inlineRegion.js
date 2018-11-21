import React, { PropTypes } from 'react';
import { Select, Input, Icon, Tooltip, Row, Col, Modal, Button, Spin, message } from 'antd';
import _ from 'underscore';

import { transform } from 'common/utils';
import { getRegions } from 'biz/services/frame';

import './inlineRegion.less';

const uiPrefix = 'pahf-inline-region';
const Option = Select.Option;

export default class InlineRegion extends React.Component {

  constructor(props) {
    super(props);
    let state = this.getStateFromProps(props);
    this.state = { ...state };
    this.store = {};
  }

  getStateFromProps(props) {
    let { value = {} } = props;
    // 根据传入的省市区版块id配置对应的选择下拉数据
    return { ...this.parseDataFromInput(value) };
  }

  parseDataFromInput(data) {
    let { provinceId, cityId, regionId, blockId } = data;
    provinceId = provinceId ? ('' + provinceId) : undefined;
    cityId = cityId ? ('' + cityId) :  undefined;
    regionId = regionId ? ('' + regionId) : undefined;
    blockId = blockId ? ('' + blockId) : undefined;
    return { provinceId, cityId, regionId, blockId };
  }

  fireChange = () => {
    let { provinceId, cityId, regionId, blockId } = this.state;
    let provinceName = this.getTextFromValue('province');
    let cityName = this.getTextFromValue('city');
    let regionName = this.getTextFromValue('region');
    let blockName = this.getTextFromValue('block');

    this.props.onChange && this.props.onChange({
      provinceId, cityId, regionId, blockId,
      provinceName, cityName, regionName, blockName
    });
  }

  componentWillReceiveProps(nextProps) {
    let state = this.getStateFromProps(nextProps);
    this.setState({ ...state });
  }

  componentDidMount = () => {
    this.initData();
  }

  getTextFromValue = (type) => {
    let resource;
    let value;
    let text = '';

    if (type === 'city') {
      resource = this.state.cities;
      value = this.state.cityId;
    }
    else {
      resource = this.state[type + 's'];
      value = this.state[type + 'Id'];
    }

    let item = null;
    if (resource !== undefined && resource.length > 0) {
      item = resource.find(({ id }) => id === +value);
    }

    text = text || '';
    return item ? item.text : text;
  }

  // 获取省份列表
  getProvinceData = async () => {

    function isHotCity(city) {
      if (city.indexOf('上海') !== -1 || city.indexOf('北京') !== -1 || city.indexOf('广东') !== -1) {
        return true;
      }
      return false;
    }

    let { success, data } = await getRegions();
    let provinces = [];
    if (success) {
      // 重新对province排序，北上广置顶
      let normalProvinces = data.filter(item => !isHotCity(item.text));
      let hotProvinces = data.filter(item => isHotCity(item.text));
      provinces = [...hotProvinces, ...normalProvinces];
    }
    return { provinces };
  }

  // 根据省份获取城市列表
  getDataOfProvince = async () => {
    let { provinceId, cityId } = this.state;
    let { hasCity = true } = this.props;
    let cities;

    if (hasCity) {
      if (!provinceId || provinceId == -1) {
        cities = [];
      }
      else {
        let { data, success } = await getRegions(provinceId);
        cities = success ? data : [];
      }
    }
    // 此处为了重置
    let cityData = await this.getDataOfCity();
    return { cities, cityId, ...cityData };
  }

  getDataOfCity = async () => {
    let { cityId, regionId } = this.state;
    let { hasRegion = true, hasBlock = true } = this.props;
    let regions;

    if (hasRegion) {
      if (!cityId || cityId == -1) {
        regions = [];
      }
      else {
        let { data, success } = await getRegions(cityId);
        regions = success ? data : [];
      }
    }
    let regionData = await this.getDataOfRegion();
    return { regions, regionId, ...regionData };
  }

  getDataOfRegion = async () =>  {
    let { regionId, blockId } = this.state;
    let { hasBlock = true } = this.props;
    let blocks;

    if (hasBlock) {
      if (!regionId || regionId == -1) {
        blocks = [];
      }
      else {
        let { data, success } = await getRegions(regionId);

        blocks = success ? data : [];
      }
    }
    return { blocks, blockId };
  }


  onProvinceChange = (provinceId, noEvent) => {
    console.log('onProvinceChange');
    let { hasCity = true } = this.props;
    if (!hasCity) {
      let newState = { provinceId };
      this.setState({ ...newState }, noEvent || this.fireChange);
    }
    else {
      this.getDataOfProvince().then(provinceData => {
        let newState = { provinceId, ...provinceData };
        this.setState({ ...newState }, this.fireChange);
      });
    }
  }

  onCityChange = (cityId, noEvent) => {
    console.log('onCityChange');
    let { hasRegion = true } = this.props;
    if (!hasRegion) {
      let newState = { cityId };
      this.setState({ ...newState }, noEvent || this.fireChange);
    }
    else{
      this.getDataOfCity().then(cityData => {
        let newState = { cityId, ...cityData };
        this.setState({ ...newState }, noEvent || this.fireChange);
      });
    }
  }

  onRegionChange = (regionId, noEvent) => {
    console.log('onRegionChange');
    let { hasBlock = true } = this.props;
    if (!hasBlock) {
      let newState = { regionId };
      this.setState({ ...newState }, noEvent || this.fireChange);
    }
    else {
      this.getDataOfRegion({regionId, hasBlock}).then(regionData => {
        regionId = '' + regionId;
        let newState = { regionId, ...regionData };
        this.setState({ ...newState }, noEvent || this.fireChange);
      });
    }
  }

  onBlockChange = (blockId, noEvent) => {
    blockId = '' + blockId;
    this.setState({ blockId }, noEvent || this.fireChange);
  }

  initData = () => {
    let { provinceId } = this.state;
    let { hasProvince = true } = this.props;

    this.getDataOfProvince().then(provinceData => {
      let newState = { provinceId, ...provinceData };
      if (hasProvince) {
        this.getProvinceData().then(result => {
          this.setState({ ...result, ...newState });
        });
      }
      else {
        this.setState({ ...newState });
      }
    });
  }

  render() {
    let {
      provinceId, cityId, blockId, regionId,
      provinces = [], cities = [], regions = [], blocks = []
    } = this.state;

    let { hasProvince = true, hasCity = true, hasRegion = true, hasBlock = true, readonly = false } = this.props;
    if (readonly) {
      return (<div className={`${uiPrefix}`}>
        { hasProvince && this.getTextFromValue('province') }&nbsp;
        { hasCity && this.getTextFromValue('city') }&nbsp;
        { hasRegion && this.getTextFromValue('region') }&nbsp;
        { hasBlock && this.getTextFromValue('block') }&nbsp;
      </div>);
    }
    return (
      <div className={`${uiPrefix}`}>
        { hasProvince &&
          <Select value={provinceId} placeholder="不限省份"
          className={`${uiPrefix}-select-item`}
          onChange={this.onProvinceChange}>
          <Option key='all_province' value="-1">不限省份</Option>
          { transform.selectOptions(provinces) }
          </Select>
        }
        { hasCity &&
          <Select value={cityId} placeholder="不限城市"
            className={`${uiPrefix}-select-item`}
            onChange={this.onCityChange}>
            <Option key='all_city' value="-1" >不限城市</Option>
            { transform.selectOptions(cities) }
          </Select>
        }
        { hasRegion &&
          <Select value={regionId} placeholder="不限区域"
            className={`${uiPrefix}-select-item`}
            onChange={this.onRegionChange}>
            <Option key='all_region' value="-1" >不限区域</Option>
            { transform.selectOptions(regions) }
          </Select>
        }
        { hasBlock &&
          <Select value={blockId} placeholder="不限版块"
            className={`${uiPrefix}-select-item`}
            onChange={this.onBlockChange}>
            <Option key='all_block' value="-1" >不限版块</Option>
            { transform.selectOptions(blocks) }
          </Select>
        }
      </div>
    );
  }
}

InlineRegion.propTypes = {};
