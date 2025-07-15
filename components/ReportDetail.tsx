
import React, { useState, useEffect } from 'react';
import type { ExperienceReport } from '../types';
import { generateBoycottAdvice } from '../services/geminiService';
import { BuildingIcon, HandshakeIcon, TagIcon } from './icons/IconComponents';

interface ReportDetailProps {
  report: ExperienceReport;
  onBack: () => void;
  onSupport: (id: string) => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack, onSupport }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      const generatedAdvice = await generateBoycottAdvice(report);
      setAdvice(generatedAdvice);
      setIsLoadingAdvice(false);
    };

    fetchAdvice();
  }, [report]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <button onClick={onBack} className="mb-6 text-sm font-medium text-sky-600 hover:text-sky-800 flex items-center space-x-2">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Torna a tutte le segnalazioni</span>
        </button>

        <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">{report.sector}</span>
        
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">{report.title}</h1>
        
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
            <div className="flex items-center">
                <BuildingIcon className="w-5 h-5 mr-2 text-slate-400" />
                <span>{report.companyName}</span>
            </div>
            <div className="flex items-center">
                <i className="fa-regular fa-user-circle w-5 h-5 mr-2 text-slate-400"></i>
                <span>Segnalato da: <span className="font-medium">{report.authorName}</span></span>
            </div>
        </div>

        {report.tags && report.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                <TagIcon className="w-4 h-4 text-slate-400" />
                {report.tags.map((tag, index) => (
                    <span key={index} className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        )}

        <div className="mt-8 prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800">
            <h3 className="font-bold">Descrizione della situazione</h3>
            <p>{report.description}</p>
        </div>

        {report.unkeptPromises && report.unkeptPromises.length > 0 && (
            <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <i className="fa-solid fa-handshake-slash mr-2 text-red-500"></i>
                    Promesse non mantenute
                </h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600">
                    {report.unkeptPromises.map((promise, index) => (
                        <li key={index}>{promise}</li>
                    ))}
                </ul>
            </div>
        )}
      </div>
      
      <div className="bg-emerald-50 p-6 sm:p-8 border-t border-emerald-200">
        <h3 className="text-2xl font-bold text-emerald-900 flex items-center">
            <i className="fa-solid fa-bullhorn mr-3"></i>
            <span>Come Agire</span>
        </h3>
        {isLoadingAdvice ? (
             <div className="mt-4 flex items-center space-x-3 text-slate-600">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>L'intelligenza artificiale sta generando dei suggerimenti...</span>
             </div>
        ) : (
            <div className="mt-4 prose prose-sm max-w-none text-emerald-800" dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />') }}></div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-center">
        <button
            onClick={() => onSupport(report.id)}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
        >
            <HandshakeIcon />
            <span>Mostra il tuo supporto ({report.supportCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReportDetail;