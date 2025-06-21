export interface Question {
  id: string;
  question: string;
  category: string;
  categoryCode: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'multiple_choice' | 'yes_no';
  options?: string[];
  followUpTo?: string;
  interviewSection?: string;
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
  { code: 'BI', name: 'Basic Information', color: 'bg-blue-500', section: '1. Opening & Background' },
  { code: 'PB', name: 'Personal Background', color: 'bg-indigo-500', section: '1. Opening & Background' },
  { code: 'PI', name: 'Platform Introduction', color: 'bg-purple-500', section: '2. Platform Basics' },
  { code: 'PO', name: 'Platform Overview', color: 'bg-pink-500', section: '2. Platform Basics' },
  { code: 'WS', name: 'Work Structure', color: 'bg-red-500', section: '3. Work Organization' },
  { code: 'PM', name: 'Platform Management', color: 'bg-teal-500', section: '4. Platform Systems' },
  { code: 'PE', name: 'Payment & Earnings', color: 'bg-orange-500', section: '5. Payment & Income' },
  { code: 'WC', name: 'Work Costs', color: 'bg-amber-500', section: '6. Work Expenses' },
  { code: 'UWT', name: 'Unpaid Work Time', color: 'bg-yellow-500', section: '7. Hidden Labor' },
  { code: 'CT', name: 'Contracts & Terms', color: 'bg-lime-500', section: '8. Legal Framework' },
  { code: 'HS', name: 'Health & Safety', color: 'bg-green-500', section: '9. Health & Safety' },
  { code: 'DP', name: 'Data & Privacy', color: 'bg-emerald-500', section: '10. Data & Privacy' },
  { code: 'SE', name: 'Support Experience', color: 'bg-cyan-500', section: '11. Support Systems' },
  { code: 'DUE', name: 'Due Process', color: 'bg-sky-500', section: '12. Due Process & Appeals' },
  { code: 'DIS', name: 'Discrimination', color: 'bg-blue-600', section: '13. Fair Treatment' },
  { code: 'WV', name: 'Worker Voice', color: 'bg-indigo-600', section: '14. Worker Voice & Representation' },
  { code: 'CA', name: 'Collective Action', color: 'bg-purple-600', section: '15. Collective Action' },
  { code: 'PC', name: 'Platform Comparison', color: 'bg-pink-600', section: '16. Final Assessment' },
  { code: 'RD', name: 'Research Documentation', color: 'bg-gray-500', section: '17. Research Notes' }
];
