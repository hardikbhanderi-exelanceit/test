import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DynamicPage from './pages/DynamicPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  const [pageSections, setPageSections] = useState([]);

  return (
    <div className="app">
      <Header sections={pageSections} />
      <Routes>
        <Route path="/" element={<DynamicPage slug="home" onSectionsLoad={setPageSections} />} />
        <Route path="/:slug" element={<DynamicPage onSectionsLoad={setPageSections} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
