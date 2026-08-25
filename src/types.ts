export interface VocabularyItem {
  word: string;
  ipa: string;
  pos: string; // part of speech: n, v, adj, adv, phr
  meaning: string;
  example?: string;
}

export interface Question {
  id: number; // 1 to 30
  passageId: string;
  passageTitle: string;
  questionNumber: number; // 1 to 30
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  clueExcerpt: string; // Quote from passage
  detailedExplanation: string; // In Vietnamese
  vocabulary: VocabularyItem[];
  grammarPoint?: string;
  questionType: 'main_idea' | 'detail' | 'vocabulary' | 'reference' | 'inference' | 'cloze';
}

export interface Passage {
  id: string;
  unit: string;
  title: string;
  topicVi: string;
  englishText: string;
  vietnameseTranslation: string;
  paragraphs: string[];
  keyGlossary: VocabularyItem[];
  questionIds: number[];
}

export interface UserAnswer {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isFlagged?: boolean;
  timeSpentSeconds?: number;
}

export type TestMode = 'exam' | 'practice';

export interface TestResult {
  totalQuestions: number; // 30
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  rawScorePercent: number;
  scoreOutOf10: number; // e.g. 8.33
  scoreRating: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Cần cố gắng';
  scoreColor: string;
  timeSpentSeconds: number;
  dateCompleted: string;
  categoryScores: {
    passageId: string;
    passageTitle: string;
    topicVi: string;
    correct: number;
    total: number;
  }[];
}
