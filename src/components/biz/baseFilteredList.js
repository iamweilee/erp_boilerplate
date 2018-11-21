/**
 * 列表视图基类
 */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Icon } from 'antd';

import permission from 'common/permission';
import { createPageConfig } from 'common/utils/transform';
import { rowClassName } from 'common/utils/transform';

import ListResultStatus from './listResultStatus';

import "./list.less";

class BaseFilteredList extends React.Component {

  constructor() {
    super();
    this.state = { selectedRowKeys: [], selectedRows: [] };
  }

  componentWillMount = () => {
    const { auths } = this.props[this.module];
    if (permission.isAllow(auths)) {
      this.props.dispatch({
        type: `${this.module}/updateAuth`,
        payload: true
      });
      this.props.dispatch({
        type: `${this.module}/getData`,
      });
    }
    else {
      this.props.dispatch({
        type: `${this.module}/updateAuth`,
        payload: false
      });
    }
  }

  searchByPage = (fields) => {
    this.list({ ...fields, });
  }

  search = (fields) => {
    // 修改搜索状态
    let module = this.module;
    this.props.dispatch({
      type: `${module}/setToSearch`,
    });
    fields.pageNo = 1;
    this.list({ ...fields, });
  }

  clear = (fields) => {
    // 修改搜索状态
    let module = this.module;
    // 清空数据
    let emptyFields = Object.keys(fields).reduce(
      (emptyFields, key) => {
        emptyFields[key] = null;
        return emptyFields;
      },
      {}
    );
    this.list({ ...emptyFields, });
    this.props.dispatch({
      type: `${module}/clearSearch`,
    });
  }

  list = (searchParams) => {
    let module = this.module;
    this.props.dispatch({
      type: `${module}/paramsChange`,
      payload: searchParams,
    });

    this.props.dispatch({
      type: `${module}/list`
    });
  }

  toCreate = () => {
    let module = this.module;
    this.props.dispatch({
      type: `${module}/toCreate`
    });
  }

  /**
   * 筛选条件响应事件
   * @param fieldValues，筛选字段参数对象，形如 { name: 'jack', applyStatus: 1 }
   * @param autoSubmit 是否自动提交，来刷新列表.
   */
  onSearchChange = (fieldValues, autoSubmit) => {
    let module = this.module;
    if (autoSubmit) {
      // reset页码
      fieldValues.pageNo = 1;
      this.search(fieldValues);
    }
    else {
      this.props.dispatch({
        type: `${module}/paramsChange`,
        payload: fieldValues,
      });
    }
  }

  /** 表单使用 */
  closeForm = () => {
    this.popDrawer({id: null, status: {showForm: false }})();
  }

  showForm = () => {
    this.popDrawer({id: null, status: { showForm: true }})();
  }


  /** 表单使用 */
  closeDetail = () => {
    this.popDetailDrawer({id: null, status: {showDetail: false }})();
  }

  showDetail = () => {
    this.popDetailDrawer({id: null, status: { showDetail: true }})();
  }


  onEdit = (id) => {
    return this.popDrawer({id, status: { showForm: true }});
  }

  onRead = (id) => {
    return this.popDetailDrawer({id, status: { showDetail: true }});
  }

  onDelete = (id) => {
    return () => {
      confirm({
        title: '确认删除么?',
        content: `点击确认，删除此${this.entityDesc}！`,
        onOk: () => {
          this.props.dispatch({
            type: `${this.module}/delete`,
            payload: id
          });
        },
        onCancel() {},
      });
    }
  }

  saveSuccess = () => {
    this.props.dispatch({
      type: `${this.module}/getData`
    });
    this.closeForm();
  }

  /** 通用的drawer */
  popDrawer = ({ id, status }) => {
    return () => {
      this.props.dispatch({
        type: `${this.module}/updateTargetId`,
        payload: id
      });

      this.props.dispatch({ type: `${this.module}/showOrHideDrawerPanel`, payload: { ...status } });
    }
  }

