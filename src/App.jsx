import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Labels from './pages/Labels';
import Archive from './pages/Archive';
import Trash from './pages/Trash';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/labels" element={<Labels />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/trash" element={<Trash />} />
          {/* Aquí se agregarán las rutas de Login y Registro (Parte 2) */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
