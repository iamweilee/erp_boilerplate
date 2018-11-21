import React, { PropTypes } from 'react';
import { Select, Input, Icon, Tooltip, Row, Col, Modal, Button, Spin, message } from 'antd';
import _ from 'underscore';

import InlineRegion from './inlineRegion';

import { transform } from 'common/utils';
import './richRegion.less';

const uiPrefix = 'pahf-rich-region';
const Option = Select.Option;

export default class RichRegion extends React.Component {

  constructor(props) {
    super(props);
    let state = this.getStateFromProps(props);
    this.state = { showMap: false, ...state };
    this.store = {};
  }

  getStateFromProps(props) {
    let { value } = props;
    // 做两个副本，一个是真实的数据，一个是供地图使用的
    let cacheData = { ...value };
    let realData = { ...value };

    return { cacheData, realData };
  }

  fireChange = () => {
    this.props.onChange && this.props.onChange({ ...this.state.realData });
  }

  componentWillReceiveProps(nextProps) {
    let state = this.getStateFromProps(nextProps);
    this.setState({ ...state });
  }

  componentDidMount() {
    try {
      let geoc = new BMap.Geocoder();
      let geolocation = new BMap.Geolocation();
      this.setState({ geoc, geolocation });
    }
    catch (e) {
      message.error('地图组件创建失败，请检查网络！');
    }
  }

  updateCacheData(data, callback) {
    let { cacheData } = this.state;
    this.setState({ cacheData: { ...cacheData, ...data } }, callback);
  }

  onInlineRegionChange = (value) => {
    this.updateCacheData({...value});
  }

  parsePointByAddress = (callback) => {
    let address = this.state.cacheData.address || '';
    let city = this.state.cacheData.cityName + '市';
    let region = this.state.cacheData.regionName;

    // 将地址解析结果显示在地图上,并调整地图视野
    this.state.geoc.getPoint(
      city + ' ' + region + ' ' + address,
      (point) => {
        if (callback) {
          callback(point);
        }
        this.focusMapByPoint(point);
        this.updateByPoint(point);
      },
      city
    );
  }

  // 根据获取到的地图point更新地址信息
  updateByPoint = (point) => {
    // 更新的是cacheData，避免没必要的重刷
    if (point) {
      this.state.geoc.getLocation(point, (rs) => {
        let state = {
          latitude: '' + point.lat,
          longitude: '' + point.lng,
        };
        let { address, cityId, provinceId, regionId, blockId } = this.state.cacheData;
        console.log(`${provinceId}-${cityId}-${regionId}-${blockId}-${state.latitude}-${state.longitude}`);
        this.updateCacheData(state);
      });
    }
  }

  onAddressChange = (e) => {
    let address = e.target.value;
    this.updateCacheData({ address }, () => {
      this.parsePointByAddress();
    });
  }

  search = () => {
    this.parsePointByAddress(point => {
      if (!point) {
        message.error('未搜到输入地址的坐标，请手动拖拽坐标点定位，或者重新输入有效地址！');
      }
    });
  }

  focusMapByPoint = (point) => {
    if (point) {
      let map = this.state.map;
      try {
        map.centerAndZoom(point, 21); // 初始化地图,设置中心点坐标和地图级别

        let pointMarker = new BMap.Marker(point);
        pointMarker.enableDragging()
        pointMarker.addEventListener('dragend', e => {//拖动标注结束
          var pointNew = e.point;
          this.updateCacheData({ longitude: pointNew.lng, latitude: pointNew.lat });
        });

        map.addOverlay(pointMarker);
        if (this.state.pointMarker) {
          map.removeOverlay(this.state.pointMarker);
        }
        this.setState({ pointMarker });
      }
      catch(e) {
        message.error('定位失败，请检查网络是否支持百度地图或者刷新重试');
      }

    }
  }

