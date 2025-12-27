
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
        Analyze Smart. Decide Better.
      </h1>
      <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
        Check-U uses advanced AI to analyze your text, data, or resumes instantly. 
        Get professional insights, data trends, and smart suggestions in seconds.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className="px-8 py-4 bg-[#5850ec] hover:bg-[#4f46e5] text-white rounded-xl text-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/30"
        >
          Start Analysis Tool
        </button>
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-lg font-semibold transition-all"
        >
          View Past Results
        </button>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <div className="p-8 bg-[#161b2c] rounded-2xl border border-gray-800 text-left">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Resume Analysis</h3>
          <p className="text-gray-400">Match your resume against job descriptions to see how you rank and where you can improve.</p>
        </div>
        <div className="p-8 bg-[#161b2c] rounded-2xl border border-gray-800 text-left">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/center" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Data Insights</h3>
          <p className="text-gray-400">Upload CSVs or tables to get instant statistics, trend visualizations, and pattern detection.</p>
        </div>
        <div className="p-8 bg-[#161b2c] rounded-2xl border border-gray-800 text-left">
          <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Smart Suggestions</h3>
          <p className="text-gray-400">AI-driven predictions and actionable advice based on the data you provide.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
