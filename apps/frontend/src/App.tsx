import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home.page';
import Login from '@/pages/login.page';
import Signup from '@/pages/signup.page';
import ProtectedRoute from '@/components/util/RouteProtect';

import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
