/**
 * 列表结果状态区基类
 */
import React, { PropTypes } from 'react';

export default class Page extends React.Component {

  render() {

    let { isSearch, list, listEmptyTitle } = this.props;

    let isLoading = !list;

    let isListEmpty = (list && list.length === 0);

    let text;
    let imageClassName;

    if (isLoading) {
      text = '数据加载中。。。';
      imageClassName = 'search-empty';
    }
    else if (isSearch && isListEmpty) {
      text = '没有找到您想要的搜索结果哦~';
      imageClassName = 'search-empty';
    }
    else if (!isSearch && isListEmpty) {
      text = listEmptyTitle || '您还没有添加相关数据哦~';
      imageClassName = 'list-empty';
    }

    return (
      <div className="inner-warn-wrapper-content">
        <div className="warn-wrapper">
          <div className={`warn-image ${imageClassName}`} />
          <div className="warn-label">{text}</div>
        </div>
      </div>
    );
  }
}
