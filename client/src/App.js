import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Rental,
  HomePage,
  DetailPost,
  SearchDetail,
} from "./containers/Public";
import { path } from "./utils/constant";
import { CreatePost, System } from "./containers/System";
import * as actions from "./store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    setTimeout(() => {
      isLoggedIn && dispatch(actions.getCurrent());
    }, 1000);
  }, [dispatch, isLoggedIn]);
  return (
    <div className=" bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path="*" element={<HomePage />} />
          <Route path={path.HOME__PAGE} element={<HomePage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.PHONG_TRO} element={<Rental />} />
          <Route path={path.NHA_NGUYEN_CAN} element={<Rental />} />
          <Route path={path.CAN_HO_CHUNG_CU} element={<Rental />} />
          <Route path={path.CAN_HO_MINI} element={<Rental />} />
          <Route path={path.CAN_HO_DICH_VU} element={<Rental />} />
          <Route path={path.O_GHEP} element={<Rental />} />
          <Route path={path.MAT_BANG} element={<Rental />} />
          <Route path={path.SEARCH} element={<SearchDetail />} />
          <Route
            path={path.DETAIL_POST__TITLE__POSTID}
            element={<DetailPost />}
          />
          <Route path={"chi-tiet/*"} element={<DetailPost />} />
        </Route>

        <Route path={path.SYSTEM} element={<System />}>
          <Route index element={<CreatePost />} />
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.MANAGE_POST} element={<CreatePost />} />
          <Route path={path.PROFILE} element={<CreatePost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