  /** 通用的drawer */
  popDetailDrawer = ({ id, status }) => {
    return () => {
      this.props.dispatch({
        type: `${this.module}/updateTargetId`,
        payload: id
      });

      this.props.dispatch({ type: `${this.module}/showOrHideDetailDrawerPanel`, payload: { ...status } });
    }
  }

  /** 筛选区 */
  buildFilter = (FilterFormWrapper, extendParams = {}) => {
    const { searchParams, isSearch } = this.props[this.module];

    const filterProps = {
      ...searchParams,
      ...extendParams,
      isSearch,
      onSubmit: this.search,
      onClear: this.clear,
      onChange: this.onSearchChange
    };
    return (
      <div className="list-filter-form">
        <FilterFormWrapper {...filterProps}/>
      </div>
    );
  }

  onUnselectItem = (key) => {
    return () => {
      const { selectedRowKeys = [], selectedRows = []} = this.state;
      let targetIndex = selectedRowKeys.findIndex(item => item === '' + key);
      let leftRowKeys = selectedRowKeys.filter(item => item !== '' + key);
      let leftRows = selectedRows.filter((item, index) => index !== targetIndex);
      this.setState({ selectedRowKeys: leftRowKeys, selectedRows: leftRows });
    }
  }

  onRowSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({ selectedRows, selectedRowKeys });
  }

  buildResultPane = (batchResultKey) => {
    const { selectedRows = [], selectedRowKeys = []} = this.state;
    return selectedRows.length > 0 && <div className="list-multi-select-result">选择结果：{ selectedRows.map((row, index) => <div className="list-multi-select-result-item">
      <span>{ row[batchResultKey] || '' }</span><Icon type="close" onClick={this.onUnselectItem(selectedRowKeys[index])}/>
    </div>) }</div>;
  }

  /** 结果区 */
  buildList = ({columns, noPagination, needBatch, batchResultKey}) => {
    const model = this.props[this.module];
    const { list } = model;
    const pageConfig = createPageConfig(model, this.searchByPage);

    const { selectedRowKeys = []} = this.state;

    const rowSelection = {
      onChange: this.onRowSelectChange,
      selectedRowKeys
    };

    const listProps = {
      bordered: true,
      dataSource: list,
      pagination: noPagination ? fasle : pageConfig,
      rowSelection: needBatch ? rowSelection : false,
      columns,
      rowClassName
    }

    if (list && list.length) {
      return (<div className="list-result">
        { needBatch && this.buildResultPane(batchResultKey) }
        <Table {...listProps} />
      </div>);
    }
    else {
      return <ListResultStatus list={ list } isSearch={false} listEmptyTitle={`还没有任何${this.entityDesc}哦~`} />;
    }
  }

  /** drawer弹层 */
  buildDrawer = (DrawerForm) => {
    const { showForm, targetId, drawerKey } = this.props[this.module];
    const drawerProps = {
      key: drawerKey,
      visible: showForm,
      onCancel: this.closeForm,
      onSaveSuccess: this.saveSuccess,
      targetId
    };
    return <DrawerForm {...drawerProps}/>
  }
    /** drawer弹层 */
  buildDetailDrawer = (DrawerDetail) => {
    const { showDetail, targetId, detailDrawerKey } = this.props[this.module];
    const drawerProps = {
      key: detailDrawerKey,
      visible: showDetail,
      onCancel: this.closeDetail,
      targetId
    };
    return <DrawerDetail {...drawerProps}/>
  }

  render = () => {
    const model = this.props[this.module];
    const { allowed } = model;
    if (allowed === undefined) {
      return (<div></div>);
    }
    else if (allowed) {
      const { searchParams, isSearch, list, crumbList, showForm, targetId, drawerKey } = model;
      let containerProps = { crumbList, containerClass: 'list-page' };
      return this.doRender({containerProps});
    }
    else {
      return (
        <div className="warn-wrapper-content">
          <div className="warn-wrapper">
            <div className="warn-image unauth" />
            <div className="warn-label">哎呀，您没有访问该页面的权限~</div>
          </div>
        </div>
      );
    }
  }
}

export default BaseFilteredList;
