
import React, { useState, useEffect } from 'react';
import { generateResourceContent } from '../services/geminiService';

const ResourcesPage: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            const generatedContent = await generateResourceContent();
            
            // Simple markdown to HTML conversion
            let htmlContent = generatedContent
                .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-slate-800">$1</h3>')
                .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3 text-slate-900">$1</h2>')
                .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mb-4 text-sky-700">$1</h1>')
                .replace(/\n/g, '<br />')
                .replace(/(\* |1\. |2\. |3\. |4\. )(.*)/g, '<li class="ml-5 list-disc">$2</li>')
                .replace(/<br \/><li>/g, '<li>') // Fix extra breaks before list items
                .replace(/<\/li><br \/>/g, '</li>');


            setContent(htmlContent);
            setIsLoading(false);
        };
        fetchResources();
    }, []);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10">
            <div className="text-center mb-10">
                <i className="fa-solid fa-book-open text-6xl text-sky-500 mb-4"></i>
                <h2 className="text-4xl font-extrabold text-slate-800">Risorse per i Lavoratori</h2>
                <p className="mt-3 text-lg text-slate-500">Conosci i tuoi diritti e gli strumenti a tua disposizione.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <i className="fa-solid fa-spinner fa-spin text-4xl text-sky-500"></i>
                    <p className="mt-4 text-slate-600">Caricamento delle risorse...</p>
                </div>
            ) : (
                <div 
                    className="prose prose-slate max-w-none prose-p:text-slate-600 prose-a:text-sky-600 hover:prose-a:text-sky-700 prose-headings:text-slate-800" 
                    dangerouslySetInnerHTML={{ __html: content }}
                ></div>
            )}
        </div>
    );
};

export default ResourcesPage;
