import UserLaout from "./layout/user/UserLaout";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from "./layout/adminLayout/AdminLayout";
import Provider from './state/Provider';
import AdminProvider from "./state/AdminProvider";
import AdminLogin from "./views/adminLogin/AdminLogin";


function App() {

  if(window.location.pathname.startsWith('/admin'))
    return(
      <>
        <AdminProvider>
          {sessionStorage.getItem('adminLogedIn') ? 
            <AdminLayout />
            : 
            <AdminLogin />
          }
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light"/>
        </AdminProvider>
      </>
    )
  else {
        return (
          <>
              <Provider>
                <div className="hello">
                <UserLaout/>
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover theme="light"/>
                </div>
                <div className="hellox">
                <iframe src="http://localhost:3000" width="360" height="700"></iframe>
                </div>
              </Provider>
              </>
            );
  }
}

export default App;
