import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/homepage";
import Login from "./pages/loginpage";
import Signup from "./pages/signuppage";
import {useDispatch,useSelector} from 'react-redux'
import { useEffect } from "react";
import { checkAuth } from "./authSlice"; 
import AdminPanel from "./components/adminpanel";
import ProblemPage from "./pages/problempage";
import Admin from "./pages/adminpage"
import AdminDelete from "./components/admindelete";
import AdminUpdate from "./components/adminUpdate";
 function App(){
// yahan check ki user legit hai ki nahi agar nahi toh login ya signup page nahi tph jis page wo jaana chaa raha hai usii page pe 
const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);
const dispatch=useDispatch();

useEffect(()=>{
dispatch(checkAuth());
},[dispatch]); // dispatch ek constant hai toh ek baar hi call karega 



if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }


  return(
    <>
    <Routes>
      <Route path="/" element={isAuthenticated ?<HomePage></HomePage>:<Navigate to ="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated ?<Navigate to="/"/>:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin></Admin> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate></AdminUpdate> : <Navigate to="/" />} />
    </Routes>
    </>
  )
}

export default App;
