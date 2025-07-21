import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Login from "./components/Login"
import Home from "./components/Home"
import EditUnidade from "./components/EditUnidade";
import Users from "./components/Users";
import EditUser from "./components/EditUser"
import Locais from "./components/Locais"
import EditLocal from "./components/EditLocal"
import AddUnidade from "./components/AddUnidade"
import AddLocal from './components/AddLocal';
import AddUser from './components/AddUser';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/admin/home" element={<Home/>}/>
          <Route path="/admin/unidade/edit/:unidade/:id" element={<EditUnidade/>}/>
          <Route path="/admin/unidade/users/:unidade/:id" element={<Users/>}/>
          <Route path="/admin/unidade/user/edit/:id/:userName" element={<EditUser/>}/>
          <Route path="/admin/unidade/locais/:unidade/:id" element={<Locais/>}/>
          <Route path="/admin/unidade/local/edit/:id/:localName" element={<EditLocal/>}/>
          <Route path="/admin/unidade/add" element={<AddUnidade/>}/>
          <Route path="/admin/unidade/local/add/:id" element={<AddLocal/>}/>
          <Route path="/admin/unidade/user/add/:id" element={<AddUser/>}/>
          <Route path="*" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
