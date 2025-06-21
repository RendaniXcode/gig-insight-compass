
export interface Question {
  id: string;
  question: string;
  category: string;
  categoryCode: string;
  type?: 'text' | 'textarea' | 'dropdown' | 'yesno';
  options?: string[];
}

export interface SurveyResponse {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  platformName: string;
  employmentType: string;
  interviewCode: string;
  interviewDate: string;
  interviewer: string;
  interviewerEmail?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  responses: SurveyResponse[];
  currentQuestionIndex: number;
  completedCategories: string[];
  startTime: Date;
  endTime?: Date;
  lastUpdated: Date;
}

export const SURVEY_CATEGORIES = [
  { code: 'BI', name: 'Basic Information', color: 'bg-blue-500' },
  { code: 'PB', name: 'Personal Background', color: 'bg-indigo-500' },
  { code: 'PI', name: 'Platform Introduction', color: 'bg-purple-500' },
  { code: 'PO', name: 'Platform Overview', color: 'bg-pink-500' },
  { code: 'WS', name: 'Work Structure', color: 'bg-red-500' },
  { code: 'PE', name: 'Payment & Earnings', color: 'bg-orange-500' },
  { code: 'WC', name: 'Work Costs', color: 'bg-amber-500' },
  { code: 'UWT', name: 'Unpaid Work Time', color: 'bg-yellow-500' },
  { code: 'CT', name: 'Contracts & Terms', color: 'bg-lime-500' },
  { code: 'HS', name: 'Health & Safety', color: 'bg-green-500' },
  { code: 'DP', name: 'Data & Privacy', color: 'bg-emerald-500' },
  { code: 'PM', name: 'Platform Management', color: 'bg-teal-500' },
  { code: 'SE', name: 'Support Experience', color: 'bg-cyan-500' },
  { code: 'DUE', name: 'Due Process', color: 'bg-sky-500' },
  { code: 'DIS', name: 'Discrimination', color: 'bg-blue-600' },
  { code: 'WV', name: 'Worker Voice', color: 'bg-indigo-600' },
  { code: 'CA', name: 'Collective Action', color: 'bg-purple-600' },
  { code: 'PC', name: 'Platform Comparison', color: 'bg-pink-600' },
  { code: 'RD', name: 'Research Documentation', color: 'bg-gray-500' }
];
