import React, { PropTypes } from 'react';
import { Button, Table, Icon } from 'antd';
import EditableCell from 'components/common/editableCell';
import _ from 'underscore';

export default class TableFormField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      datasource: [...props.datasource],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      datasource: [...nextProps.datasource],
    });
  }

  onCellChange = (index, key) => {
    return (val) => {
      const datasource = [...this.state.datasource];
      datasource[index][key] = val;
      this.setState({
        datasource: [...datasource],
      }, this.fireChange);
    };
  }

  fireChange = () => {
    this.props.onChange({ value: this.state.datasource, key: this.props.datasourceKey });
  }

  handleDelete = (record) => {
    let { datasource } = this.state;
    let newDatasource = _.filter(datasource, ({key}) => key !== record.key);
    this.setState({
      datasource: [...newDatasource],
    }, this.fireChange);
  }

  handleAdd = () => {
    let { datasource } = this.state;
    let index = datasource.length;
    let newLine = { ...this.props.defaultNewLine(index) };
    let state = {
      ...this.state,
      datasource: [...datasource, ...[newLine]]
    }
    this.setState(state, this.fireChange);
  }

  buildRows = (columns, actionFixed) => {
    let totalWidth = columns.reduce(
      (totalWidth, { width }) => {
        totalWidth += width || 100;
        return totalWidth;
      },
      70
    );
    let rowColumns = columns.map(({ title, type, key, datasource, width}) => {
      return {
        title,
        dataIndex: key,
        width,
        render: (value, record, index) => (
          <EditableCell
            cellType = { type }
            datasource = { datasource }
            value = { value }
            onChange = {this.onCellChange(index, key)}
            style={{ width }}
          />
        ),
      };
    });

    let actionColumn = {
      title: '操作',
      width: 100,
      key: 'action',
      //fixed: 'right',
      render: (text, record, index) => (
        <Button onClick={
          (e) => {
            this.handleDelete(record);
          }
        }>删除</Button>),
    };

    if (actionFixed) {
      actionColumn.fixed = 'right';
    }
    rowColumns.push(actionElem);
    return { rowColumns, totalWidth };
  }

  render() {
    let { columns, actionTitle, actionFixed } = this.props;
    let { datasource } = this.state;
    let { rowColumns, totalWidth } = this.buildRows(columns, actionFixed);
    let specialAttribute = {};

    return (
      <div>
        <Button
          type="primary" className="button-like-link" onClick={ this.handleAdd } style={{ marginBottom: 15 }}>
          <Icon type="plus-square-o" style={{fontSize: 14}}/>
          {actionTitle}
        </Button>
        <Table
          columns = { rowColumns }
          dataSource = {datasource}
          pagination = { false }
          rowKey = "key"
          bordered
          scroll={{ x: '90%' }}
        />
      </div>
    );
  }
}

TableFormField.propTypes = {};
