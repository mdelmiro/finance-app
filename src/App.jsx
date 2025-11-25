import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Entries from './pages/Entries';
import Exits from './pages/Exits';
import Debts from './pages/Debts';
import Subscriptions from './pages/Subscriptions';
import Goals from './pages/Goals';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/entries" element={
          <PrivateRoute>
            <MainLayout>
              <Entries />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/exits" element={
          <PrivateRoute>
            <MainLayout>
              <Exits />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <MainLayout>
              <Categories />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/debts" element={
          <PrivateRoute>
            <MainLayout>
              <Debts />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/subscriptions" element={
          <PrivateRoute>
            <MainLayout>
              <Subscriptions />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/accounts" element={
          <PrivateRoute>
            <MainLayout>
              <Accounts />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/goals" element={
          <PrivateRoute>
            <MainLayout>
              <Goals />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Router>
  );
}

export default App;
