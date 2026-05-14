import rootReducer from "./store/reducers/rootReducer";
import { createStore, applyMiddleware } from "redux";
import { persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const reduxStore = () => ({ store, persistor });

export { store, persistor };
export default reduxStore;
