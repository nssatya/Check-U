
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../constants';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#0b0f1a] border-b border-gray-800 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={() => navigate(ROUTES.LANDING)}
      >
        <div className="w-8 h-8 bg-[#5850ec] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          U
        </div>
        <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
      </div>

      <div className="flex items-center space-x-8">
        <button 
          onClick={() => navigate(ROUTES.LANDING)}
          className={`text-sm font-medium hover:text-indigo-400 transition-colors ${isActive(ROUTES.LANDING) ? 'text-indigo-400' : 'text-gray-300'}`}
        >
          Home
        </button>
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className={`text-sm font-medium hover:text-indigo-400 transition-colors ${isActive(ROUTES.ANALYZER) ? 'text-indigo-400' : 'text-gray-300'}`}
        >
          Analysis Tool
        </button>
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className={`text-sm font-medium hover:text-indigo-400 transition-colors ${isActive(ROUTES.DASHBOARD) ? 'text-indigo-400' : 'text-gray-300'}`}
        >
          History
        </button>
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className="px-4 py-2 bg-[#5850ec] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-medium transition-all transform active:scale-95 hidden sm:block"
        >
          Try it Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
