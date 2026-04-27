import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import reduxStore from "./redux";
import { BrowserRouter } from "react-router-dom";
import * as actions from "./store/actions";

const { store, persistor } = reduxStore();

const AppInit = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      isLoggedIn && dispatch(actions.getCurrent());
    }, 1000);
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(actions.getPrices());
    dispatch(actions.getAreas());
    dispatch(actions.getProvinces());
  }, [dispatch]);

  return <>{children}</>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <AppInit>
          <App />
        </AppInit>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
