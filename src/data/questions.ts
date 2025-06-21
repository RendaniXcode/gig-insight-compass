
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
    question: 'What is your age?', 
    category: 'Personal Background', 
    categoryCode: 'PB', 
    type: 'dropdown',
    options: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+', 'Prefer not to say']
  },
  { 
    id: 'PB_02', 
    question: 'What is your highest education level?', 
    category: 'Personal Background', 
    categoryCode: 'PB', 
    type: 'dropdown',
    options: ['Elementary School', 'High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Trade/Technical School', 'Other', 'Prefer not to say']
  },

  // Platform Introduction
  { 
    id: 'PI_01', 
    question: 'How long have you been working for this platform?', 
    category: 'Platform Introduction', 
    categoryCode: 'PI',
    type: 'dropdown',
    options: ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '7 months', '8 months', '9 months', '10 months', '11 months', '12 months', '1 year', '2 years', '3 years', '4 years', '5+ years']
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
  { 
    id: 'PE_04', 
    question: 'Is payment always on time?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'dropdown',
    options: ['Always on time', 'Usually on time', 'Sometimes delayed', 'Often delayed', 'Never on time']
  },
  { 
    id: 'PE_05', 
    question: 'Are there any payment delays? If yes, how often?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'dropdown',
    options: ['No delays', 'Rare delays', 'Occasional delays', 'Frequent delays', 'Always delayed']
  },
  { 
    id: 'PE_06', 
    question: 'Is payment always made in full?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'dropdown',
    options: ['Always full payment', 'Usually full payment', 'Sometimes deductions', 'Often deductions', 'Never full payment']
  },
  { 
    id: 'PE_07', 
    question: 'What types of deductions are made from your payment?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'dropdown',
    options: ['No deductions', 'Platform fees', 'Service charges', 'Penalties', 'Taxes', 'Other', 'Multiple types']
  },
  { 
    id: 'PE_08', 
    question: 'How do you receive payment?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'dropdown',
    options: ['Bank transfer', 'Digital wallet', 'Cash', 'Check', 'Cryptocurrency', 'Other']
  },
  { 
    id: 'PE_09', 
    question: 'Can you choose your payment currency?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'yesno'
  },

  // Work Costs
  { id: 'WC_01', question: 'What proportion of your income goes to work costs?', category: 'Work Costs', categoryCode: 'WC', type: 'dropdown', options: ['0-10%', '10-25%', '25-50%', '50-75%', '75%+'] },
  { id: 'WC_02', question: 'Do you pay commission or fees to the platform?', category: 'Work Costs', categoryCode: 'WC', type: 'yesno' },
  { 
    id: 'WC_03', 
    question: 'Does your income fluctuate?', 
    category: 'Work Costs', 
    categoryCode: 'WC', 
    type: 'dropdown',
    options: ['Very stable', 'Somewhat stable', 'Moderate fluctuation', 'High fluctuation', 'Extremely unpredictable']
  },
  { 
    id: 'WC_04', 
    question: 'What causes your income to fluctuate?', 
    category: 'Work Costs', 
    categoryCode: 'WC', 
    type: 'textarea'
  },

  // Unpaid Work Time
  { id: 'UWT_01', question: 'Is some work time unpaid (like applying for jobs)? How much?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'textarea' },
  { id: 'UWT_02', question: 'Do you take excessive risks to get work or get paid?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'yesno' },

  // Contracts & Terms
  { id: 'CT_01', question: 'Do you have an employment contract or terms & conditions?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_02', question: 'Are terms clear and understandable?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_03', question: 'Do you have digital access to the contract?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { id: 'CT_04', question: 'Where can you access the contract/terms?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'textarea' },
  { id: 'CT_05', question: 'Do terms include pay details bonuses incentives?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yesno' },
  { 
    id: 'CT_06', 
    question: 'If contract changes, are you notified?', 
    category: 'Contracts & Terms', 
    categoryCode: 'CT', 
    type: 'yesno'
  },
  { 
    id: 'CT_07', 
    question: 'How far ahead are you notified about contract changes?', 
    category: 'Contracts & Terms', 
    categoryCode: 'CT', 
    type: 'dropdown',
    options: ['No notification', 'Same day', '1-3 days', '1 week', '2 weeks', '1 month', '2+ months']
  },

  // Health & Safety
  { id: 'HS_01', question: 'Does work affect your physical or mental health?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { id: 'HS_02', question: 'Does the platform take steps to address health risks?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { id: 'HS_03', question: 'Did you receive safety training?', category: 'Health & Safety', categoryCode: 'HS', type: 'yesno' },
  { 
    id: 'HS_04', 
    question: 'Does platform provide insurance?', 
    category: 'Health & Safety', 
    categoryCode: 'HS', 
    type: 'yesno'
  },
  { 
    id: 'HS_05', 
    question: 'What does the insurance cover?', 
    category: 'Health & Safety', 
    categoryCode: 'HS', 
    type: 'textarea'
  },

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
  { 
    id: 'DUE_01', 
    question: 'Have you experienced disciplinary action?', 
    category: 'Due Process', 
    categoryCode: 'DUE', 
    type: 'yesno'
  },
  { 
    id: 'DUE_02', 
    question: 'Have you experienced account deactivation?', 
    category: 'Due Process', 
    categoryCode: 'DUE', 
    type: 'yesno'
  },
  { 
    id: 'DUE_03', 
    question: 'How can you contest management decisions?', 
    category: 'Due Process', 
    categoryCode: 'DUE', 
    type: 'textarea'
  },
  { 
    id: 'DUE_04', 
    question: 'Can you reach platform directly if there are supervisor problems?', 
    category: 'Due Process', 
    categoryCode: 'DUE', 
    type: 'yesno'
  },

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
