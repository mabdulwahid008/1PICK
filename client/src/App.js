import UserLaout from "./layout/user/UserLaout";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./layout/adminLayout/AdminLayout";
import Provider from './state/Provider';
import AdminProvider from "./state/AdminProvider";
import AdminLogin from "./views/adminLogin/AdminLogin";
import PcLayout from "./layout/pcLayout/PcLayout";


function App() {

  if (window.location.pathname.startsWith('/admin'))
    return (
      <>
        <AdminProvider>
          {sessionStorage.getItem('adminLogedIn') ?
            <AdminLayout />
            :
            <AdminLogin />
          }
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
        </AdminProvider>
      </>
    )
  else {
    return (
      <>
        <Provider>
          <div className="mobile-layout">
            <UserLaout />
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light" />
          </div>
          <PcLayout url="http://localhost:3000" />
        </Provider>
      </>
    );
  }
}

export default App;
