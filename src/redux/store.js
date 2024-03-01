import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history/cjs/history'
import rootReducer from './reducers'

const history = createBrowserHistory()
const store = createStore(rootReducer(history), applyMiddleware(thunk))
export default store
