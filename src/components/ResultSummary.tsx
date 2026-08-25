import React from 'react';
import { Award, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw, BookOpen, Printer, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { TestResult, Question } from '../types';

interface ResultSummaryProps {
  result: TestResult;
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  flaggedQuestions: Set<number>;
  onResetTest: () => void;
  onFilterChange: (filter: 'all' | 'incorrect' | 'flagged') => void;
  activeFilter: 'all' | 'incorrect' | 'flagged';
  onOpenVocabulary: () => void;
  onOpenPrint: () => void;
  onSelectQuestion: (index: number) => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  questions,
  userAnswers,
  flaggedQuestions,
  onResetTest,
  onFilterChange,
  activeFilter,
  onOpenVocabulary,
  onOpenPrint,
  onSelectQuestion,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} phút ${remainingSecs} giây`;
  };

  const getEvaluationMessage = (score: number) => {
    if (score >= 9.0) {
      return 'Xuất sắc! Em có kỹ năng đọc hiểu Tiếng Anh rất vững, vốn từ vựng phong phú và phân tích ngữ cảnh chuẩn xác.';
    } else if (score >= 8.0) {
      return 'Rất tốt! Em nắm chắc cấu trúc câu và thông tin bài đọc. Hãy rà soát lại các câu suy luận để đạt điểm 10 tuyệt đối nhé!';
    } else if (score >= 6.5) {
      return 'Khá tốt! Em đã làm đúng phần lớn câu hỏi cơ bản. Hãy chú ý bẫy từ vựng và câu hỏi loại trừ (NOT mentioned).';
    } else if (score >= 5.0) {
      return 'Đạt yêu cầu! Em cần ôn tập thêm từ vựng theo từng Unit của lớp 7 và rèn luyện kỹ năng đọc lướt (skimming) & đọc quét (scanning).';
    } else {
      return 'Cần cố gắng nhiều hơn! Hãy đọc kỹ phần dịch song ngữ và giải thích chi tiết bên dưới để bổ sung từ vựng và ngữ pháp nhé.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Score Board Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Huge Score on Scale of 10 */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Kết Quả Quy Đổi Thang Điểm 10
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-6xl sm:text-7xl font-bold tracking-tight text-blue-600 font-mono">
                {result.scoreOutOf10.toFixed(1)}
              </span>
              <span className="text-2xl font-bold text-slate-400">/ 10</span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${result.scoreColor}`}>
                Xếp loại: {result.scoreRating}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({result.correctCount}/30 câu đúng • {result.rawScorePercent}%)
              </span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {getEvaluationMessage(result.scoreOutOf10)}
            </p>
          </div>

          {/* Right: Quick Metric Cards */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-600">Số câu đúng</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.correctCount} <span className="text-xs font-normal text-slate-400">/ 30</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-600">Số câu sai</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.incorrectCount} <span className="text-xs font-normal text-slate-400">/ 30</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-600">Chưa làm</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {result.unansweredCount} <span className="text-xs font-normal text-slate-400">/ 30</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-600">Thời gian</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {formatTime(result.timeSpentSeconds)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onResetTest}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm lại bài thi</span>
            </button>
            <button
              onClick={onOpenVocabulary}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Từ vựng 6 bài</span>
            </button>
            <button
              onClick={onOpenPrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>In kết quả & Đáp án</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả (30)
            </button>
            <button
              onClick={() => onFilterChange('incorrect')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeFilter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <span>Câu làm sai ({result.incorrectCount + result.unansweredCount})</span>
            </button>
            <button
              onClick={() => onFilterChange('flagged')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'flagged'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              Đánh dấu ({flaggedQuestions.size})
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown per Passage Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Chi tiết kết quả theo từng bài đọc (6 Chủ đề)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.categoryScores.map((cat, idx) => {
            const pct = Math.round((cat.correct / cat.total) * 100);
            return (
              <div
                key={cat.passageId}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      Bài đọc {idx + 1}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {cat.topicVi}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {cat.correct}/{cat.total} đúng
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
