
const API_BASE_URL = 'https://450yg9qnl0.execute-api.eu-west-1.amazonaws.com/prod';

export interface ApiQuestion {
  id: string;
  question: string;
  category: string;
  categoryCode: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'multiple_choice' | 'yes_no' | 'multipleChoice';
  options?: string[];
  followUpTo?: string;
  interviewSection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSession {
  id: string;
  interviewer: string;
  interviewerEmail: string;
  interviewDate: string;
  platformName: string;
  employmentType: string;
  interviewCode: string;
  startTime: string;
  lastUpdated: string;
  status: 'not-started' | 'in_progress' | 'in-progress' | 'completed';
  completedCategories: string[];
  currentQuestionIndex: number;
  endTime?: string;
}

export interface ApiResponse {
  sessionId: string;
  questionId: string;
  answer: string;
  timestamp: string;
}

export interface NextQuestionResponse {
  question?: ApiQuestion;
  categoryComplete: boolean;
  currentCategory: string;
  message?: string;
}

class SurveyApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Questions API
  async getQuestions(): Promise<{ questions: ApiQuestion[] }> {
    return this.request<{ questions: ApiQuestion[] }>('/questions');
  }

  async createQuestion(question: Omit<ApiQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiQuestion> {
    return this.request<ApiQuestion>('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  }

  // Sessions API
  async createSession(session: {
    interviewer: string;
    interviewerEmail: string;
    interviewDate: string;
    platformName: string;
    employmentType: string;
    interviewCode: string;
  }): Promise<ApiSession> {
    return this.request<ApiSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async getSession(sessionId: string): Promise<ApiSession> {
    return this.request<ApiSession>(`/sessions/${sessionId}`);
  }

  async updateSession(sessionId: string, updates: Partial<ApiSession>): Promise<ApiSession> {
    return this.request<ApiSession>(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getSessions(): Promise<{ sessions?: ApiSession[] }> {
    return this.request<{ sessions?: ApiSession[] }>('/sessions');
  }

  // Responses API
  async getResponses(sessionId: string): Promise<{ responses: ApiResponse[] }> {
    return this.request<{ responses: ApiResponse[] }>(`/sessions/${sessionId}/responses`);
  }

  async createResponse(sessionId: string, response: {
    questionId: string;
    answer: string;
  }): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/sessions/${sessionId}/responses`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }

  async updateResponse(sessionId: string, questionId: string, answer: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/sessions/${sessionId}/responses/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify({ answer }),
    });
  }

  // Survey Flow API
  async getNextQuestion(sessionId: string): Promise<NextQuestionResponse> {
    return this.request<NextQuestionResponse>(`/survey/sessions/${sessionId}/next-question`);
  }

  async submitResponse(sessionId: string, response: {
    questionId: string;
    answer: string;
  }): Promise<ApiResponse & { message: string }> {
    return this.request<ApiResponse & { message: string }>(`/survey/sessions/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify(response),
    });
  }
}

export const surveyApi = new SurveyApiService();
