import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import reducers from "./reducers";

const persistedState = sessionStorage.getItem("appstate")
  ? JSON.parse(sessionStorage.getItem("appstate"))
  : {};

const configureStore = () => {
  const middlewares = [];

  middlewares.push(thunk);

  if (process.env.REACT_APP_ACC_BOOK !== "production") {
    middlewares.push(createLogger());
  }

  return createStore(reducers, persistedState, applyMiddleware(...middlewares));
};

const store = configureStore();

store.subscribe(() => {
  sessionStorage.setItem("appstate", JSON.stringify(store.getState()));
});

export default store;

/*
window.addEventListener('storage',function(e){
   if(e.storageArea===sessionStorage){
     alert('change');
   } 
   // else, event is caused by an update to localStorage, ignore it
});
*/
