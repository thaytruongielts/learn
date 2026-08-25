import React from 'react';
import { Bookmark, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  flaggedQuestions: Set<number>;
  isSubmitted: boolean;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  userAnswers,
  flaggedQuestions,
  isSubmitted,
}) => {
  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Compute live correct count if in practice/submitted mode
  const correctCount = questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
  const rawScore = Number(((correctCount / questions.length) * 10).toFixed(2));

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">
          Tiến độ làm bài (30 câu)
        </h3>
        <span className="text-xs font-bold text-blue-400 bg-slate-800/80 px-2 py-0.5 rounded">
          {answeredCount}/{questions.length} ({progressPercent}%)
        </span>
      </div>

      {/* 30 Questions Grid */}
      <div className="grid grid-cols-6 gap-2">
        {questions.map((q, idx) => {
          const isCurrent = currentQuestionIndex === idx;
          const selected = userAnswers[q.id];
          const isFlagged = flaggedQuestions.has(q.id);
          const isAnswered = selected !== null && selected !== undefined;
          const isCorrect = selected === q.correctAnswer;

          let btnClass = 'bg-slate-800 text-slate-300 hover:bg-slate-700';

          if (isSubmitted) {
            if (isAnswered && isCorrect) {
              btnClass = 'bg-emerald-500 text-white font-bold';
            } else if (isAnswered && !isCorrect) {
              btnClass = 'bg-rose-500 text-white font-bold';
            } else {
              btnClass = 'bg-slate-800/50 text-slate-500 border border-dashed border-slate-700';
            }
          } else {
            if (isAnswered) {
              btnClass = 'bg-emerald-500 text-white font-bold shadow-xs';
            }
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-8 w-full rounded-md text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${btnClass} ${
                isCurrent
                  ? 'bg-blue-500 text-white ring-2 ring-white scale-105 z-10'
                  : ''
              }`}
            >
              <span>{q.questionNumber}</span>

              {/* Flag Indicator Dot */}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Live / Anticipated Score Box */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex justify-between items-end">
        <div>
          <p className="text-xs text-slate-400 font-medium">
            {isSubmitted ? 'Điểm chính thức (Thang 10)' : 'Điểm dự kiến (Thang 10)'}
          </p>
          <p className="text-3xl font-bold text-emerald-400 leading-tight">
            {isSubmitted ? (
              rawScore
            ) : answeredCount > 0 ? (
              <span>
                {rawScore}{' '}
                <span className="text-xs font-normal text-slate-400">(đúng {correctCount}/{answeredCount})</span>
              </span>
            ) : (
              '--'
            )}
            <span className="text-lg font-normal text-slate-400 ml-1">/ 10</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 italic">
            {isSubmitted
              ? `Đạt ${correctCount}/30 câu đúng`
              : answeredCount === 30
              ? 'Đã trả lời hết 30 câu'
              : `Còn ${30 - answeredCount} câu chưa làm`}
          </p>
        </div>
      </div>
    </div>
  );
};
