import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import PassportForm from './components/PassportForm';
import PassportList from './components/PassportList';
import Navigation from './components/Navigation';

function App() {
  const [activeView, setActiveView] = useState<'form' | 'list'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeView === 'form' ? <PassportForm /> : <PassportList />}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;