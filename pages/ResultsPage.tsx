
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalysisResult } from '../types';
import { ROUTES } from '../constants';
import ChartComponent from '../components/ChartComponent';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as AnalysisResult;

  if (!result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-400">No analysis found</h2>
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold"
        >
          Go to Analyzer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analysis Results</h1>
          <p className="text-gray-500 text-sm mt-1">Processed on {new Date(result.timestamp).toLocaleString()}</p>
        </div>
        <button 
          onClick={() => navigate(ROUTES.ANALYZER)}
          className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-sm font-bold rounded-xl transition-all border border-gray-700"
        >
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary & Score */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Candidate Profile Summary */}
          <div className="bg-gradient-to-r from-indigo-900/20 to-transparent p-8 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
            <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Candidate Profile Summary</h2>
            <p className="text-2xl font-medium text-gray-100 leading-snug">
              {result.candidateProfile}
            </p>
          </div>

          <div className="bg-[#161b2c] p-8 rounded-3xl border border-gray-800 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold mb-1">Job Match Insights</h2>
                <p className="text-sm text-gray-500">How your profile aligns with the target role</p>
              </div>
              {result.score !== undefined && (
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center text-3xl font-black bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
                    {result.score}%
                  </div>
                  <span className="text-[10px] text-indigo-400 mt-2 font-black uppercase tracking-[0.2em]">Match Score</span>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
              <p className="text-gray-300 leading-relaxed text-lg pl-6 py-2">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="bg-[#161b2c] p-8 rounded-3xl border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Market Trends & Relevance</h2>
            {result.trends && result.trends.length > 0 ? (
              <ChartComponent data={result.trends} />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-2xl bg-[#0e1220]/50">
                <p className="text-gray-500">No comparative data trends found.</p>
              </div>
            )}
          </div>

          <div className="bg-[#161b2c] p-8 rounded-3xl border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Key Professional Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {result.stats?.map((stat, i) => (
                <div key={i} className="p-5 bg-[#0e1220] rounded-2xl border border-gray-800 transition-hover hover:border-gray-700">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Suggestions & Actions */}
        <div className="space-y-8">
          <div className="bg-[#161b2c] p-8 rounded-3xl border border-gray-800 border-t-4 border-t-indigo-500 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              Strategic Advice
            </h2>
            <ul className="space-y-5">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 ring-4 ring-indigo-500/10"></div>
                  <span className="text-sm text-gray-300 leading-relaxed font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-2xl shadow-indigo-500/20 group cursor-pointer overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="font-black text-xl text-white mb-2">Detailed Report</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-snug">Generate a full PDF dossier including gap analysis and industry benchmarks.</p>
            <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95">
              Export Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
