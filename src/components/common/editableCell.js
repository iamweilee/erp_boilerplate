import React, { PropTypes } from 'react';
import { Icon, Input, Select, Checkbox, Button, InputNumber, Tooltip } from 'antd';
import { selectOptions } from 'common/utils/transform';
import dynamicConst from 'common/dynamicConst';

import './editableCell.less';

class EditableCell extends React.Component {
  state = {
    value: this.props.value
  }

  /**
   * 当新props的value值更新时，更新state.value。
   *    用以解决批量修改出租状态而页面不更新的问题。--jiangxtx 2017-12-25.
   * // TODO... 这里设置 state.value 的用意为何？
   * @param nextProps
   * @param currentProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      // console.log('componentWillReceiveProps' , nextProps.value)
      this.setState({ value: nextProps.value })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.props.editable
      || nextState.value !== this.state.value
      || nextProps.error !== this.props.error;
  }

  handleTargetChange = (type) => {
    const valueType = type || 'value';
    return (e) => {
      const value = e.target[valueType];
      this.handleValueChange(value);
    }
  }

  onChange = () => {
    let value = this.state.value;
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  handleValueChange = (value) => {
    this.setState({ value }, this.onChange);
  }

  render() {
    let { value } = this.state;
    let { cellKey, cellType, textType, style, otherProps, unit, datasource, error,
      readonly, /* 是否只读 */
    } = this.props;
    cellType = cellType || 'Input';
    style = style || {};
    otherProps = otherProps || {};

    let editCell;
    let displayCell;

    if (cellType === 'Input') {
      editCell = (
        <Input
          {...otherProps}
          addonAfter={ unit }
          value={ value }
          onChange={ this.handleTargetChange() }
          style={style}
        />
      );
      displayCell = (<div style={style}>{value}{unit}</div>);
    }
    else if (cellType === 'Money' || cellType === 'Space' ) {
      editCell = (
        <InputNumber
          {...otherProps}
          addonAfter={ unit }
          value={ value }
          onChange={this.handleValueChange}
          style={style}
          min={this.props.min || 0}
          max={this.props.max || 999}
          step={100}
        />
      );
      displayCell = (<div style={style}>{value}{unit}</div>);
    }
    else if (cellType === 'InputNumber') {
      editCell = (
        <InputNumber
          {...otherProps}
          style={style}
          value={ value }
          min={this.props.min || 0}
          max={this.props.max || 999}
          precision={this.props.precision || 0}
          onChange = {this.handleValueChange}
        />
      );
      displayCell = (<div style={style}>{value}</div>);
    }
    else if (cellType === 'Select') {
      value = value ? '' + value : undefined;

      editCell = (
        <Select
          disabled={ !!readonly }
          value={ value } onChange={this.handleValueChange} style={style}>
          { selectOptions(this.props.datasource, this.props.keyMapOptions) }
        </Select>
      );
      let text;
      if (textType === 'dynamicConst') {
        text = dynamicConst.getTextFromValue(cellKey, value);
      }
      else if (textType === 'array') {
        let item = datasource.find(item => item.id == value);
        text = item ? item.text : '-';
      }
      displayCell = (<div style={style}>{text}</div>);
    }

    else if (cellType === 'Checkbox') {
      editCell = (
        <Checkbox
          onChange = { this.handleTargetChange('checked') }
          checked = { value }
        ></Checkbox>
      );
      displayCell = (<div>{value ? '是' : '否'}</div>);
    }

    else if (cellType === 'MultipleSelect') {
      value = value.map( item => ('' + item));
      editCell = (
        <Select
          onChange = {this.handleValueChange}
          mode = "multiple"
          defaultValue = { value }
          style={style}
        >
          { selectOptions(datasource) }
        </Select>
      );
      let text = value.map(item => dynamicConst.getTextFromValue(cellKey, item));
      displayCell = (<div style={style}>{text.join('、')}</div>);
    }

    let cell;

    if (this.props.editable === undefined || this.props.editable) {
      cell = editCell;
    }
    else {
      cell = displayCell;
    }

    if (error) {
      return <Tooltip placement="topLeft" title={error}><div className="has-error">{cell}</div></Tooltip>
    }

    return cell;
  }
}

export default EditableCell;
