import React, { PropTypes } from 'react';
import { Checkbox } from 'antd';
import _ from 'underscore';

const CheckboxGroup = Checkbox.Group;
export default class CheckboxWithAll extends React.Component {

  static propTypes = {
    datasource: PropTypes.array.isRequired
  }

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
    return { checkedList: props.value };
  }

  fireChange = () => {
    let { checkedList } = this.state;
    this.props.onChange([...checkedList]);
  }

  onChange = (checkedList) => {
    this.setState({ checkedList }, this.fireChange);
  }

  onCheckAllChange = (e) => {
    let checkedList;
    // 全选
    if (e.target.checked) {
      checkedList = _.pluck(this.props.datasource, 'value');
    }
    else {
      checkedList = [];
    }

    this.setState({ checkedList }, this.fireChange);
  }

  checkIsPartial = () => {
    let { checkedList } = this.state;
    let { datasource } = this.props;
    return !!checkedList.length && (checkedList.length < datasource.length);
  }

  checkIsAll = () => {
    let { checkedList } = this.state;
    let { datasource } = this.props;
    return checkedList.length === datasource.length;
  }

  render() {
    const { datasource, needAllCheck = true } = this.props;
    const { checkedList } = this.state;
    return (
      <div>
        {
          needAllCheck &&
          <div className="axg-checkbox-with-all">
            <Checkbox
              indeterminate={this.checkIsPartial()}
              onChange={this.onCheckAllChange}
              checked={this.checkIsAll()}
            >全部</Checkbox>
          </div>
        }
        <CheckboxGroup options={datasource} value={checkedList} onChange={this.onChange} />
      </div>
    );
  }
}
