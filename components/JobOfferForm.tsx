
import React, { useState } from 'react';
import { JobOfferReport, ReportType } from '../types';
import { PaperClipIcon, LinkIcon } from './icons/IconComponents';

interface JobOfferFormProps {
  onAddReport: (report: JobOfferReport) => void;
}

const JobOfferForm: React.FC<JobOfferFormProps> = ({ onAddReport }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentType, setAttachmentType] = useState<'file' | 'text'>('file');
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [linkOrText, setLinkOrText] = useState('');
  const [ralIndicated, setRalIndicated] = useState<boolean | null>(null);
  const [ralAmount, setRalAmount] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Il file è troppo grande. Limite massimo: 5MB.");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result as string);
        setError('');
      };
      reader.onerror = () => {
        setError("Impossibile leggere il file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName || !description) {
      setError('Tutti i campi di testo sono obbligatori.');
      return;
    }
    if (attachmentType === 'file' && !fileDataUrl) {
        setError('È obbligatorio allegare un file (screenshot o documento).');
        return;
    }
     if (attachmentType === 'text' && !linkOrText.trim()) {
        setError('È obbligatorio inserire un link o un testo.');
        return;
    }
    if (ralIndicated === null) {
        setError('Specifica se la RAL era indicata nell\'offerta.');
        return;
    }
    if (ralIndicated && !ralAmount) {
        setError('Inserisci l\'importo della RAL.');
        return;
    }

    setError('');
    
    const newReport: JobOfferReport = {
      id: crypto.randomUUID(),
      type: ReportType.JobOffer,
      jobTitle,
      companyName,
      description,
      createdAt: new Date(),
      supportCount: 0,
      ralIndicated,
      ralAmount: ralIndicated ? parseFloat(ralAmount) : undefined,
    };

    if (attachmentType === 'file') {
        newReport.fileDataUrl = fileDataUrl;
        newReport.fileName = fileName;
    } else {
        newReport.linkOrText = linkOrText;
    }

    onAddReport(newReport);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">Segnala un'Offerta di Lavoro</h2>
        <p className="mt-3 text-lg text-slate-500">Hai trovato un annuncio sospetto? Aiutaci a fare luce.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-1">Posizione Offerta *</label>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Es. 'Magazziniere', 'Stage in Marketing'"
          />
        </div>
        
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">Nome Azienda *</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Nome dell'azienda che ha pubblicato l'offerta"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Perché la segnali? *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Descrivi cosa c'è di sbagliato nell'offerta. Es. 'Stipendio non dichiarato', 'Richieste sproporzionate per uno stage', 'Partita IVA obbligatoria per lavoro dipendente'."
          ></textarea>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <label className="block text-sm font-bold text-slate-700">RAL presente?</label>
            <fieldset className="mt-2">
                <legend className="sr-only">RAL presente?</legend>
                <div className="flex items-center space-x-4">
                     <div className="flex items-center">
                        <input id="ral-yes" name="ral-indicated" type="radio" checked={ralIndicated === true} onChange={() => setRalIndicated(true)} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                        <label htmlFor="ral-yes" className="ml-2 block text-sm font-medium text-slate-700">Sì</label>
                    </div>
                    <div className="flex items-center">
                        <input id="ral-no" name="ral-indicated" type="radio" checked={ralIndicated === false} onChange={() => setRalIndicated(false)} className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500" />
                        <label htmlFor="ral-no" className="ml-2 block text-sm font-medium text-slate-700">No</label>
                    </div>
                </div>
            </fieldset>

            {ralIndicated === true && (
                 <div className="mt-4">
                    <label htmlFor="ralAmount" className="block text-sm font-medium text-slate-700 mb-1">A quanto ammonta la RAL?</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                           <span className="text-slate-500 sm:text-sm">€</span>
                        </div>
                        <input
                            type="number"
                            id="ralAmount"
                            value={ralAmount}
                            onChange={(e) => setRalAmount(e.target.value)}
                            className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                            placeholder="25000"
                            step="100"
                        />
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                           <span className="text-slate-500 sm:text-sm">/ anno</span>
                        </div>
                    </div>
                </div>
            )}
        </div>


        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Allega Prova *</label>
            <div className="flex space-x-2 rounded-lg bg-slate-100 p-1 mb-4">
                <button
                    type="button"
                    onClick={() => setAttachmentType('file')}
                    className={`w-1/2 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${attachmentType === 'file' ? 'bg-white text-sky-600 shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <PaperClipIcon className="w-5 h-5" />
                    <span>Allega File</span>
                </button>
                <button
                    type="button"
                    onClick={() => setAttachmentType('text')}
                    className={`w-1/2 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${attachmentType === 'text' ? 'bg-white text-sky-600 shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                    <LinkIcon className="w-5 h-5" />
                    <span>Allega Link/Testo</span>
                </button>
            </div>

            {attachmentType === 'file' ? (
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <PaperClipIcon className="mx-auto h-10 w-10 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                <span>Carica un file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                            </label>
                            <p className="pl-1">o trascinalo qui</p>
                        </div>
                        {fileName ? (
                            <p className="text-sm text-emerald-600 font-semibold">{fileName}</p>
                        ) : (
                            <p className="text-xs text-slate-500">PNG, JPG, PDF fino a 5MB</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                     <textarea
                        id="linkOrText"
                        value={linkOrText}
                        onChange={(e) => setLinkOrText(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        placeholder="Incolla qui il link all'offerta di lavoro o il testo completo dell'annuncio/messaggio."
                    ></textarea>
                </div>
            )}
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center items-center space-x-3 px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-slate-400 transition-colors shadow-lg"
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>Invia Segnalazione Offerta</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobOfferForm;