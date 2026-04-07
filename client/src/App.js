import { Routes, Route } from "react-router-dom";
import { Home, Login, Rental, HomePage, DetailPost } from "./containers/Public";
import { path } from "./utils/constant";

function App() {
  return (
    <div className=" bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path="*" element={<HomePage />} />
          <Route path={path.HOME__PAGE} element={<HomePage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.NHA_NGUYEN_CAN} element={<Rental />} />
          <Route path={path.CAN_HO_CHUNG_CU} element={<Rental />} />
          <Route path={path.CAN_HO_MINI} element={<Rental />} />
          <Route path={path.CAN_HO_DICH_VU} element={<Rental />} />
          <Route path={path.O_GHEP} element={<Rental />} />
          <Route path={path.MAT_BANG} element={<Rental />} />
          <Route path={"chi-tiet/*"} element={<DetailPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
