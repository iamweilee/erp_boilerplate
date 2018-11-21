import React, { PropTypes } from 'react';
import { Input } from 'antd';

export default class DoorField extends React.Component {

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

  onPropertyChange = (fieldName) => {
    return (e) => {
      this.setState({ [fieldName]: e.target.value }, this.fireChange);
    }
  }

  render() {
    const { readonly = false, fields } = this.props;

    if (readonly) {
      return <div className="inline-input">
        {
          fields.map(({ name, style, unit }) => {
            return (
              <label className="inline-label-wrapper">{this.state[name]}{unit || ''}</label>
            )
          })
        }
      </div>;
    }
    else {
      return <div className="inline-input">
        {
          fields.map(({ name, style, unit }) => {
            return (
              <div className="inline-input-wrapper">
                <Input value={this.state[name]} style={style || { marginRight: 10, width: 90 }}  onChange={this.onPropertyChange(name)}/>{unit || ''}
              </div>
            )
          })
        }
      </div>;
    }
  }
}

DoorField.propTypes = {};
