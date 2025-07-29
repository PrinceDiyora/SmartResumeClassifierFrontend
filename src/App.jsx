// In src/App.jsx
import HomePage from './components/HomePage';
import ResumeBuilder from './components/ResumeBuilder';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/builder" element={<ResumeBuilder />} />
      {/* Add other routes here */}
    </Routes>
  );
}

export default App;