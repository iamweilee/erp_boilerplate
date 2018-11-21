import React, { PropTypes } from 'react';

import { Button, Form, Select, Input, InputNumber, Checkbox, Radio } from 'antd';
import SubDate from 'components/common/subDate';
import { transform } from 'common/utils';
import classnames from 'classnames';
import { TimeRangeMonth } from 'common/global/constant';

const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

import { DatePicker } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

class InputFormField extends React.Component {

  render = () => {
    const entity = { ...this.props.entity };

    let {
      getFieldDecorator, label, field, options,
      required, requiredTip='必填项', /* 是否必填项标识 */
      placeholder, datasource, type, unit,
      max, min, onSwitch, readonly, style, operation, className,
      onSelectChange, disabledDate,
      pattern, patternTip='不符合条件', /* 校验正则表达式 & 提示语 */
    } = this.props;

    const itemProps = { label, required };
    const elemProps = { style };

    let fields = field.split('.');
    let value = fields.reduce(
      (value, fieldKey) => {
        return value ? value[fieldKey] : null;
      },
      { ...entity }
    );

    let inputEle = <Input
      placeholder={placeholder || ('输入' + label) } addonAfter={unit}  disabled={readonly}  { ... elemProps } className={className}/>;
    let defaultValue = '';

    if (type === 'select') {
      defaultValue = undefined;
      value =  value ? '' + value : undefined;
      let options;
      if (this.props.keyMapOptions) {
        options = transform.selectOptions(datasource, this.props.keyMapOptions);
      }
      else {
        options = transform.selectOptions(datasource);
      }
      inputEle = (<Select
        placeholder={ placeholder || ('选择' + label) } disabled={readonly}
        { ...elemProps } >{options}</Select>);
    }

    if (type === 'selectWithChange') {
      defaultValue = undefined;
      value =  value ? '' + value : undefined;
      const options = transform.selectOptions(datasource);
      inputEle = (<Select
        onChange={onSelectChange(field)}
        placeholder={ placeholder || ('选择' + label) } disabled={readonly}
        { ...elemProps } >{options}</Select>);
    }

    else if (type === 'checkbox') {
      defaultValue = [];
      inputEle = <CheckboxGroup options={datasource}  disabled={readonly}  { ... elemProps }/>;
    }
    else if (type === 'radio') {
      defaultValue = datasource && datasource[0] && datasource[0].value || '';
      value =  value ? '' + value : undefined;
      inputEle = <RadioGroup options={datasource} onChange={onSwitch} disabled={readonly} { ... elemProps }/>;
    }
    else if (type === 'textarea') {
      defaultValue = '';
      inputEle = <Input
        className="text-area"
        type="textarea" rows={4} placeholder={ placeholder || ('输入' + label)}
        disabled={readonly}  { ... elemProps }/>;
    }
    else if (type === 'richTex') {
      defaultValue = '';
      inputEle = <textarea className="form-control" ref='richText' rows="30">{val}</textarea>;
    }
    else if (type === 'inputNumber') {
      defaultValue = min || 1;
      inputEle = <InputNumber min={min || 0} max={max || 999} disabled={readonly} { ... elemProps }/>;
    }
    else if (type === 'space') {
      unit = <span>m<sup>2</sup></span>;
      inputEle = <InputNumber min={min || 0} max={max || 999} precision={2} disabled={readonly} { ... elemProps }/>;
    }
    else if (type === 'money') {
      inputEle = <InputNumber min={min || 0} max={max || 999} disabled={readonly} { ... elemProps }/>;
    }
    else if (type === 'datepicker') {
      defaultValue = moment( new Date());
      value = value ? moment( value ) : undefined;
      inputEle = <DatePicker allowClear={ false } format="YYYY-MM-DD" disabledDate={disabledDate}/>;
    }
    else if (type === 'datepickerTime') {
      // defaultValue = moment( new Date(), dateFormat);
      defaultValue = options && options.noInit ? '' : moment();
      value = value ? moment( value ) : undefined;
      inputEle = <DatePicker  showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}/>;
    }
    else if (type === 'subDate') {
      value = {
        startDate: options && options.noInit ? '' : this.props.startDate ? moment(this.props.startDate) : moment(),
        endDate: options && options.noInit ? '' :  this.props.endDate ? moment(this.props.endDate) : moment(),
      };
      inputEle = <SubDate operation={operation} {...options}/>;
    }
    else if (type === 'mobile') {
      options={
        ...options,
      };
    }
    else if (type === 'password') {
      value = '******';
    }

    if (value === undefined) {
      value = defaultValue;
    }
    else if (type === 'money' || type === 'space') {
      value = (value / 100).toFixed(2);
    }

    return (
      <FormItem {...itemProps} className={ classnames({ uns: !!this.props.hide}) }>
        {
          getFieldDecorator(field, {
            ...options,
            initialValue: value,
            first: true
          })(inputEle)
        }
        {unit}
      </FormItem>
    );
  }
}

export default InputFormField;
