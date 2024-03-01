import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history/cjs/history'

import { Provider } from 'react-redux'

import store from './redux/store'

import StylesLoader from './stylesLoader'

import Localization from './localization'
import Router from './router'
import * as serviceWorker from './serviceWorker'

// mocking api
import 'services/axios/fakeApi'

// middlewared
const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <StylesLoader>
      <Localization>
        <Router history={history} />
      </Localization>
    </StylesLoader>
  </Provider>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
export { store, history }
