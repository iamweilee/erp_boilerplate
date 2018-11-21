import React, {PropTypes} from 'react';
import {Card} from 'antd';
import {transform} from 'common/utils';

class DataCard extends React.Component {

  formatNumber = (num) => {
    if (isNaN(num)) {
      throw new TypeError("num is not a number");
    }

    var groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec("" + num),
      mask = groups[1],                       //符号位
      integers = (groups[2] || "").split(""), //整数部分
      decimal = groups[3] || "",              //小数部分
      remain = integers.length % 3;

    var temp = integers.reduce(function (previousValue, currentValue, index) {
      if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
        return previousValue + currentValue + ",";
      } else {
        return previousValue + currentValue;
      }
    }, "").replace(/\,$/g, "");
    return mask + temp + decimal;
  }

  render = () => {
    const { detail, title } = this.props;
    return (
      <Card className="data-card" title={title} style={{padding: '0 10px', marginBottom: 10}}>
        {
          detail.map(item =>
            <div className="data-card-item" style={{width: 200, height: 160, display: 'inline-block', textAlign: 'center'}}>
              <p className="data-card-item-value" style={{ fontSize: 32, lineHeight: 3 }}>{this.formatNumber(item.value || '0')}</p>
              <p className="data-card-item-label" style={{ }}>{item.label}</p>
            </div>
          )
        }
      </Card>
    )
  }
}

export default DataCard;
