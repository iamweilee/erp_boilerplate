/**
 * 安心管
 * Copyright 2016 Baidu Inc. All rights reserved.
 *
 * @file 通用枚举数据
 */

import Enum from 'common/Enum';
import moment from 'moment';

/**
 * 发布状态
 *
 * @enum
 */
export const PublishStatus = new Enum(
    { alias: 'DRAFT', text: '草稿', value: 0 },
    { alias: 'PUBLISHED', text: '发布', value: 1 },
);

export const NewsKeyTypes = new Enum(
    { alias: 'TITLE', text: '标题', value: 0 },
    { alias: 'ID', text: 'ID', value: 1 },
);

/*
 * 日期格式
 *
 * @enum
 */
export const DateFormat = new Enum(
  { alias: 'DAY', text: '日', value: 'YYYY.MM.DD' },
  { alias: 'MONTH', text: '月', value: 'YYYY.MM' },
);


 /*
 * 审核状态
 *
 * @enum
 */
 export const ApplyValidateStatus = new Enum(
  { alias: 'READY', text: '待处理', value: 1 },
  { alias: 'PRE_FAIL', text: '不符合条件', value: 2 },
  { alias: 'FIRST_DOING', text: '初审中', value: 3 },
  { alias: 'FIRST_DENY', text: '初审驳回', value: 4 },
  { alias: 'SECOND_DOING', text: '复审中', value: 5 },
  { alias: 'SECOND_DENY', text: '复审驳回', value: 6 },
  { alias: 'SECOND_PASS_OUT', text: '复审通过，公示中', value: 7 },
  { alias: 'SECOND_PASS_OBJ', text: '复审通过，异议处理中', value: 8 },
  { alias: 'FINAL_DOING', text: '公示通过，终审中', value: 9 },
  { alias: 'FINAL_DENY', text: '终审驳回', value: 10 },
  { alias: 'FINAL_PASS_OUT', text: '终审通过，公示中', value: 11 },
  { alias: 'FINAL_PASS_OBJ', text: '终审通过，异议处理中', value: 12 },
  { alias: 'LOTTERY_READY', text: '轮候中', value: 13 },
  { alias: 'ALLOCATION_READY', text: '发放补贴/配租，待办理', value: 14 },
  { alias: 'ALLOCATION_FINISH', text: '已办理完毕', value: 15 },
  { alias: 'ALLOCATION_OUT', text: '已不符合条件，退租中', value: 16 }
);

 /*
 * 是否
 *
 * @enum
 */
 export const BooleanValue = new Enum(
  { alias: 'NO', text: '否', value: 0 },
  { alias: 'YES', text: '是', value: 1 },
);

// 账号主体信息
export const AccountSubject = new Enum(
  { alias: 'GOV_PERSON', text: '政府人员', value: 1 },
  { alias: 'OPE_PERSON', text: '运营人员', value: 2 },
)

// 账号冻结与否状态
export const AccountStatus = new Enum(
  { alias: 'NORMAL', text: '正常', value: 0 },
  { alias: 'FROZEN', text: '冻结', value: 1 },
)

// 申请发放类型
export const ApplyProvideTypeEnum = new Enum(
  { alias: 'LEASE_ALLOWANCE', text: '租赁补贴', value: 1 },
  { alias: 'ENTITY_RENT', text: '实物配租', value: 2 },
)

 /*
 * 审核状态
 *
 * @enum
 */
 export const AuditStatus = new Enum(
  { alias: 'READY', text: '待审核', value: 0 },
  { alias: 'SUCCESS', text: '审核通过', value: 1 },
  { alias: 'FAIL', text: '审核驳回', value: 2 }
);


/*
 * 经营模式
 *
 * @enum
 */
 export const BusinessModel = new Enum(
  { alias: 'FEDERAL', text: '分散式', value: 1 },
  { alias: 'CENTRAL', text: '集中式', value: 2 },
  { alias: 'MIXED', text: '混合经营', value: 3 }
);

/*
 * 出租模式
 *
 * @enum
 */
 export const RentType = new Enum(
  { alias: 'FULL', text: '整租', value: 1 },
  { alias: 'UNION', text: '合租', value: 2 },
);

/*
 * 信用免押
 *
 * @enum
 */
 export const CreditStatus = new Enum(
  { alias: 'OPEN', text: '支持', value: 1 },
  { alias: 'CLOSE', text: '不支持', value: 0 }
);

