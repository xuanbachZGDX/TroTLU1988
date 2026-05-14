import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Rental,
  HomePage,
  DetailPost,
  SearchDetail,
  Contact,
  Wishlist,
  ServicePrice,
  ForgotPassword,
  ResetPassword
} from "./containers/Public";
import { path } from "./utils/constant";
import {
  AdminDashboard,
  AdminManagePosts,
  AdminManageUsers,
  AdminManageContacts,
  CreatePost,
  ManagePost,
  EditAccount,
  SystemLayout,
  AdminGuard,
  Deposit,
  PaymentResult,
  TransactionHistory,
} from "./containers/System";
import ManageServicePrice from "./containers/System/ManageServicePrice";

import { useSelector } from "react-redux";
import { Loading, ScrollToTop } from "./components";

function App() {
  const { isLoading } = useSelector((state) => state.app);

  return (
    <div className="bg-primary relative">
      <ScrollToTop />
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-overlay-70 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />}>
          <Route index element={<HomePage />} />
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
          <Route path={path.DETAIL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path={path.CONTACT} element={<Contact />} />
          <Route path={path.TIN_DA_LUU} element={<Wishlist />} />
          <Route path={path.BANG_GIA} element={<ServicePrice />} />
          <Route path={path.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path="*" element={<HomePage />} />
        </Route>

        {/* Unified System Routes (User & Admin share the same layout) */}
        <Route path={`/${path.SYSTEM}`} element={<SystemLayout />}>
          <Route index element={<ManagePost />} />
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.MANAGE_POST} element={<ManagePost />} />
          <Route path={path.EDIT_ACCOUNT} element={<EditAccount />} />
          <Route path={path.MANAGE_SERVICE_PRICE} element={<ManageServicePrice />} />
          <Route path={path.DEPOSIT} element={<Deposit />} />
          <Route path={path.PAYMENT_RESULT} element={<PaymentResult />} />
          <Route path={path.TRANSACTION_HISTORY} element={<TransactionHistory />} />
        </Route>

        <Route path={`/${path.ADMIN}/${path.ADMIN_LOGIN}`} element={<Login />} />
        <Route path={`/${path.ADMIN}`} element={<AdminGuard><SystemLayout /></AdminGuard>}>
          <Route index element={<AdminDashboard />} />
          <Route path={path.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={path.ADMIN_POSTS} element={<AdminManagePosts />} />
          <Route path={path.ADMIN_USERS} element={<AdminManageUsers />} />
          <Route path={path.ADMIN_CONTACTS} element={<AdminManageContacts />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
