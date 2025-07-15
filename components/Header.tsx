
import React from 'react';
import type { AppView } from '../types';

interface HeaderProps {
  setCurrentView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentView }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentView('DASHBOARD')}
          >
            <div className="bg-sky-600 p-2 rounded-lg">
                <i className="fa-solid fa-balance-scale text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 hidden sm:block">Lavoro Onesto</h1>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentView('DASHBOARD')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              Home
            </button>
             <button
              onClick={() => setCurrentView('ADD_REPORT_CHOICE')}
              className="px-3 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors shadow"
            >
              Segnala
            </button>
            <button
              onClick={() => setCurrentView('RESOURCES')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors"
            >
              Risorse Utili
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;