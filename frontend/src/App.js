import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Room from './pages/Room/Room';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/room/:sessionId" element={<Room />} />
      </Routes>
    </Router>
  );
}
