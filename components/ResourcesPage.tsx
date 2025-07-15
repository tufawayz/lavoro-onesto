import React from 'react';

const ResourceCard = ({ icon, title, children }: { icon: string, title: string, children: React.ReactNode }) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
            <div className="bg-sky-100 text-sky-600 rounded-full p-3 mr-4">
                <i className={`fa-solid ${icon} w-6 h-6 text-center leading-6`}></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2 pl-1 sm:pl-16">
            {children}
        </div>
    </div>
);

const ResourcesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <i className="fa-solid fa-book-open text-6xl text-sky-500 mb-4"></i>
                <h2 className="text-4xl font-extrabold text-slate-800">Risorse per i Lavoratori</h2>
                <p className="mt-3 text-lg text-slate-500">Conosci i tuoi diritti e gli strumenti a tua disposizione.</p>
            </div>

            <div className="space-y-8">
                <ResourceCard icon="fa-file-contract" title="I Tuoi Diritti Fondamentali">
                    <p>Ogni lavoratore ha diritti inalienabili. Conoscerli è il primo passo per difenderli.</p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                        <li><strong>Contratto di Lavoro:</strong> Deve essere chiaro e specificare mansioni, livello, orario e retribuzione. Un contratto verbale è valido ma più difficile da provare.</li>
                        <li><strong>Orario di Lavoro:</strong> La legge definisce limiti massimi (solitamente 40 ore settimanali) e il diritto a pause, riposi giornalieri e settimanali.</li>
                        <li><strong>Ferie e Permessi:</strong> Hai diritto a un periodo di ferie retribuite irrinunciabile ogni anno (minimo 4 settimane).</li>
                        <li><strong>Sicurezza sul Lavoro:</strong> Il datore di lavoro è obbligato a garantire un ambiente sicuro, informandoti sui rischi e fornendo i dispositivi di protezione.</li>
                    </ul>
                </ResourceCard>

                <ResourceCard icon="fa-users" title="A Chi Rivolgersi?">
                    <p>Se i tuoi diritti vengono violati, non sei solo. Ecco a chi puoi chiedere aiuto:</p>
                     <ul className="mt-2 space-y-4">
                        <li>
                            <strong className="text-slate-700 block">Ispettorato Nazionale del Lavoro (INL):</strong> L'ente pubblico che vigila sul rispetto delle leggi sul lavoro. Puoi segnalare irregolarità contrattuali, lavoro nero e problemi di sicurezza.
                        </li>
                        <li>
                            <strong className="text-slate-700 block">Sindacati di Categoria (es. CGIL, CISL, UIL):</strong> Offrono tutela individuale e collettiva, consulenza legale e supporto nelle vertenze con l'azienda.
                        </li>
                         <li>
                            <strong className="text-slate-700 block">Patronati (es. INCA, ACLI, INAS):</strong> Forniscono assistenza gratuita per pratiche di pensione, disoccupazione (NASpI), infortuni e malattie professionali.
                        </li>
                    </ul>
                </ResourceCard>
                
                <ResourceCard icon="fa-camera" title="Come Documentare Abusi e Irregolarità">
                    <p>Per far valere le tue ragioni, le prove sono fondamentali. Ecco come raccoglierle in modo efficace:</p>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                        <li><strong>Conserva tutto:</strong> Contratto, buste paga, email, messaggi WhatsApp o altre comunicazioni scritte che dimostrino le condizioni di lavoro.</li>
                        <li><strong>Tieni un diario:</strong> Annota date, orari, eventi specifici, persone presenti e cosa è stato detto o fatto. Sii il più dettagliato possibile.</li>
                        <li><strong>Fai screenshot:</strong> Fotografa turni, comunicazioni o qualsiasi altra prova digitale che potrebbe essere cancellata.</li>
                        <li><strong>Testimoni:</strong> Se possibile, parla con colleghi fidati che possano confermare la tua versione dei fatti. La loro testimonianza può essere preziosa.</li>
                    </ul>
                </ResourceCard>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <h4 className="font-bold text-amber-900 flex items-center"><i className="fa-solid fa-shield-halved mr-2"></i> L'Importanza della Privacy</h4>
                    <p className="text-amber-800 mt-2">Quando denunci, proteggi sempre la tua identità se temi ritorsioni. L'anonimato è un tuo diritto e piattaforme come "Lavoro Onesto" esistono per garantirtelo. Condividere la tua esperienza aiuta l'intera comunità a diventare più consapevole e forte.</p>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
