
import React from 'react';
import type { AppView } from '../types';
import { BriefcaseOutlineIcon, ChatBubbleLeftRightIcon } from './icons/IconComponents';

interface AddReportChoiceProps {
  setCurrentView: (view: AppView) => void;
}

const ChoiceCard: React.FC<{title: string, description: string, icon: React.ReactNode, onClick: () => void}> = ({ title, description, icon, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 text-center flex flex-col items-center"
    >
        <div className="bg-sky-100 text-sky-600 rounded-full p-4 mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500 flex-grow">{description}</p>
        <div className="mt-6 text-sky-600 font-semibold flex items-center group">
            <span>Inizia ora</span>
            <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
        </div>
    </div>
);

const AddReportChoice: React.FC<AddReportChoiceProps> = ({ setCurrentView }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-800">Cosa vuoi segnalare?</h2>
            <p className="mt-3 text-lg text-slate-500">Scegli il tipo di segnalazione più adatta alla tua situazione.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChoiceCard 
                title="Offerta di Lavoro"
                description="Segnala un annuncio di lavoro ingannevole, con richieste illegittime o condizioni palesemente svantaggiose."
                icon={<BriefcaseOutlineIcon className="w-8 h-8" />}
                onClick={() => setCurrentView('ADD_JOB_OFFER_FORM')}
            />
            <ChoiceCard 
                title="Esperienza Lavorativa"
                description="Racconta un'esperienza di sfruttamento, mobbing, mancati pagamenti o altre violazioni subite sul posto di lavoro."
                icon={<ChatBubbleLeftRightIcon className="w-8 h-8" />}
                onClick={() => setCurrentView('ADD_EXPERIENCE_FORM')}
            />
        </div>
    </div>
  );
};

export default AddReportChoice;