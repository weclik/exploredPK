import { createStore, combineReducers, applyMiddleware } from "redux";
import userReducer from "./reducers/userReducer";
import spotsReducer from "./reducers/spotsReducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  userReducer: userReducer,
  spotsReducer: spotsReducer,
});

export const store = () => createStore(rootReducer, applyMiddleware(thunk));
