
import React, { useState } from 'react';
import { SECTORS_HIERARCHY } from '../constants';
import { ExperienceReport, Sector, ReportType } from '../types';
import { analyzeReportContent } from '../services/geminiService';

interface ReportFormProps {
  onAddReport: (report: ExperienceReport) => void;
}

const UNKEPT_PROMISE_OPTIONS = [
    "RAL inferiore a quanto pattuito",
    "Ore straordinarie non pagate",
    "Mancato versamento dei contributi",
    "Inquadramento contrattuale non corretto",
    "Ferie non concesse o non pagate",
    "Formazione promessa ma mai erogata",
];


const ReportForm: React.FC<ReportFormProps> = ({ onAddReport }) => {
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<Sector>('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [unkeptPromises, setUnkeptPromises] = useState<string[]>([]);
  const [customPromise, setCustomPromise] = useState('');
  const [showCustomPromiseInput, setShowCustomPromiseInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePromiseChange = (promise: string, isChecked: boolean) => {
    if (isChecked) {
        setUnkeptPromises(prev => [...prev, promise]);
    } else {
        setUnkeptPromises(prev => prev.filter(p => p !== promise));
    }
  };

  const handleCustomPromiseCheck = (isChecked: boolean) => {
    setShowCustomPromiseInput(isChecked);
    if (!isChecked) {
        setCustomPromise(''); // Clear custom text if "Altro" is unchecked
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !description || !sector) {
      setError('Tutti i campi contrassegnati con * sono obbligatori.');
      return;
    }
    setError('');
    setIsLoading(true);

    const finalPromises = [...unkeptPromises];
    if (showCustomPromiseInput && customPromise.trim()) {
        finalPromises.push(customPromise.trim());
    }

    try {
      const analysis = await analyzeReportContent(description);
      
      const newReport: ExperienceReport = {
        id: crypto.randomUUID(),
        type: ReportType.Experience,
        title,
        companyName,
        sector,
        description,
        isAnonymous,
        authorName: isAnonymous ? 'Anonimo' : authorName,
        createdAt: new Date(),
        supportCount: 0,
        tags: analysis.tags,
        unkeptPromises: finalPromises.length > 0 ? finalPromises : undefined,
      };

      onAddReport(newReport);
    } catch (apiError) {
      console.error("Failed during form submission process", apiError);
      setError("Si è verificato un errore durante l'analisi della segnalazione. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">Segnala la Tua Esperienza</h2>
        <p className="mt-3 text-lg text-slate-500">Descrivi un'esperienza lavorativa ingiusta. La tua voce può aiutare altri.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Titolo della Segnalazione *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Es. Mancato pagamento straordinari"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Nome Azienda *</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              placeholder="Nome dell'azienda"
            />
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-slate-700 mb-1">Settore *</label>
            <select
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white"
            >
              <option value="" disabled>Seleziona un settore</option>
              {Object.entries(SECTORS_HIERARCHY).map(([category, subcategories]) => (
                <optgroup key={category} label={category}>
                  {subcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descrizione Dettagliata *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Descrivi la situazione nel dettaglio. Includi informazioni su orari, stipendio, mansioni, e qualsiasi altra violazione."
          ></textarea>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800">Promesse non mantenute</h4>
            <p className="text-sm text-slate-500 mb-4">Seleziona una o più opzioni se applicabile.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {UNKEPT_PROMISE_OPTIONS.map(promise => (
                     <div key={promise} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id={promise}
                                name="unkept-promises"
                                type="checkbox"
                                onChange={(e) => handlePromiseChange(promise, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={promise} className="font-medium text-slate-700">{promise}</label>
                        </div>
                    </div>
                ))}
                 <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                        <input
                            id="other-promise"
                            name="unkept-promises"
                            type="checkbox"
                            onChange={(e) => handleCustomPromiseCheck(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="other-promise" className="font-medium text-slate-700">Altro...</label>
                    </div>
                </div>
            </div>
            {showCustomPromiseInput && (
                <div className="mt-4">
                    <label htmlFor="customPromise" className="sr-only">Specifica altro</label>
                    <input
                        type="text"
                        id="customPromise"
                        value={customPromise}
                        onChange={e => setCustomPromise(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Specifica quale promessa non è stata mantenuta"
                    />
                </div>
            )}
        </div>


        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800">Dati Personali</h4>
            <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                    <input
                        id="isAnonymous"
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="isAnonymous" className="font-medium text-slate-700">Voglio rimanere anonimo</label>
                    <p className="text-slate-500">Selezionando questa opzione, il tuo nome non sarà mostrato pubblicamente.</p>
                </div>
            </div>
            {!isAnonymous && (
                <div className="mt-4">
                    <label htmlFor="authorName" className="block text-sm font-medium text-slate-700 mb-1">Il tuo nome (opzionale)</label>
                    <input
                        type="text"
                        id="authorName"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Mario Rossi"
                    />
                </div>
            )}
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex justify-center items-center space-x-3 px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-slate-400 transition-colors shadow-lg"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Analisi in corso...</span>
              </>
            ) : (
                <>
                <i className="fa-solid fa-paper-plane"></i>
                <span>Invia Segnalazione</span>
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;