/**
 * 列表筛选区基类
 */
import React, { PropTypes } from 'react';

export default class FilterForm extends React.Component {

  onChange = (fieldName, autoSubmit) => {
    return (value) => {
      let { form } = this.props;
      let fieldObj = {};
      fieldObj[fieldName] = value.target ? value.target.value : value;
      form.setFieldsValue({...fieldObj});
      this.props.form.validateFields(
        { force: true },
        (err, values) => {
          if (!err) {
            this.props.onChange(values, autoSubmit);
          }
        },
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { form } = nextProps;
    form.resetFields();
  }

  clear = () => {
    const { form } = this.props;
    this.props.form.validateFields(
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.onClear(values);
        }
      },
    );
  }

  render() {
    return (<div></div>)
  }
}
