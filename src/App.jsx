import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Labels from './pages/Labels';
import Archive from './pages/Archive';
import Trash from './pages/Trash';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Notes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute>
                <Layout>
                  <Reminders />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/labels" element={
              <ProtectedRoute>
                <Layout>
                  <Labels />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/archive" element={
              <ProtectedRoute>
                <Layout>
                  <Archive />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/trash" element={
              <ProtectedRoute>
                <Layout>
                  <Trash />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </NotesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;