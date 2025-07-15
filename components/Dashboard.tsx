
import React, { useState, useMemo } from 'react';
import { Report, Sector, ExperienceReport, ReportType, AppView } from '../types';
import ReportList from './ReportList';
import { SECTORS_HIERARCHY } from '../constants';

interface DashboardProps {
  reports: Report[];
  onSupport: (id: string) => void;
  onView: (report: ExperienceReport) => void;
  setCurrentView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onSupport, onView, setCurrentView }) => {
  const [companyFilter, setCompanyFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSectorFilter, setActiveSectorFilter] = useState<Sector | 'all'>('all');

  const filteredReports = useMemo(() => {
    const sortedReports = [...reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return sortedReports.filter(report => {
        const companyMatch = companyFilter 
            ? report.companyName.toLowerCase().includes(companyFilter.toLowerCase())
            : true;

        if (!companyMatch) return false;

        if (activeSectorFilter === 'all') {
            return true;
        }
        
        if (report.type === ReportType.JobOffer) {
            return true;
        }

        if (report.type === ReportType.Experience) {
            return report.sector === activeSectorFilter;
        }
        
        return false;
    });
  }, [reports, companyFilter, activeSectorFilter]);

  return (
    <div className="space-y-12">
      {/* Mission/Vision Hero Section */}
      <div className="text-center py-12 bg-sky-600 text-white rounded-2xl shadow-xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Stipendi da fame? È ora di farsi sentire.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-sky-100">
          Lavoro Onesto è la piattaforma per denunciare anonimamente le offerte di lavoro e le esperienze lavorative inique in Italia.
          La tua voce conta.
        </p>
      </div>

       {/* Call to Action Section */}
       <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Ti hanno proposto un lavoro malpagato o condizioni inaccettabili?</h2>
            <p className="mt-2 text-slate-600">Non rimanere in silenzio. Condividi la tua esperienza per aiutare la community e creare consapevolezza.</p>
            <button 
                onClick={() => setCurrentView('ADD_REPORT_CHOICE')}
                className="mt-6 inline-flex items-center justify-center space-x-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-lg font-semibold text-lg animate-pulse"
            >
                <i className="fa-solid fa-bullhorn"></i>
                <span>Segnala Ora</span>
            </button>
        </div>


      {/* Filter and Reports Section */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div>
                <label htmlFor="company-filter" className="block text-xl font-bold text-slate-800 mb-2">Filtra per Azienda</label>
                <input 
                    id="company-filter"
                    type="text"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    placeholder="Cerca un'azienda..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Filtra per Settore</h2>
                <p className="text-sm text-slate-500 mt-1">Seleziona una categoria e poi un settore specifico. Le offerte di lavoro sono sempre visibili.</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActiveSectorFilter('all');
                        setSelectedCategory(null);
                      }}
                      className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                        activeSectorFilter === 'all' && !selectedCategory
                          ? 'bg-sky-600 text-white shadow'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Tutti
                    </button>
                    {Object.keys(SECTORS_HIERARCHY).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === category ? null : category);
                          setActiveSectorFilter('all');
                        }}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                          selectedCategory === category
                            ? 'bg-sky-600 text-white shadow'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                </div>

                {selectedCategory && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                         <h3 className="w-full text-md font-semibold text-slate-600 mb-2">Specifica settore per "{selectedCategory}":</h3>
                        <div className="flex flex-wrap gap-2">
                            {SECTORS_HIERARCHY[selectedCategory].map((sector) => (
                                <button
                                    key={sector}
                                    onClick={() => setActiveSectorFilter(activeSectorFilter === sector ? 'all' : sector)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                      activeSectorFilter === sector
                                        ? 'bg-sky-600 text-white shadow'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <ReportList reports={filteredReports} onSupport={onSupport} onView={onView} />
      </div>
    </div>
  );
};

export default Dashboard;