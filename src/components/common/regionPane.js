import React, { PropTypes } from 'react';
import { Tabs, Collapse, Icon } from 'antd';
import { transform } from 'common/utils';

import './regionPane.less';

const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

export default class RegionPane extends React.Component {

  static propTypes = {
    allRegions: PropTypes.array.isRequired,
    datasource: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {value: [], key: new Date().getTime()};
  }

  componentDidMount() {
    this.setStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateFromProps(nextProps);
  }

  tranformToObject(value, regions) {
    // 适配value，可能只是id串，转换成对象
    if (value && regions.length > 0) {
      // 打散datasource
      const dataMap = new Map();
      regions.forEach(disctrict => {
        disctrict.children.forEach(blockByInitial => {
          blockByInitial.children.forEach(block => {
            dataMap.set('' + block.id, { ...block, id: '' + block.id, parentName: disctrict.name });
          });
        });
      });

      let valueObj = value.map(block => {
        let fullBlock = dataMap.get(block.id || block);
        return {
          ...fullBlock
        }
      });
      return valueObj;
    }
    return [];
  }

  setStateFromProps(props) {
    let { value, allRegions } = props;
    let valueObj = this.tranformToObject(value, allRegions);
    console.log(valueObj);
    this.setState({value: [...valueObj]});
  }

  fireChange = () => {
    this.props.onChange && this.props.onChange(this.state.value);
  }

  onDeleteItem = (id) => {
    return () => {
      let { value } = this.state;
      let validArea = value.filter(item => item.id !== '' + id);
      this.setState({ value: [...validArea] }, this.fireChange);
    }
  }

  deleteItem = (id) => {
    let { value } = this.state;
    let validArea = value.filter(item => item.id !== '' + id);
    this.setState({ value: [...validArea] }, this.fireChange);
  }

  onSelectItem = (item, parentName) => {
    return () => {
      const { value } = this.state;
      const { single } = this.props;
      let isSelected = value.find(area => area.id === '' + item.id);

      if (isSelected) {
        this.deleteItem(item.id);
      }
      else {
        let mixedItem = { ...item, id: '' + item.id, parentName };
        if (single) {
          this.setState({ value: [mixedItem] }, this.fireChange);
        }
        else {
          this.setState({ value: [...this.state.value, mixedItem] }, this.fireChange);
        }

      }
    }
  }

  onNav = (parentKey, itemKey) => {
    return () => {
      this.setState({ [parentKey + 'ActiveKey']: itemKey });

      let offsetTop;
      if (itemKey) {
        let target = $('#' + this.state.key + '-' + parentKey + '-' + itemKey);
        offsetTop = target.position().top;
      }
      else {
        offsetTop = 0;
      }
      let container = $('#' + this.state.key + '-' + parentKey + '-box');
      let outter = $('#' + this.state.key + '-' + parentKey + '-box-wrapper');
      let scrollTop = outter[0].scrollTop;
      container.animate({top: -(offsetTop - scrollTop)});
    }
  }

  buildItemsPane = ({ name, id, children }) => {
    let { datasource } = this.props;
    if (!datasource) {
      return [];
    }

    // const data = [ ...this.props.datasource[key] ];
    const { value } = this.state;

    const activeKey = this.state[id + 'ActiveKey'];
    const valueKey = 'initial';
    return (
      <TabPane tab={name} key={`${id}`} className={ 'region-pane-tab-' + id }>
        <div className="region-pane-tab-nav">
          <span onClick={this.onNav(id)}
            className={ activeKey ? 'region-pane-tab-nav-item' : 'region-pane-tab-nav-item-selected' }>全部</span>
          {
            children.map((item, index) =>
              <div onClick={this.onNav(id, item[valueKey])}
                className={ activeKey === item[valueKey] ? 'region-pane-tab-nav-item-selected' : 'region-pane-tab-nav-item' }>
                {item[valueKey]}
              </div>
            )
          }
        </div>
        <div className="region-pane-tab-content" id={ this.state.key + '-' + id + '-box-wrapper'}>
          <div id={ this.state.key + '-' + id + '-box'} className="region-pane-tab-content-scroll-view" >
          {
            children.map(item => {
              return (
                <div className="region-pane-city-block" id={  this.state.key + '-' + id + '-' + item[valueKey] }>
                  <div className="region-pane-city-block-title">{item[valueKey]}</div>
                  <div className="region-pane-city-block-body">
                    {
                      item.children.map(city =>
                        <span
                          className={ value.find(area => area.id === '' + city.id) ? 'item-selected' : 'item' }
                          onClick={this.onSelectItem(city, name)}>{city.name}
                        </span>
                      )
                    }
                  </div>
                </div>
              )
            })
          }
          </div>
        </div>
      </TabPane>
    );
  }

  buildResultPane = () => {
    const { value } = this.state;
    const { readonlyBlockScope, allRegions } = this.props;
    const readonlyBlockScopeObj = this.tranformToObject(readonlyBlockScope, allRegions);
    if ((value && value.length) || (readonlyBlockScope && readonlyBlockScope.length)) {
      return <div className="region-pane-result">
        {
          readonlyBlockScope && readonlyBlockScope.length > 0 && readonlyBlockScopeObj.map(item => <div className="region-pane-result-item">
            <span>{item.parentName + '-' + item.name}</span>
            </div>
          )
        }
        {
          value.map(item => <div className="region-pane-result-item">
            <span>{item.parentName + '-' + item.name}</span><Icon type="close" onClick={this.onDeleteItem(item.id)}/>
            </div>
          )
        }
      </div>;
    }

    return '';
  }

  buildEditPage = () => {
    const { value } = this.state;
    const { datasource } = this.props;

    if (datasource.length) {
      return (<Collapse bordered={false}>
          <Panel header="选择城市" key="1">
            <Tabs
              hideAdd
              onChange={this.onChange}
              defaultActiveKey={`${datasource[0].id}`}
              animated={false}
              className="country-tab"
              type="card"
            >
            {
              datasource.map(item => this.buildItemsPane(item))
            }
            </Tabs>
          </Panel>
        </Collapse>
      );
    }
    return '';
  }

  render() {
    // FIXME  Collapse没有设置 defaultActiveKey={['1']} 因为设置后画面会有闪动。目前还没空修复
    // 后面看看闪动出现的原因。
    return (
      <div className="region-pane">
      {
        this.buildResultPane()
      }
      {
        this.buildEditPage()
      }
      </div>
    );
  }
}
