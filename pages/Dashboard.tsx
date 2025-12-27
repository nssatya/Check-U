
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '../types';
import { ROUTES } from '../constants';

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rawHistory = localStorage.getItem('analysis_history') || '[]';
    setHistory(JSON.parse(rawHistory));
  }, []);

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('analysis_history', JSON.stringify(newHistory));
  };

  const viewResult = (result: AnalysisResult) => {
    navigate(ROUTES.RESULTS, { state: { result } });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Your Analytics Dashboard</h1>
          <p className="text-gray-500">Track and manage your recent analyses.</p>
        </div>
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className="px-6 py-3 bg-[#5850ec] hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          + New Analysis
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#161b2c] rounded-2xl border border-dashed border-gray-800 p-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">No History Yet</h3>
          <p className="text-gray-500 max-w-sm">Start your first analysis to see results appear here in your personal dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => viewResult(item)}
              className="bg-[#161b2c] p-6 rounded-2xl border border-gray-800 hover:border-indigo-500/50 cursor-pointer transition-all group relative"
            >
              <button 
                onClick={(e) => deleteHistoryItem(item.id, e)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.type === 'job_match' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {item.type === 'job_match' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-200 capitalize">{item.type.replace('_', ' ')}</h4>
                  <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {item.summary}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {item.score !== undefined ? `Match: ${item.score}%` : 'Analysis Done'}
                </span>
                <span className="text-xs text-gray-600 group-hover:text-indigo-400 transition-colors">
                  View Full Report →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
