import { X, Play } from 'lucide-react';
import type { VideoLesson } from '../../types';

interface VideoModalProps {
  lesson: VideoLesson;
  onClose: () => void;
}

export function VideoModal({ lesson, onClose }: VideoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Video area */}
        <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
          {lesson.youtubeId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${lesson.youtubeId}?autoplay=1`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/30">
                <Play className="w-9 h-9 text-white ml-1" />
              </div>
              <p className="text-slate-300 text-sm font-medium">Video in arrivo prossimamente</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/50 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-lg mb-1">{lesson.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-3">{lesson.description}</p>
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map(tag => (
              <span key={tag} className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