  initMap = () => {
    this.setState({ mapLoading: false }, () => {
      // 先从真实数据中获取坐标
      let { latitude, longitude } = this.state.realData;
      // 不存在，就获取我们公司自己的地址。。。
      if (!latitude || !longitude) {
        latitude = '31.189087';
        longitude = '121.462264';
      }
      let point = new BMap.Point(longitude, latitude);
      point && this.focusMapByPoint(point);
    });
  }

  showMap = () => {
    this.setState({ showMap: true }, () => {
      let map = this.state.map;
      // 创建一个map
      if (!map) {
        map = new BMap.Map('pahf-map');
        map.addControl(new BMap.NavigationControl());
        this.setState({ map }, this.initMap);
      }
      else {
        this.initMap();
      }
    });
  }

  validateBeforeSubmit() {
    let { cacheData } = this.state;
    let { provinceId, cityId, blockId, regionId, address, latitude, longitude } = cacheData;

    if (!provinceId || !cityId || !blockId || !regionId || !address) {
      message.error('请填写省、市、区、版块及地址！');
      return false;
    }

    if (!longitude || !latitude) {
      message.error('坐标获取失败，请点击刷新定位点！');
      return false;
    }

    if (address.length > 200) {
      message.error('地址最多200个字符！');
      return false;
    }

    return true;
  }

  submitMap = () => {
    let { cacheData } = this.state;
    this.validateBeforeSubmit() && this.setState({ realData: { ...cacheData }, showMap: false }, this.fireChange);
  }

  closeMap = () => {
    this.setState({ showMap: false, cacheData: { ...this.state.realData } });
  }

  render() {
    let modalFormItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    let { showMap, cacheData, realData, mapLoading } = this.state;
    let { readonly = false, title } = this.props;

    let { address } = realData;
    return (
      <div className={`${uiPrefix}`}>
        <div>
          { !readonly && <Button type="primary" onClick={this.showMap}>{ address ? '修改地址' : '添加地址' }</Button> }
          { address && <Icon type="environment" /> }
          <InlineRegion readonly={true} value={cacheData}/>{address}
        </div>
        { !readonly && <Modal title={ title } maskClosable={ false } className={`${uiPrefix}-modal`}
          width={700} visible={showMap} onOk={ this.submitMap } onCancel={ this.closeMap }>
          <Spin tip="地图卖力加载中..." spinning={ mapLoading }/>
          <Row className={`${uiPrefix}-form-item`}>
            <Col className="ant-form-item-label" { ...modalFormItemLayout.labelCol }>
              <label className="ant-form-item-required" title="省份/城市">省份/城市</label>
            </Col>
            <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
              <div className="ant-form-item-control">
                 <InlineRegion onChange={this.onInlineRegionChange} value={cacheData}/>
              </div>
            </Col>
          </Row>
          { cacheData.cityId &&
          <Row className={`${uiPrefix}-form-item`}>
            <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
              <label className="ant-form-item-required" title="地址">地址</label>
            </Col>
            <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
              <div className="ant-form-item-control">
                <Input value={cacheData.address} placeholder="输入详细地址"
                  className={`${uiPrefix}-input-item`}
                  onChange={this.onAddressChange}/>
                  <Button className={`${uiPrefix}-search-butto`} type="primary" onClick={this.search}>刷新定位点</Button>
                  <Tooltip placement="top" title="定位不准确？挪动图钉纠正下~">
                  <Icon type="info-circle" />
                  </Tooltip>
              </div>
            </Col>
          </Row>
          }
          <Row className={`${uiPrefix}-form-item`}>
            <Col className="ant-form-item-label"  { ...modalFormItemLayout.labelCol }>
            </Col>
            <Col className="ant-form-item-control-wrapper" { ...modalFormItemLayout.wrapperCol }>
              <div id="pahf-map"></div>
            </Col>
          </Row>
        </Modal> }
      </div>
    );
  }
}

RichRegion.propTypes = {};
