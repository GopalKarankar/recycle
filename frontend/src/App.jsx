import React from 'react';
import Dashboard from './components/Dashboard';
import  TableSort  from './components/TableSort';
import {  Routes, Route } from "react-router-dom";
import EvaluationTable from './components/TableEvaluations';
import RankingTable from './components/TableRanking';
import UsersTable from './components/TableSort';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';

const App = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        {/* Parent Route */}
        <Route path="/" element={<Dashboard />}>

          {/* Nested Routes */}
          <Route path="/" element={<UsersTable /> } />
          <Route path="Profiles" element={<UsersTable /> } />
          <Route path="Evaluations" element={<EvaluationTable/> } />
          <Route path="Rankings" element={<RankingTable/>} />
          <Route path="Leaderboard" element={<Leaderboard />} />
        
        </Route>

          <Route path="/ProfileView" element={<Profile/>} />


      </Routes>

      {/* <Dashboard/> */}
      {/* <TableSort/> */}
      {/* <Example/> */}
    </div>
  );
}

export default App;
