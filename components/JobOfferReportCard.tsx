
import React from 'react';
import type { JobOfferReport } from '../types';
import { BuildingIcon, DocumentTextIcon, HandshakeIcon, LinkIcon } from './icons/IconComponents';

interface JobOfferReportCardProps {
  report: JobOfferReport;
  onSupport: (id: string) => void;
}

const JobOfferReportCard: React.FC<JobOfferReportCardProps> = ({ report, onSupport }) => {
    
    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anni fa";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " mesi fa";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " giorni fa";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " ore fa";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minuti fa";
        return "pochi secondi fa";
    }

    const isLink = report.linkOrText?.startsWith('http');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
    }

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border-l-4 border-purple-500">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Offerta di Lavoro</span>
                    <span className="text-xs text-slate-500">{timeAgo(report.createdAt)}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-800">
                    {report.jobTitle}
                </h3>
                <div className="flex items-center mt-2 text-slate-600">
                    <BuildingIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{report.companyName}</span>
                </div>

                {report.ralIndicated && report.ralAmount && (
                     <div className="mt-3 flex items-center text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                        <i className="fa-solid fa-coins mr-2"></i>
                        <span>RAL Indicata: {formatCurrency(report.ralAmount)}</span>
                    </div>
                )}

                <p className="mt-4 text-slate-600 text-sm line-clamp-3">
                    {report.description}
                </p>
                
                <div className="mt-4">
                {report.fileDataUrl && report.fileName ? (
                    <a 
                      href={report.fileDataUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      download={report.fileName}
                      className="inline-flex items-center space-x-2 text-sm font-medium text-sky-600 hover:underline"
                    >
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>Visualizza allegato ({report.fileName})</span>
                    </a>
                ) : report.linkOrText ? (
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500">
                           {isLink ? <LinkIcon className="w-4 h-4" /> : <DocumentTextIcon className="w-4 h-4" />}
                           <span>{isLink ? 'Link Allegato' : 'Testo Allegato'}</span>
                        </div>
                         {isLink ? (
                            <a href={report.linkOrText} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline break-all">
                                {report.linkOrText}
                            </a>
                        ) : (
                            <p className="text-sm text-slate-600 bg-slate-100 p-2 rounded-md whitespace-pre-wrap break-words line-clamp-2">
                                {report.linkOrText}
                            </p>
                        )}
                    </div>
                ) : null}
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-center items-center">
                <button
                    onClick={() => onSupport(report.id)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                    <HandshakeIcon className="w-5 h-5" />
                    <span className="font-semibold">{report.supportCount} Sostengono</span>
                </button>
            </div>
        </div>
    );
};

export default JobOfferReportCard;