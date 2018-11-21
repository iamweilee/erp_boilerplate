import dva from 'dva';
import { browserHistory } from 'dva/router';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 1. Initialize
const app = dva({
  history: browserHistory,
});

window.apps = app;

app.use(createLoading());

// 2. Model
// frame
app.model(require('./biz/models/frame'));

app.model(require('./biz/models/logon'));


app.model(require('./biz/models/certificate/list'));
app.model(require('./biz/models/certificate/detail'));

app.model(require('./biz/models/staff/list'));
app.model(require('./biz/models/staff/edit'));

app.model(require('./biz/models/notice/list'));
app.model(require('./biz/models/notice/edit'));

app.model(require('./biz/models/statistics/system'));

app.router(require('./router'));

// 4. Start
app.start('#app');
