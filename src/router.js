import React from 'react';
import {
  Router,
  Route,
  IndexRedirect,
  Redirect
} from 'dva/router';

// import style2 from './biz/views/style2';
import frame from './biz/views/frame';
import NotFoundPage from './biz/views/notFound';
import SystemWrongErrorPage from './biz/views/systemError';

import logon from './biz/views/logon/index';

import certificateList from './biz/views/certificate/list';
import noticeList from './biz/views/notice/list';
import staffList from './biz/views/staff/list';

import system from './biz/views/statistics/system';

import inlineRegion from './biz/views/components/inlineRegion';
import regionPane from './biz/views/components/regionPane';

export default function ({ history }) { // eslint-disable-line
    return (<Router history={history}>
    <Route path="/">
      <IndexRedirect to="page" />
      <Route path="page" component={frame}>
        <IndexRedirect to="statistics" />
        <Route path="housing">
          <IndexRedirect to="certificate" />
          <Route path="certificate" component={certificateList} />
        </Route>
        <Route path="auth">
          <IndexRedirect to="staff" />
          <Route path="staff" component={staffList} />
        </Route>
        <Route path="notice">
          <IndexRedirect to="list" />
          <Route path="list" component={noticeList} />
        </Route>
        <Route path="statistics">
          <IndexRedirect to="system" />
          <Route path="system" component={system} />
        </Route>
        <Route path="components">
          <IndexRedirect to="inlineRegion" />
          <Route path="inlineRegion" component={inlineRegion} />
          <Route path="regionPane" component={regionPane} />
        </Route>
      </Route>
      <Route path="logon" component={logon}/>
      <Route path="systemError" component={SystemWrongErrorPage}/>
      <Route path='notfound' component={NotFoundPage} />
    </Route>
    <Redirect from='*' to='/notfound' />
  </Router>);
}
