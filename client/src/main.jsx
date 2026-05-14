import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useDispatch, useSelector } from "react-redux";
import reduxStore from "./redux";
import { BrowserRouter } from "react-router-dom";
import * as actions from "./store/actions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const { store, persistor } = reduxStore();

const AppInit = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      isLoggedIn && dispatch(actions.getCurrent());
    }, 100);
    return () => clearTimeout(timer);
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(actions.getPrices());
    dispatch(actions.getAreas());
    dispatch(actions.getProvinces());
    dispatch(actions.getFeatures());
  }, [dispatch]);

  return <>{children}</>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <AppInit>
            <App />
          </AppInit>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
