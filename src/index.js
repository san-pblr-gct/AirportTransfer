
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, browserHistory } from 'react-router';
import routes from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './containers/App';
import AdminBoardContainer from './containers/AdminBoard/ABSearchContainer';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/bouncyflip.css';
import LoginContainer from './containers/LoginContainer';
import configureStore from './store/configureStore';
import { loginSuccess } from './actions/loginActions';

const store = configureStore();

if (sessionStorage.getItem("user") !== null) {
    store.dispatch(loginSuccess(JSON.parse(sessionStorage.getItem("user"))));
}
render(
    <Provider store={store}>
        <Router store={store} history={browserHistory}>
            <Route store={store} path="/" component={App} />
            <Route store={store} path="/airporttransfer" component={App} />
            <Route store={store} path="/adminboard" component={AdminBoardContainer} />
            <Route path="/login" component={LoginContainer} />
        </Router>
    </Provider>,
    document.getElementById('app')
);

$('#loading').hide();
//drag drop

