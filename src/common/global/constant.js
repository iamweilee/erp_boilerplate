export const TIME_FORMAT_FE = 'YYYY-MM-DD';
export const TIME_FORMAT_BD = 'YYYY-MM-DD HH:mm:ss';

export const FormInputStyle = {
  largeWidth: 200,
  smallWidth: 128,
};

export const PAGE_URL_PREFIX = '/page';

export const TimeRangeDay = 30;
export const TimeRangeMonth = 1;

export const MENUS = [
    {
        name: '统计分析',
        key: 'statistics',
        auths: ['XSBN_SUMMARY_STATISTICS'],
        icon: 'desktop',
        children: [
          {
            name: '系统分析',
            key: 'statisticssystem',
            path: `${PAGE_URL_PREFIX}/statistics/system`,
            auths: ['XSBN_SUMMARY_STATISTICS']
          }
        ]
    },
    {
        name: '房源管理',
        key: 'housing',
        auths: [],
        icon: 'team',
        children: [
          {
            name: '房源审核',
            key: 'housingcertificate',
            path: `${PAGE_URL_PREFIX}/housing/certificate`,
            auths: [],
          }
        ]
    },
    {
        name: '权限管理',
        key: 'auth',
        auths: ['XSBN_ACCOUNT_LIST','XSBN_ROLE_LIST'],
        icon: 'team',
        children: [
          {
            name: '员工管理',
            key: 'authstaff',
            path: `${PAGE_URL_PREFIX}/auth/staff`,
            auths: ['XSBN_ACCOUNT_LIST'],
          }
        ]
    },
    {
        name: '资讯管理',
        key: 'notice',
        auths: ['XSBN_ARTICLE_ALL'],
        icon: 'book',
        children: [
          {
            name: '公示发布',
            key: 'noticelist',
            path: `${PAGE_URL_PREFIX}/notice/list`,
            auths: ['XSBN_ARTICLE_ALL']
          }
        ]
    },
    {
        name: '组件库',
        key: 'components',
        auths: [],
        icon: 'desktop',
        children: [
          {
            name: 'inlineRegion',
            key: 'componentsinlineRegion',
            path: `${PAGE_URL_PREFIX}/components/inlineRegion`,
            auths: []
          },
          {
            name: 'regionPane',
            key: 'componentsregionPane',
            path: `${PAGE_URL_PREFIX}/components/regionPane`,
            auths: []
          }
        ]
    },
];

export const APP_PREFIX = 'XSBN';

export const AUTHS = [
  {
    title: '角色管理',
    key: 'role',
    roles: [
      {
        value: 'XSBN_ROLE_LIST',
        label: '角色列表',
      },
      {
        value: 'XSBN_ROLE_DETAIL',
        label: '角色详情',
      },
      {
        value: 'XSBN_ROLE_ADD',
        label: '添加角色',
      },
      {
        value: 'XSBN_ROLE_EDIT',
        label: '编辑角色',
      },
      {
        value: 'XSBN_ROLE_DELETE',
        label: '删除角色',
      }
    ]
  },
  {
    title: '员工管理',
    key: 'staff',
    roles: [
      {
        value: 'XSBN_ACCOUNT_LIST',
        label: '员工列表'
      },
      {
        value: 'XSBN_ACCOUNT_DETAIL',
        label: '员工详情'
      },
      {
        value: 'XSBN_ACCOUNT_ADD',
        label: '添加员工'
      },
      {
        value: 'XSBN_ACCOUNT_EDIT',
        label: '编辑员工'
      },
      {
        value: 'XSBN_ACCOUNT_FROZEN',
        label: '冻结员工'
      },
      {
        value: 'XSBN_ACCOUNT_UNFROZEN',
        label: '解冻员工'
      },
      {
        value: 'XSBN_ACCOUNT_RESET_PASSWORD',
        label: '修改密码'
      }
    ]
  },
  {
    title: '公租房审批管理',
    key: 'public-rental',
    roles: [
      {
        value: 'XSBN_APPLY_LIST',
        label: '审批列表'
      },
      {
        value: 'XSBN_APPLY_DETAIL',
        label: '审批详情'
      },
      {
        value: 'XSBN_APPLY_UPDATE',
        label: '状态更新'
      },
      {
        value: 'XSBN_APPLY_DOWNLOAD',
        label: '申请表下载'
      },
      {
        value: 'XSBN_LOG_DETAIL',
        label: '日志查询'
      }
    ]
  },
  {
    title: '资讯管理',
    key: 'notice',
    value: 'XSBN_ARTICLE_ALL'
  },
  {
    title: '统计分析',
    key: 'statistic',
    value: 'XSBN_SUMMARY_STATISTICS'
  }
];

export const REGIONS = [
  {
      name: "景洪市",
      id: 2494,
      children: [
          {
              "initial": "D",
              "children": [
                  {
                      "id": 100014,
                      "name": "大渡岗茶场"
                  },
                  {
                      "id": 100008,
                      "name": "大渡岗乡"
                  }
              ]
          },
          {
              "initial": "G",
              "children": [
                  {
                      "id": 100013,
                      "name": "橄榄坝农场"
                  },
                  {
                      "id": 100001,
                      "name": "嘎洒镇"
                  }
              ]
          },
          {
              "initial": "J",
              "children": [
                  {
                      "id": 100011,
                      "name": "景洪农场"
                  },
                  {
                      "id": 100006,
                      "name": "景哈哈尼族乡"
                  },
                  {
                      "id": 100007,
                      "name": "景讷乡"
                  },
                  {
                      "id": 100010,
                      "name": "基诺山基诺族乡"
                  }
              ]
          },
          {
              "initial": "M",
              "children": [
                  {
                      "id": 100002,
                      "name": "勐龙镇"
                  },
                  {
                      "id": 100003,
                      "name": "勐罕镇"
                  },
                  {
                      "id": 100004,
                      "name": "勐养镇"
                  },
                  {
                      "id": 100012,
                      "name": "勐养农场"
                  },
                  {
                      "id": 100009,
                      "name": "勐旺乡"
                  }
              ]
          },
          {
              "initial": "P",
              "children": [
                  {
                      "id": 100005,
                      "name": "普文镇"
                  }
              ]
          },
          {
              "initial": "Y",
              "children": [
                  {
                      "id": 100000,
                      "name": "允景洪街道"
                  }
              ]
          }
      ]
  },
  {
      name: "勐海县",
      id: 2495,
      children: [
          {
              "initial": "B",
              "children": [
                  {
                      "id": 100024,
                      "name": "布朗山布朗族乡"
                  }
              ]
          },
          {
              "initial": "D",
              "children": [
                  {
                      "id": 100016,
                      "name": "打洛镇"
                  }
              ]
          },
          {
              "initial": "G",
              "children": [
                  {
                      "id": 100023,
                      "name": "格朗和哈尼族乡"
                  }
              ]
          },
          {
              "initial": "L",
              "children": [
                  {
                      "id": 100026,
                      "name": "黎明农场"
                  }
              ]
          },
          {
              "initial": "M",
              "children": [
                  {
                      "id": 100015,
                      "name": "孟海镇"
                  },
                  {
                      "id": 100017,
                      "name": "勐混镇"
                  },
                  {
                      "id": 100018,
                      "name": "勐遮镇"
                  },
                  {
                      "id": 100019,
                      "name": "勐满镇"
                  },
                  {
                      "id": 100020,
                      "name": "勐阿镇"
                  },
                  {
                      "id": 100021,
                      "name": "勐宋乡"
                  },
                  {
                      "id": 100022,
                      "name": "勐往乡"
                  }
              ]
          },
          {
              "initial": "X",
              "children": [
                  {
                      "id": 100025,
                      "name": "西定哈尼族布朗族乡"
                  }
              ]
          }
      ]
  },
  {
      name: "勐腊县",
      id: 2496,
      children: [
          {
              "initial": "G",
              "children": [
                  {
                      "id": 100058,
                      "name": "关累镇"
                  }
              ]
          },
          {
              "initial": "M",
              "children": [
                  {
                      "id": 100053,
                      "name": "勐捧镇",
                  },
                  {
                      "id": 100054,
                      "name": "勐满镇"
                  },
                  {
                      "id": 100055,
                      "name": "勐仑镇"
                  },
                  {
                      "id": 100057,
                      "name": "勐伴镇"
                  },
                  {
                      "id": 100062,
                      "name": "勐腊农场"
                  },
                  {
                      "id": 100063,
                      "name": "勐棒农场"
                  },{
                      "id": 100064,
                      "name": "勐满农场"
                  },
                  {
                      "id": 100065,
                      "name": "勐醒农场"
                  }
              ]
          },
          {
              "initial": "S",
              "children": [
                  {
                      "id": 100056,
                      "name": "尚勇镇"
                  }
              ]
          },
          {
              "initial": "X",
              "children": [
                  {
                      "id": 100060,
                      "name": "象明彝族乡"
                  }
              ]
          },
          {
              "initial": "Y",
              "children": [
                  {
                      "id": 100061,
                      "name": "瑶区瑶族乡"
                  },
                  {
                      "id": 100059,
                      "name": "易武乡"
                  }
              ]
          }
      ]
  }
];

export const PAGE_SIZE = 20;
export const PAGE_OPTIONS = ['10', '20', '30','40','50'];

export const IMAGE_THUMB_SIZE = '96x72';
export const IMAGE_COMMON_SIZE = '900x675';
export const MAX_IMAGE_NUMBER = 10;

export const EXCEL_UPLOAD_URL = '';
