import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

import Login from "./components/Login"

import Unidades from "./components/admin/Unidades"
import EditUnidade from "./components/admin/EditUnidade";
import Users from "./components/admin/Users";
import EditUser from "./components/admin/EditUser"
import Locais from "./components/admin/Locais"
import EditLocal from "./components/admin/EditLocal"
import AddUnidade from "./components/admin/AddUnidade"
import AddLocal from './components/admin/AddLocal';
import AddUser from './components/admin/AddUser';

import Triagem from './components/triagem/Triagem';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>

          <Route path="/admin/home" element={<Unidades/>}/>
          <Route path="/admin/unidade/edit/:unidade/:id" element={<EditUnidade/>}/>
          <Route path="/admin/unidade/users/:unidade/:id" element={<Users/>}/>
          <Route path="/admin/unidade/user/edit/:id/:userName" element={<EditUser/>}/>
          <Route path="/admin/unidade/locais/:unidade/:id" element={<Locais/>}/>
          <Route path="/admin/unidade/local/edit/:id/:localName" element={<EditLocal/>}/>
          <Route path="/admin/unidade/add" element={<AddUnidade/>}/>
          <Route path="/admin/unidade/local/add/:id" element={<AddLocal/>}/>
          <Route path="/admin/unidade/user/add/:id" element={<AddUser/>}/>

          <Route path="/triagem/unidade/:id" element={<Triagem/>}/>

          <Route path="*" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
