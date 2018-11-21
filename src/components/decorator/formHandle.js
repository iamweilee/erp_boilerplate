import React, { Component } from 'react';
import { Form } from 'antd';

import _ from 'underscore';


const FormHandle = (Wrapper) => {

  @Form.create()
  class WrapperComponent extends Component {

    componentWillMount() {
      if (!_.isEmpty(this.props.fieldErrors)) {
        this.handleError(this.props.fieldErrors);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (!_.isEqual(this.props.fieldErrors, nextProps.fieldErrors)) {
        this.handleError(nextProps.fieldErrors, nextProps.form.getFieldsValue());
      }
    }

    componentDidMount = () => {
      if (this.props.autoSubmit) {
        this.doSubmit();
      }
    }

    doSubmit = () => {
      this.props.form.validateFields(
        { force: true },
        (err, values) => {
          if (!err) {
            this.props.onSubmit(values);
          }
        },
      );
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.doSubmit();
    }

    handleError(errors, fields) {

      if (this.props.handleError) {
        errors = this.props.handleError(errors);
      }

      const fieldErrors = _.mapObject(
        errors,
        (item, key) => ({
          errors: [item],
        }),
      );

      if (fields) {
        const fieldsReset = _.mapObject(fields,
          (item, key) => {
            const errors = fieldErrors[key] ? fieldErrors[key].errors : false;
            if (errors) {
              return {
                value: item,
                errors,
              };
            }
            return {
              value: item,
            };
          },
        );
        this.props.form.setFields(fieldsReset);
      } else {
        this.props.form.setFields(fieldErrors);
      }
    }


    doCancel= () => {
      this.props.onCancel();
    }

    handleCancel = (e) => {
      e.preventDefault();
      this.doCancel();
    }

    clearSearch = (form) => {
      return () => {
        form.resetFields();
        this.doSubmit();
      }
    }

    render() {
      return (<Wrapper
        {...this.props}
        clearSearch={this.clearSearch}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
      />);
    }
  }

  return WrapperComponent;
};

export default FormHandle;
