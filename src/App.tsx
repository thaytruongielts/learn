import React, { useState, useEffect, useRef } from 'react';
import { PASSAGES, QUESTIONS, calculateScore } from './data/readingData';
import { TestMode, TestResult, Question, VocabularyItem } from './types';
import { Header } from './components/Header';
import { PassageViewer } from './components/PassageViewer';
import { QuestionCard } from './components/QuestionCard';
import { QuestionNavigator } from './components/QuestionNavigator';
import { ResultSummary } from './components/ResultSummary';
import { DetailedReviewList } from './components/DetailedReviewList';
import { VocabularyModal } from './components/VocabularyModal';
import { AiTutorModal } from './components/AiTutorModal';
import { PrintView } from './components/PrintView';
import { BookOpen, Sparkles, Trophy, HelpCircle, Layers, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<TestMode>('exam');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [timeSpent, setTimeSpent] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');
  const [highlightedClue, setHighlightedClue] = useState<string | null>(null);

  // Modals state
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [aiTutorState, setAiTutorState] = useState<{ isOpen: boolean; question: Question | null }>({
    isOpen: false,
    question: null,
  });

  // Current Question & Passage
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentPassageIndex = PASSAGES.findIndex((p) => p.id === currentQuestion.passageId);
  const currentPassage = PASSAGES[currentPassageIndex] || PASSAGES[0];

  // Timer Effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
      if (mode === 'exam') {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, mode]);

  // Keyboard shortcut support (A, B, C, D, ArrowLeft, ArrowRight, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isVocabModalOpen || isPrintModalOpen || aiTutorState.isOpen) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && !isSubmitted) {
        handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
      } else if (e.key === 'ArrowRight' && currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      } else if (key === 'F') {
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, isSubmitted, isVocabModalOpen, isPrintModalOpen, aiTutorState.isOpen]);

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const handleSubmitTest = () => {
    const result = calculateScore(userAnswers, timeSpent);
    setTestResult(result);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetTest = () => {
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setIsSubmitted(false);
    setTestResult(null);
    setCurrentQuestionIndex(0);
    setTimeRemaining(60 * 60);
    setTimeSpent(0);
    setActiveFilter('all');
    setHighlightedClue(null);
  };

  const handleSelectPassageTab = (passageIdx: number) => {
    const passage = PASSAGES[passageIdx];
    if (passage && passage.questionIds.length > 0) {
      const firstQId = passage.questionIds[0];
      const qIdx = QUESTIONS.findIndex((q) => q.id === firstQId);
      if (qIdx !== -1) {
        setCurrentQuestionIndex(qIdx);
      }
    }
  };

  const handleJumpToPassage = (passageId: string, clueExcerpt?: string) => {
    const pIdx = PASSAGES.findIndex((p) => p.id === passageId);
    if (pIdx !== -1) {
      const firstQId = PASSAGES[pIdx].questionIds[0];
      const qIdx = QUESTIONS.findIndex((q) => q.id === firstQId);
      if (qIdx !== -1) {
        setCurrentQuestionIndex(qIdx);
      }
      if (clueExcerpt) {
        setHighlightedClue(clueExcerpt);
      }
    }
  };

  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans transition-colors">
      {/* Header */}
      <Header
        mode={mode}
        setMode={setMode}
        timeRemaining={timeRemaining}
        isTimeUp={timeRemaining === 0}
        answeredCount={answeredCount}
        totalQuestions={QUESTIONS.length}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmitTest}
        onReset={handleResetTest}
        onOpenVocabulary={() => setIsVocabModalOpen(true)}
        onOpenPrintView={() => setIsPrintModalOpen(true)}
        currentPassageIndex={currentPassageIndex}
        totalPassages={PASSAGES.length}
        onSelectPassage={handleSelectPassageTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Results Screen if Submitted */}
        {isSubmitted && testResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ResultSummary
              result={testResult}
              questions={QUESTIONS}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              onResetTest={handleResetTest}
              onFilterChange={setActiveFilter}
              activeFilter={activeFilter}
              onOpenVocabulary={() => setIsVocabModalOpen(true)}
              onOpenPrint={() => setIsPrintModalOpen(true)}
              onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
            />

            <DetailedReviewList
              questions={QUESTIONS}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              activeFilter={activeFilter}
              onAskAi={(q) => setAiTutorState({ isOpen: true, question: q })}
              onJumpToPassage={handleJumpToPassage}
            />
          </div>
        )}

        {/* Interactive Workspace (Passage on Left, Question & Navigator on Right) */}
        {!isSubmitted && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Passage Viewer (7 cols) */}
            <div className="lg:col-span-7 h-[calc(100vh-170px)] min-h-[520px] sticky top-20">
              <PassageViewer
                passage={currentPassage}
                highlightedClue={highlightedClue}
              />
            </div>

            {/* Right Column: Question Card + Navigator (5 cols) */}
            <aside className="lg:col-span-5 space-y-6">
              <QuestionCard
                question={currentQuestion}
                selectedOption={userAnswers[currentQuestion.id] || null}
                isFlagged={flaggedQuestions.has(currentQuestion.id)}
                onSelectOption={handleSelectOption}
                onToggleFlag={handleToggleFlag}
                onPrev={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                onNext={() => setCurrentQuestionIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
                hasPrev={currentQuestionIndex > 0}
                hasNext={currentQuestionIndex < QUESTIONS.length - 1}
                mode={mode}
                isSubmitted={isSubmitted}
                onAskAi={(q) => setAiTutorState({ isOpen: true, question: q })}
              />

              <QuestionNavigator
                questions={QUESTIONS}
                currentQuestionIndex={currentQuestionIndex}
                onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
                userAnswers={userAnswers}
                flaggedQuestions={flaggedQuestions}
                isSubmitted={isSubmitted}
              />
            </aside>
          </div>
        )}
      </main>

      {/* Professional Polish Bottom Bar */}
      {!isSubmitted ? (
        <footer className="sticky bottom-0 bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between z-20 shadow-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Quay lại
            </button>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
              disabled={currentQuestionIndex === QUESTIONS.length - 1}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Tiếp theo
            </button>
          </div>

          <div className="flex-1 max-w-md mx-4 sm:mx-8 hidden sm:block">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
            Đã hoàn thành <strong className="text-slate-800">{answeredCount}/{QUESTIONS.length}</strong> câu ({progressPercent}%)
          </p>
        </footer>
      ) : (
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <p>
            Bài tập Đọc hiểu Tiếng Anh Lớp 7 • 30 câu hỏi kèm hướng dẫn giải và thang điểm 10 chuẩn
          </p>
        </footer>
      )}

      {/* Modals */}
      <VocabularyModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />

      <AiTutorModal
        isOpen={aiTutorState.isOpen}
        question={aiTutorState.question}
        passage={currentPassage}
        onClose={() => setAiTutorState({ isOpen: false, question: null })}
      />

      <PrintView
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        result={testResult}
        userAnswers={userAnswers}
      />
    </div>
  );
}
