
import { Question } from "../types/survey";

export const SURVEY_QUESTIONS: Question[] = [
  // Basic Information
  { id: 'BI_01', question: 'Platform Name', category: 'Basic Information', categoryCode: 'BI', type: 'text' },
  { 
    id: 'BI_02', 
    question: 'Employment Type', 
    category: 'Basic Information', 
    categoryCode: 'BI', 
    type: 'dropdown',
    options: ['Employee', 'Freelancer', 'Contractor', 'Self-employed', 'Other']
  },
  { id: 'BI_03', question: 'Interview Code & Date', category: 'Basic Information', categoryCode: 'BI', type: 'text' },

  // Personal Background
  { 
    id: 'PB_01', 
    question: 'Age and highest education level', 
    category: 'Personal Background', 
    categoryCode: 'PB', 
    type: 'dropdown',
    options: ['18-25, High School', '18-25, College/University', '26-35, High School', '26-35, College/University', '36-45, High School', '36-45, College/University', '46-55, High School', '46-55, College/University', '55+, High School', '55+, College/University', 'Prefer not to say']
  },

  // Platform Introduction
  { 
    id: 'PI_01', 
    question: 'How long have you been working for this platform?', 
    category: 'Platform Introduction', 
    categoryCode: 'PI',
    type: 'dropdown',
    options: ['Less than 1 month', '1-3 months', '3-6 months', '6-12 months', '1-2 years', '2+ years']
  },

  // Platform Overview
  { 
    id: 'PO_01', 
    question: 'Is this your main job or do you have others?', 
    category: 'Platform Overview', 
    categoryCode: 'PO',
    type: 'dropdown',
    options: ['This is my main job', 'I have other jobs too', 'This is a side job']
  },
  { id: 'PO_02', question: 'What challenges do you face with this work?', category: 'Platform Overview', categoryCode: 'PO', type: 'textarea' },
  { id: 'PO_03', question: 'How does income compare to your previous job?', category: 'Platform Overview', categoryCode: 'PO', type: 'dropdown', options: ['Much better', 'Somewhat better', 'About the same', 'Somewhat worse', 'Much worse', 'No previous job'] },

  // Work Structure
  { id: 'WS_01', question: 'How many hours per day/week do you work?', category: 'Work Structure', categoryCode: 'WS', type: 'text' },
  { 
    id: 'WS_02', 
    question: 'Are you paid hourly or per task/service?', 
    category: 'Work Structure', 
    categoryCode: 'WS',
    type: 'dropdown',
    options: ['Hourly', 'Per task', 'Per service', 'Fixed salary', 'Commission-based', 'Other']
  },
  { id: 'WS_03', question: 'How does the app assign tasks?', category: 'Work Structure', categoryCode: 'WS', type: 'textarea' },
  { id: 'WS_04', question: 'If you don\'t want a task can you cancel without penalty?', category: 'Work Structure', categoryCode: 'WS', type: 'yesno' },

  // Payment & Earnings
  { id: 'PE_01', question: 'How much do you earn per hour/task?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'text' },
  { id: 'PE_02', question: 'How much do you make per week/month from the platform?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'text' },
  { 
    id: 'PE_03', 
    question: 'How frequently are you paid?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE',
    type: 'dropdown',
    options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'After each task', 'Other']
  },
  { id: 'PE_04', question: 'Is payment always on time? Any delays?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'yesno' },
  { id: 'PE_05', question: 'Is payment always made in full? Any deductions?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'yesno' },
  { id: 'PE_06', question: 'How do you receive payment? Can you choose currency?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'textarea' },

  // Work Costs
  { id: 'WC_01', question: 'What proportion of your income goes to work costs?', category: 'Work Costs', categoryCode: 'WC', type: 'dropdown', options: ['0-10%', '10-25%', '25-50%', '50-75%', '75%+'] },
  { id: 'WC_02', question: 'Do you pay commission or fees to the platform?', category: 'Work Costs', categoryCode: 'WC', type: 'yesno' },
  { id: 'WC_03', question: 'Does your income fluctuate? Why?', category: 'Work Costs', categoryCode: 'WC', type: 'textarea' },

  // Unpaid Work Time
  { id: 'UWT_01', question: 'Is some work time unpaid (like applying for jobs)? How much?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'textarea' },
  { id: 'UWT_02', question: 'Do you take excessive risks to get work or get paid?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'yesno' },

  // Contracts & Terms
  { id: 'CT_01', question: 'Do you have an employment contract or terms & conditions?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_02', question: 'Are terms clear and understandable?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_03', question: 'Do you have digital access to the contract?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_04', question: 'Where can you access the contract/terms?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'textarea' },
  { id: 'CT_05', question: 'Do terms include pay details bonuses incentives?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_06', question: 'If contract changes are you notified? How far ahead?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'textarea' },

  // Health & Safety
  { id: 'HS_01', question: 'Does work affect your physical or mental health?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { id: 'HS_02', question: 'Does the platform take steps to address health risks?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { id: 'HS_03', question: 'Did you receive safety training?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { id: 'HS_04', question: 'Does platform provide insurance? What does it cover?', category: 'Health & Safety', categoryCode: 'HS', type: 'textarea' },

  // Data & Privacy
  { id: 'DP_01', question: 'What data does the platform collect about you?', category: 'Data & Privacy', categoryCode: 'DP', type: 'textarea' },
  { id: 'DP_02', question: 'Does platform inform you about data collection?', category: 'Data & Privacy', categoryCode: 'DP', type: 'yesno' },
  { id: 'DP_03', question: 'What measures protect your data?', category: 'Data & Privacy', categoryCode: 'DP', type: 'textarea' },

  // Platform Management
  { id: 'PM_01', question: 'How does the rating system work?', category: 'Platform Management', categoryCode: 'PM', type: 'textarea' },
  { id: 'PM_02', question: 'Can you appeal a bad rating?', category: 'Platform Management', categoryCode: 'PM', type: 'yesno' },
  { id: 'PM_03', question: 'Who do you contact when something goes wrong?', category: 'Platform Management', categoryCode: 'PM', type: 'textarea' },
  { id: 'PM_04', question: 'What channels exist for wage issues?', category: 'Platform Management', categoryCode: 'PM', type: 'textarea' },

  // Support Experience
  { id: 'SE_01', question: 'Have you contacted support before?', category: 'Support Experience', categoryCode: 'SE', type: 'yesno' },
  { id: 'SE_02', question: 'What was the issue and how was it handled?', category: 'Support Experience', categoryCode: 'SE', type: 'textarea' },

  // Due Process
  { id: 'DUE_01', question: 'Have you experienced disciplinary action or deactivation?', category: 'Due Process', categoryCode: 'DUE', type: 'yesno' },
  { id: 'DUE_02', question: 'How can you contest management decisions?', category: 'Due Process', categoryCode: 'DUE', type: 'textarea' },
  { id: 'DUE_03', question: 'Can you reach platform directly if there are supervisor problems?', category: 'Due Process', categoryCode: 'DUE', type: 'yesno' },

  // Discrimination
  { id: 'DIS_01', question: 'Have you felt discriminated against based on your identity?', category: 'Discrimination', categoryCode: 'DIS', type: 'yesno' },
  { id: 'DIS_02', question: 'Are there anti-discrimination policies?', category: 'Discrimination', categoryCode: 'DIS', type: 'yesno' },

  // Worker Voice
  { id: 'WV_01', question: 'What say do you have in shaping platform policies?', category: 'Worker Voice', categoryCode: 'WV', type: 'textarea' },
  { id: 'WV_02', question: 'Are there collective mechanisms to empower workers?', category: 'Worker Voice', categoryCode: 'WV', type: 'yesno' },
  { id: 'WV_03', question: 'What channels do workers use to share ideas collectively?', category: 'Worker Voice', categoryCode: 'WV', type: 'textarea' },

  // Collective Action
  { id: 'CA_01', question: 'Is there a worker group the platform recognizes?', category: 'Collective Action', categoryCode: 'CA', type: 'yesno' },
  { id: 'CA_02', question: 'Can workers demonstrate strike or take collective action?', category: 'Collective Action', categoryCode: 'CA', type: 'yesno' },

  // Platform Comparison
  { id: 'PC_01', question: 'How does this platform compare to others in the sector?', category: 'Platform Comparison', categoryCode: 'PC', type: 'textarea' },
  { id: 'PC_02', question: 'What one thing would you change about this platform?', category: 'Platform Comparison', categoryCode: 'PC', type: 'textarea' },

  // Research Documentation
  { id: 'RD_01', question: 'Key quotes and observations', category: 'Research Documentation', categoryCode: 'RD', type: 'textarea' },
  { id: 'RD_02', question: 'Interviewer reflections', category: 'Research Documentation', categoryCode: 'RD', type: 'textarea' }
];
