import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Lightbulb, BookOpen, Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import { Question } from '../types';

interface DetailedReviewListProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  flaggedQuestions: Set<number>;
  activeFilter: 'all' | 'incorrect' | 'flagged';
  onAskAi: (question: Question) => void;
  onJumpToPassage: (passageId: string, clueExcerpt?: string) => void;
}

export const DetailedReviewList: React.FC<DetailedReviewListProps> = ({
  questions,
  userAnswers,
  flaggedQuestions,
  activeFilter,
  onAskAi,
  onJumpToPassage,
}) => {
  const filteredQuestions = questions.filter((q) => {
    const selected = userAnswers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (activeFilter === 'incorrect') {
      return !isCorrect;
    }
    if (activeFilter === 'flagged') {
      return flaggedQuestions.has(q.id);
    }
    return true;
  });

  if (filteredQuestions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-900">
          Không có câu hỏi nào trong bộ lọc này!
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {activeFilter === 'incorrect' ? 'Chúc mừng! Em đã trả lời đúng tất cả các câu!' : 'Không có câu hỏi nào được đánh dấu.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Giải thích chi tiết từng câu ({filteredQuestions.length} câu)
        </h3>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const selected = userAnswers[q.id];
          const isCorrect = selected === q.correctAnswer;
          const isUnanswered = selected === null || selected === undefined;
          const isFlagged = flaggedQuestions.has(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                isCorrect
                  ? 'border-slate-200'
                  : 'border-rose-200'
              }`}
            >
              {/* Header of review card */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    Câu {q.questionNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {q.passageTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isFlagged && (
                    <span className="inline-flex items-center gap-1 text-amber-700 text-xs font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Bookmark className="w-3 h-3 fill-amber-500" />
                      Đã lưu
                    </span>
                  )}
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đúng (+0.33đ)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      {isUnanswered ? 'Chưa trả lời (0đ)' : 'Sai (0đ)'}
                    </span>
                  )}
                </div>
              </div>

              {/* Question statement */}
              <p className="text-base font-medium text-slate-800 my-4 leading-relaxed">
                {q.questionText}
              </p>

              {/* 4 Options breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const isThisSelected = selected === opt;
                  const isThisCorrect = q.correctAnswer === opt;

                  let optClass = 'bg-white text-slate-700 border-slate-200';

                  if (isThisCorrect) {
                    optClass = 'bg-emerald-50 text-emerald-950 border-emerald-500 font-semibold ring-1 ring-emerald-500';
                  } else if (isThisSelected && !isThisCorrect) {
                    optClass = 'bg-rose-50 text-rose-950 border-rose-400 line-through';
                  }

                  return (
                    <div
                      key={opt}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${optClass}`}
                    >
                      <span className="font-bold shrink-0">{opt}.</span>
                      <span className="flex-1">{q.options[opt]}</span>
                      {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                      {isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>

              {/* Vietnamese Explanation box */}
              <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Giải thích chi tiết:
                  </span>
                  <button
                    onClick={() => onAskAi(q)}
                    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Hỏi Gia sư AI
                  </button>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  {q.detailedExplanation}
                </p>

                {/* Clue sentence from text */}
                <div className="p-3 bg-white rounded-lg border-l-4 border-amber-500 text-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-amber-800 text-[11px]">
                      Dẫn chứng từ bài đọc:
                    </span>
                    <button
                      onClick={() => onJumpToPassage(q.passageId, q.clueExcerpt)}
                      className="text-blue-600 hover:underline font-medium text-[11px] inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Xem đoạn văn</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="italic mt-0.5 font-medium">"{q.clueExcerpt}"</p>
                </div>

                {/* Grammar point if available */}
                {q.grammarPoint && (
                  <div className="text-slate-700 text-[11px] pt-1">
                    <strong className="text-slate-900">Điểm ngữ pháp cần nhớ: </strong>
                    {q.grammarPoint}
                  </div>
                )}

                {/* Vocabulary pills */}
                {q.vocabulary && q.vocabulary.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Từ vựng then chốt:</span>
                    {q.vocabulary.map((vocab, vIdx) => (
                      <span
                        key={vIdx}
                        className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200 text-[11px]"
                      >
                        <strong>{vocab.word}</strong> <span className="text-slate-500 font-mono text-[10px]">{vocab.ipa}</span>: {vocab.meaning}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
