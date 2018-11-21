/*
* @author:  lisijin025
* @createTime:  2017-06-09, 12:00:44 GMT+0800
* @description: 日期区间选择
*/

import React, { PureComponent } from 'react';
import { DatePicker, Form, Row, Col, Button } from 'antd';
import moment from 'moment';
import { DateFormat } from 'common/global/enum';
import './subDate.less';
import { TimeRangeMonth } from 'common/global/constant';
import classnames from 'classnames';

export default class Subdate extends PureComponent {

  state = {
    selectOption: -1
  }

  changeTimeRange = (type, range, key) => {
    return () => {
      const time = {
        year: 'y',
        month: 'months',
      }
      var start = this.props.value && this.props.value.startDate || moment();
      var end = moment(start).add(range, time[type]).subtract(1, 'day');

      this.changeHandle('endDate', end);
      this.setState({
        selectOption: key,
      });
    }
  }

  onChange = type => value => this.changeHandle(type, value);

  changeHandle = (type, value) => {
    this.setState({
      selectOption: -1,
    });
    this.props.onChange({
      ...this.props.value,
      [type]: value
    });
  }

  render() {
    const { operation, noInit } = this.props;

    let optionButton = [];

    if (operation) {
      optionButton = operation.map(
        (item, key) => (<Button key={key} type="primary"
          className={classnames('switch-button', {"switch-button-select": (this.state.selectOption != -1 && this.state.selectOption == key)})}
          size={'default'}
          onClick={ this.changeTimeRange(item.type, item.number, key) } >{ item.text }</Button>)
      );
    }

    const hasStartInit = this.props.value && this.props.value.startDate;
    const hasEndInit = this.props.value && this.props.value.endDate;

    return (
      <div className="subDate">
        <DatePicker
          value={ !!hasStartInit ? moment(this.props.value.startDate, DateFormat.getValueFromAlias('DAY')) : ( noInit ? '' : moment(new Date(), DateFormat.getValueFromAlias('DAY'))) }
          allowClear={ false }
          onChange={ this.onChange('startDate') }
          placeholder='请选择起始日期'
        />
        <span> - </span>
        <DatePicker
          style={{ marginRight: '20px'}}
          value={ !!hasEndInit ? moment(this.props.value.endDate, DateFormat.getValueFromAlias('DAY')) : ( noInit ? '' : moment(new Date(), DateFormat.getValueFromAlias('DAY'))) }
          allowClear={ false }
          onChange={ this.onChange('endDate') }
          placeholder='请选择结束日期'
        />
        { optionButton }
      </div>
    );
  }

}
