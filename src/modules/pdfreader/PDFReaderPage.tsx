import { useState, useCallback, useRef } from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { FileText, FolderOpen } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

const pdfjs = (pdfjsLib as unknown as { default?: typeof pdfjsLib }).default ?? pdfjsLib;
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const STORAGE_KEY = 'pdf-reader-last-url';

export function PDFReaderPage() {
  const [fileUrl, setFileUrl] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? '',
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: () => {
          if (containerRef.current) {
            containerRef.current.classList.remove('rounded-xl', 'border');
            containerRef.current.classList.add('fixed', 'inset-0', 'z-50');
          }
        },
        onExitFullScreen: () => {
          if (containerRef.current) {
            containerRef.current.classList.add('rounded-xl', 'border');
            containerRef.current.classList.remove('fixed', 'inset-0', 'z-50');
          }
        },
      },
    },
    thumbnailPlugin: {
      thumbnailWidth: 100,
    },
  });

  const handleOpenFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    localStorage.setItem(STORAGE_KEY, url);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {!fileUrl ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Apri un manuale PDF
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Carica un PDF dal tuo dispositivo per visualizzarlo con indice,
              ricerca per parola chiave e zoom integrati.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 cursor-pointer transition-colors">
              <FolderOpen className="w-4 h-4" />
              Seleziona file
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleOpenFile(f);
                }}
              />
            </label>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 min-h-0 mx-4 mb-4 mt-2 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
        >
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
          />
        </div>
      )}
    </div>
  );
}
