// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/Home.jsx';
import StudentsList from './components/StudentsList.jsx';

import AddStudent from './components/AddStudent.jsx';
import DisciplineDashboard from './components/DisciplineDashboard.jsx';
import StudentMaterialsCheck from './components/MaterialCheck.jsx';
import MaterialsList from './components/MaterialsList.jsx'
import AllStudentsMaterialsView from './components/AllStudentsMaterialsView.jsx';
import DirAllStudensMaterialsMaterialsView from './components/Director/DirAllStudentsMaterialsView.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import ResetPassword from './components/ResetPassword.jsx'
import { AuthProvider } from './context/AuthContext'; // adjust path if AuthContext.jsx lives elsewhere
import DirectorDisciplineDashboard from './components/Director/DirectorOfDisplineDashboard.jsx';
import DirStudentsList from './components/Director/DirAllStudentsList.jsx';
import DirMaterialsList from './components/Director/DirAllMaterials.jsx';
import AdminUsersPortal from './components/Admin/AdminUsersPortal.jsx';



function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        {/* NAVBAR */}

        

        {/* MAIN CONTENT - Forced to full width via CSS */}
        <main className="app-content">
          <Routes>
            {/* ===== PUBLIC ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/Studentlist" element={< StudentsList/>} />
            <Route path="/DirStudentlist" element={< DirStudentsList/>} />
            <Route path="/DirMaterialslist" element={< DirMaterialsList/>} />
            <Route path="/CreateStudent" element={< AddStudent/>} />
            <Route path="/MaterialsList" element={< MaterialsList/>} />
            <Route path="/DisDashboard" element={< DisciplineDashboard/>} />
            <Route path="/AllStuMat" element={< AllStudentsMaterialsView/>} />
            <Route path="/DirAllStuMate" element={< DirAllStudensMaterialsMaterialsView/>}/>
            <Route path="/MaterialsTable" element={< StudentMaterialsCheck/>} />
            <Route path="/Login" element={ <Login/>} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/dirdispdashbo" element={<DirectorDisciplineDashboard/>}/>
            <Route path="/resetpass" element={<ResetPassword/>}/>
            <Route path="/Adminportal" element={<AdminUsersPortal/>}/>

   
          </Routes>
        </main>

        {/* FOOTER */}
        {/* <Footer /> */}
      </div>
    </AuthProvider>
  );
}

export default App;