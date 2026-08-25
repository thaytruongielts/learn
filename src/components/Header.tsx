import React from 'react';
import { BookOpen, Clock, CheckCircle2, RefreshCw, FileText, Volume2, Sparkles, BookMarked, Printer } from 'lucide-react';
import { TestMode } from '../types';

interface HeaderProps {
  mode: TestMode;
  setMode: (m: TestMode) => void;
  timeRemaining: number; // in seconds
  isTimeUp: boolean;
  answeredCount: number;
  totalQuestions: number;
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onOpenVocabulary: () => void;
  onOpenPrintView: () => void;
  currentPassageIndex: number;
  totalPassages: number;
  onSelectPassage: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  timeRemaining,
  isTimeUp,
  answeredCount,
  totalQuestions,
  isSubmitted,
  onSubmit,
  onReset,
  onOpenVocabulary,
  onOpenPrintView,
  currentPassageIndex,
  totalPassages,
  onSelectPassage,
}) => {
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
              Bài Tập Đọc Hiểu Tiếng Anh 7
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              30 câu hỏi chuẩn THCS • Thang điểm 10
            </p>
          </div>
        </div>

        {/* Middle Navigation & Tabs */}
        <div className="hidden lg:flex items-center gap-4">
          {!isSubmitted && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setMode('exam')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  mode === 'exam'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chế độ Thi thử (45p)
              </button>
              <button
                onClick={() => setMode('practice')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  mode === 'practice'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Luyện tập & Xem ngay
              </button>
            </div>
          )}

          {/* Quick Passage Tabs */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {Array.from({ length: totalPassages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPassage(idx)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  currentPassageIndex === idx
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title={`Chuyển đến Bài đọc ${idx + 1}`}
              >
                Bài {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          {!isSubmitted ? (
            <>
              {mode === 'exam' && (
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Thời gian còn lại
                  </p>
                  <p className="text-base sm:text-lg font-mono font-bold text-blue-600 leading-tight">
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              )}

              <button
                onClick={onOpenVocabulary}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Mở sổ tay từ vựng 6 bài đọc"
              >
                <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                <span>Từ vựng</span>
              </button>

              <button
                onClick={onOpenPrintView}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="In đề bài hoặc tải file PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>In đề</span>
              </button>

              <button
                onClick={onSubmit}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp Bài</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenVocabulary}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                <span>Từ vựng</span>
              </button>
              <button
                onClick={onOpenPrintView}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>In kết quả</span>
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Làm lại bài</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
