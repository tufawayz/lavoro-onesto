
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ResourcesPage from './components/ResourcesPage';
import type { AppView, Report, ExperienceReport, JobOfferReport } from './types';
import ReportDetail from './components/ReportDetail';
import AddReportChoice from './components/AddReportChoice';
import JobOfferForm from './components/JobOfferForm';
import { ReportType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<ExperienceReport | null>(null);

  const handleAddExperienceReport = (newReport: ExperienceReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
    setCurrentView('DASHBOARD');
  };

  const handleAddJobOfferReport = (newReport: JobOfferReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
    setCurrentView('DASHBOARD');
  };

  const handleSupport = (id: string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, supportCount: report.supportCount + 1 } : report
      )
    );
    if (selectedReport && selectedReport.id === id) {
        setSelectedReport(prev => prev ? {...prev, supportCount: prev.supportCount + 1} : null);
    }
  };
  
  const handleViewReport = (report: ExperienceReport) => {
    setSelectedReport(report);
    setCurrentView('VIEW_REPORT');
  }

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard 
                  reports={reports} 
                  onSupport={handleSupport}
                  setCurrentView={setCurrentView}
                  onView={(report) => {
                    if (report.type === ReportType.Experience) {
                      handleViewReport(report);
                    }
                  }} 
                />;
      case 'ADD_REPORT_CHOICE':
        return <AddReportChoice setCurrentView={setCurrentView} />;
      case 'ADD_EXPERIENCE_FORM':
        return <ReportForm onAddReport={handleAddExperienceReport} />;
      case 'ADD_JOB_OFFER_FORM':
        return <JobOfferForm onAddReport={handleAddJobOfferReport} />;
      case 'RESOURCES':
        return <ResourcesPage />;
      case 'VIEW_REPORT':
        return selectedReport ? <ReportDetail report={selectedReport} onBack={() => setCurrentView('DASHBOARD')} onSupport={handleSupport} /> : <Dashboard reports={reports} onSupport={handleSupport} setCurrentView={setCurrentView} onView={handleViewReport} />;
      default:
        return <Dashboard reports={reports} onSupport={handleSupport} setCurrentView={setCurrentView} onView={handleViewReport} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Lavoro Onesto. Tutti i diritti riservati (in teoria).</p>
        <p className="mt-1">Creato per promuovere la trasparenza e l'equità nel mondo del lavoro.</p>
      </footer>
    </div>
  );
};

export default App;