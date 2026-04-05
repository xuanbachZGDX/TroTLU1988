import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  RentalHouse,
  RentalApartment,
  RentalApartmentMini,
  RentalApartmentService,
  RentPremises,
  FindRoomate,
  HomePage,
  DetailPost,
} from "./containers/Public";
import { path } from "./utils/constant";

function App() {
  return (
    <div className=" bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path="*" element={<HomePage />} />
          <Route path={path.HOME__PAGE} element={<HomePage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.NHA_NGUYEN_CAN} element={<RentalHouse />} />
          <Route path={path.CAN_HO_CHUNG_CU} element={<RentalApartment />} />
          <Route path={path.CAN_HO_MINI} element={<RentalApartmentMini />} />
          <Route
            path={path.CAN_HO_DICH_VU}
            element={<RentalApartmentService />}
          />
          <Route path={path.O_GHEP} element={<FindRoomate />} />
          <Route path={path.MAT_BANG} element={<RentPremises />} />
          <Route path={"chi-tiet/*"} element={<DetailPost />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
