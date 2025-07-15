
import React from 'react';
import type { ExperienceReport } from '../types';
import { BuildingIcon, HandshakeIcon, ShareIcon, TagIcon } from './icons/IconComponents';

interface ReportCardProps {
  report: ExperienceReport;
  onSupport: (id: string) => void;
  onView: (report: ExperienceReport) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onSupport, onView }) => {
    
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

    const handleShare = async () => {
        const shareText = `Segnalazione su Lavoro Onesto:\n\nTitolo: ${report.title}\nAzienda: ${report.companyName}\nSettore: ${report.sector}\n\nLeggi di più e sostieni i lavoratori su Lavoro Onesto.`;
        try {
            await navigator.clipboard.writeText(shareText);
            alert('Testo della segnalazione copiato negli appunti!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Impossibile copiare il testo.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">{report.sector}</span>
                    <span className="text-xs text-slate-500">{timeAgo(report.createdAt)}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-800 hover:text-sky-700 cursor-pointer" onClick={() => onView(report)}>
                    {report.title}
                </h3>
                <div className="flex items-center mt-2 text-slate-600">
                    <BuildingIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{report.companyName}</span>
                </div>
                <p className="mt-4 text-slate-600 text-sm line-clamp-3">
                    {report.description}
                </p>
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
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                <button
                    onClick={() => onSupport(report.id)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                    <HandshakeIcon className="w-5 h-5" />
                    <span className="font-semibold">{report.supportCount} Sostengono</span>
                </button>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => onView(report)}
                        className="text-sm font-medium text-sky-600 hover:underline"
                    >
                        Leggi di più
                    </button>
                    <button onClick={handleShare} className="text-slate-500 hover:text-sky-600 transition-colors">
                        <ShareIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;