
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeData } from '../services/geminiService';
import { AnalysisPayload, AnalysisResult } from '../types';
import { ROUTES } from '../constants';

const AnalyzerPage: React.FC = () => {
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [jobDescText, setJobDescText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file only.");
      return;
    }

    setResumeName(file.name);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      // Extract base64 part
      const base64 = dataUrl.split(',')[1];
      setResumeBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!resumeBase64) {
      setError("Please upload your resume in PDF format first.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const type = jobDescText.trim() ? 'job_match' : 'pdf';
      const payload: AnalysisPayload = {
        resumeBase64: resumeBase64,
        resumeMimeType: 'application/pdf',
        jobDescription: jobDescText,
        type: type,
      };

      const result = await analyzeData(payload);
      
      // Save to local history
      const historyRaw = localStorage.getItem('analysis_history') || '[]';
      const history = JSON.parse(historyRaw);
      localStorage.setItem('analysis_history', JSON.stringify([result, ...history]));

      // Navigate to results
      navigate(ROUTES.RESULTS, { state: { result } });
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Check Your Job Match</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Upload your resume in <strong>PDF format</strong> and paste the job details. We'll use AI to see how well you fit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Controls */}
        <div className="space-y-6">
          {/* Step 1: PDF Resume Upload */}
          <div className="bg-[#161b2c] p-8 rounded-2xl border border-gray-800 relative transition-all hover:border-indigo-500/30">
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20">1</span>
              <h3 className="font-semibold text-xl">Your Resume (PDF)</h3>
            </div>
            
            {!resumeBase64 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/20 transition-all group"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-300">Click to upload PDF</p>
                <p className="text-xs text-gray-500 mt-1">Maximum size: 10MB</p>
              </div>
            ) : (
              <div className="w-full h-48 bg-[#0e1220] border border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2">
                   <button 
                    onClick={() => { setResumeBase64(null); setResumeName(null); }}
                    className="p-1 hover:text-red-400 text-gray-500"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                   </button>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-bold text-white max-w-[80%] truncate text-center">{resumeName}</p>
                <p className="text-xs text-green-400 mt-1 uppercase tracking-widest font-bold">Ready to analyze</p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf"
            />
          </div>

          {/* Step 2: Job Description */}
          <div className="bg-[#161b2c] p-8 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-3 mb-6">
              <span className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/20">2</span>
              <h3 className="font-semibold text-xl">Job Description</h3>
            </div>
            <textarea
              className="w-full h-48 bg-[#0e1220] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-gray-600 resize-none transition-all"
              placeholder="Paste the job requirements here to compare against your resume..."
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
            />
          </div>

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing PDF Document...</span>
              </span>
            ) : "Run Smart Match"}
          </button>
          
          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Status Area */}
        <div className="bg-[#161b2c] rounded-3xl border border-gray-800 p-12 flex flex-col items-center justify-center min-h-[500px] lg:h-full text-center sticky top-24">
          {isAnalyzing ? (
            <div className="space-y-8 max-w-sm">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
               </div>
               <div>
                 <h3 className="text-2xl font-bold mb-3">Scanning PDF Content</h3>
                 <p className="text-gray-500 leading-relaxed">Our AI is reading your resume, extracting skills, and comparing keywords with the job requirements...</p>
               </div>
               <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
               </div>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-8 border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Ready for Analysis</h3>
              <p className="text-gray-500 max-w-xs leading-relaxed">
                Upload your resume PDF and paste a job description to get started. You'll receive a detailed match score and professional feedback.
              </p>
              
              <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-[#0e1220] rounded-2xl border border-gray-800">
                   <p className="text-xs font-bold text-gray-600 uppercase mb-1">Step 1</p>
                   <p className="text-sm font-medium text-gray-400">PDF Upload</p>
                </div>
                <div className="p-4 bg-[#0e1220] rounded-2xl border border-gray-800">
                   <p className="text-xs font-bold text-gray-600 uppercase mb-1">Step 2</p>
                   <p className="text-sm font-medium text-gray-400">Job Text</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
