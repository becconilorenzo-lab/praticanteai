import { useState } from 'react';
import { Play, Clock, Eye, BookOpen } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { VIDEO_LESSONS } from '../../data/mockData';
import type { VideoLesson } from '../../types';

const DIFFICULTY_CONFIG = {
  base: { label: 'Base', color: 'bg-slate-100 text-slate-700' },
  intermedio: { label: 'Intermedio', color: 'bg-amber-100 text-amber-700' },
  avanzato: { label: 'Avanzato', color: 'bg-indigo-100 text-indigo-700' },
};

const FILTER_OPTIONS = ['Tutti', 'Base', 'Intermedio', 'Avanzato'] as const;
type Filter = (typeof FILTER_OPTIONS)[number];

function LessonCard({ lesson, onClick }: { lesson: VideoLesson; onClick: () => void }) {
  const diff = DIFFICULTY_CONFIG[lesson.difficulty];
  const [playing, setPlaying] = useState(false);

  const handleThumbClick = (e: React.MouseEvent) => {
    if (lesson.youtubeId) {
      e.stopPropagation();
      setPlaying(true);
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 text-left"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {playing && lesson.youtubeId ? (
          <iframe
            src="https://www.youtube-nocookie.com/embed/Q0CFaH6Kqvo?autoplay=1&start=3"
            title={lesson.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={lesson.thumbnail}
              alt={lesson.title}
              onClick={handleThumbClick}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            {lesson.youtubeId ? (
              <div
                onClick={handleThumbClick}
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/40 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-indigo-600 ml-0.5" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-indigo-600 ml-0.5" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-slate-900/80 text-white text-xs font-semibold px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors">
          {lesson.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{lesson.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {lesson.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Eye className="w-3.5 h-3.5" />
            {lesson.views.toLocaleString('it-IT')}
          </div>
        </div>
      </div>
    </button>
  );
}

function VideoLibrary() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Tutti');
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);

  const filtered = VIDEO_LESSONS.filter(l => {
    if (activeFilter === 'Tutti') return true;
    return DIFFICULTY_CONFIG[l.difficulty].label === activeFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">
          Videoguide
        </span>
        {FILTER_OPTIONS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} onClick={() => setSelectedLesson(lesson)} />
        ))}
      </div>
      {selectedLesson && (
        <VideoModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
      )}
    </div>
  );
}

export function AccademiaSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-xl">Accademia</h2>
          <p className="text-sm text-slate-500">
            Video guide per la preparazione
          </p>
        </div>
      </div>

      <VideoLibrary />
    </div>
  );
}
