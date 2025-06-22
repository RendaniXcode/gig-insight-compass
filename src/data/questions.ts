
import { Question } from "../types/survey";

export const SURVEY_QUESTIONS: Question[] = [
  // Basic Information
  { id: 'BI_01', question: 'Platform Name', category: 'Basic Information', categoryCode: 'BI', type: 'text', interviewSection: '1. Opening & Background' },
  { 
    id: 'BI_02', 
    question: 'Employment Type', 
    category: 'Basic Information', 
    categoryCode: 'BI', 
    type: 'multiple_choice',
    options: ['Employee', 'Freelancer', 'Contractor', 'Self-employed', 'Other'],
    interviewSection: '1. Opening & Background'
  },
  { id: 'BI_03', question: 'Interview Code', category: 'Basic Information', categoryCode: 'BI', type: 'text', interviewSection: '1. Opening & Background' },
  { id: 'BI_04', question: 'Interview Date', category: 'Basic Information', categoryCode: 'BI', type: 'date', interviewSection: '1. Opening & Background' },

  // Personal Background
  { 
    id: 'PB_01', 
    question: 'Age', 
    category: 'Personal Background', 
    categoryCode: 'PB', 
    type: 'multiple_choice',
    options: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+', 'Other'],
    interviewSection: '1. Opening & Background'
  },
  { 
    id: 'PB_02', 
    question: 'Highest education level', 
    category: 'Personal Background', 
    categoryCode: 'PB', 
    type: 'multiple_choice',
    options: ['Elementary School', 'High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate', 'Trade/Technical School', 'Other'],
    interviewSection: '1. Opening & Background'
  },

  // Platform Introduction
  { id: 'PI_01', question: 'How long have you been working for this platform?', category: 'Platform Introduction', categoryCode: 'PI', type: 'text', interviewSection: '2. Platform Basics' },

  // Platform Overview
  { id: 'PO_01', question: 'Is this platform your main job?', category: 'Platform Overview', categoryCode: 'PO', type: 'yes_no', interviewSection: '2. Platform Basics' },
  { id: 'PO_01a', question: 'What other jobs do you have?', category: 'Platform Overview', categoryCode: 'PO', type: 'text', followUpTo: 'PO_01', interviewSection: '2. Platform Basics' },
  { id: 'PO_03', question: 'Did you have a previous job before this platform?', category: 'Platform Overview', categoryCode: 'PO', type: 'yes_no', interviewSection: '2. Platform Basics' },
  { 
    id: 'PO_03a', 
    question: 'How does your income from this platform compare to your previous job?', 
    category: 'Platform Overview', 
    categoryCode: 'PO', 
    type: 'multiple_choice',
    options: ['Much better', 'Somewhat better', 'About the same', 'Somewhat worse', 'Much worse'],
    followUpTo: 'PO_03',
    interviewSection: '2. Platform Basics'
  },

  // Work Structure
  { id: 'WS_01', question: 'How many hours per day do you work on this platform?', category: 'Work Structure', categoryCode: 'WS', type: 'number', interviewSection: '3. Work Organization' },
  { id: 'WS_01a', question: 'How many hours per week do you work on this platform?', category: 'Work Structure', categoryCode: 'WS', type: 'number', followUpTo: 'WS_01', interviewSection: '3. Work Organization' },
  { 
    id: 'WS_02', 
    question: 'Are you paid hourly or per task/service?', 
    category: 'Work Structure', 
    categoryCode: 'WS', 
    type: 'multiple_choice',
    options: ['Hourly', 'Per task', 'Per service', 'Fixed salary', 'Commission-based', 'Other'],
    interviewSection: '3. Work Organization'
  },
  { id: 'WS_03', question: 'How does the app assign tasks to you?', category: 'Work Structure', categoryCode: 'WS', type: 'text', interviewSection: '3. Work Organization' },
  { id: 'WS_04', question: 'Can you choose not to take a task?', category: 'Work Structure', categoryCode: 'WS', type: 'yes_no', interviewSection: '3. Work Organization' },
  { id: 'WS_04a', question: 'Is there a penalty for canceling a task?', category: 'Work Structure', categoryCode: 'WS', type: 'yes_no', followUpTo: 'WS_04', interviewSection: '3. Work Organization' },
  { id: 'WS_04b', question: 'What penalties do you face for canceling tasks?', category: 'Work Structure', categoryCode: 'WS', type: 'text', followUpTo: 'WS_04a', interviewSection: '3. Work Organization' },

  // Platform Management
  { id: 'PM_01', question: 'Is there a rating system?', category: 'Platform Management', categoryCode: 'PM', type: 'yes_no', interviewSection: '4. Platform Systems' },
  { id: 'PM_01a', question: 'How does the rating system work?', category: 'Platform Management', categoryCode: 'PM', type: 'text', followUpTo: 'PM_01', interviewSection: '4. Platform Systems' },
  { id: 'PM_02', question: 'Can you appeal a bad rating?', category: 'Platform Management', categoryCode: 'PM', type: 'yes_no', interviewSection: '4. Platform Systems' },

  // Payment & Earnings
  { id: 'PE_01', question: 'How much do you earn per hour?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'number', interviewSection: '5. Payment & Income' },
  { id: 'PE_01a', question: 'How much do you earn per task/service?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'number', interviewSection: '5. Payment & Income' },
  { id: 'PE_02', question: 'How much do you make per week from the platform?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'number', interviewSection: '5. Payment & Income' },
  { id: 'PE_02a', question: 'How much do you make per month from the platform?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'number', interviewSection: '5. Payment & Income' },
  { 
    id: 'PE_03', 
    question: 'How frequently are you paid?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'multiple_choice',
    options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'After each task', 'Other'],
    interviewSection: '5. Payment & Income'
  },
  { id: 'PE_04', question: 'Is payment always on time?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'yes_no', interviewSection: '5. Payment & Income' },
  { 
    id: 'PE_04a', 
    question: 'How often do you experience payment delays?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'multiple_choice',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
    followUpTo: 'PE_04',
    interviewSection: '5. Payment & Income'
  },
  { id: 'PE_04b', question: 'What causes payment delays?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'text', followUpTo: 'PE_04a', interviewSection: '5. Payment & Income' },
  { id: 'PE_05', question: 'Is payment always made in full?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'yes_no', interviewSection: '5. Payment & Income' },
  { id: 'PE_05a', question: 'What deductions are made from your payment?', category: 'Payment & Earnings', categoryCode: 'PE', type: 'text', followUpTo: 'PE_05', interviewSection: '5. Payment & Income' },
  { 
    id: 'PE_06', 
    question: 'How do you receive payment?', 
    category: 'Payment & Earnings', 
    categoryCode: 'PE', 
    type: 'multiple_choice',
    options: ['Bank transfer', 'Digital wallet', 'Cash', 'Check', 'Cryptocurrency', 'Other'],
    interviewSection: '5. Payment & Income'
  },

  // Work Costs - Updated with "Other" option for percentage questions
  { 
    id: 'WC_01', 
    question: 'What proportion of your income goes to work costs?', 
    category: 'Work Costs', 
    categoryCode: 'WC', 
    type: 'multiple_choice',
    options: ['0-10%', '10-25%', '25-50%', '50-75%', '75%+', 'Other'],
    interviewSection: '6. Work Expenses'
  },
  { id: 'WC_02', question: 'Do you pay commission or fees to the platform?', category: 'Work Costs', categoryCode: 'WC', type: 'yes_no', interviewSection: '6. Work Expenses' },
  { 
    id: 'WC_02a', 
    question: 'What percentage commission/fees do you pay?', 
    category: 'Work Costs', 
    categoryCode: 'WC', 
    type: 'multiple_choice',
    options: ['0-5%', '5-10%', '10-15%', '15-20%', '20-25%', '25-30%', '30%+', 'Other'],
    followUpTo: 'WC_02', 
    interviewSection: '6. Work Expenses'
  },
  { id: 'WC_03', question: 'Does your income fluctuate week to week?', category: 'Work Costs', categoryCode: 'WC', type: 'yes_no', interviewSection: '6. Work Expenses' },
  { id: 'WC_03a', question: 'Why does your income fluctuate?', category: 'Work Costs', categoryCode: 'WC', type: 'text', followUpTo: 'WC_03', interviewSection: '6. Work Expenses' },

  // Unpaid Work Time
  { id: 'UWT_01', question: 'Do you have unpaid work time?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'yes_no', interviewSection: '7. Hidden Labor' },
  { id: 'UWT_01a', question: 'How many hours per day you work for unpaid work?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'number', followUpTo: 'UWT_01', interviewSection: '7. Hidden Labor' },
  { id: 'UWT_01b', question: 'What unpaid activities do you do?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'text', followUpTo: 'UWT_01', interviewSection: '7. Hidden Labor' },
  { id: 'PO_02', question: 'What challenges do you face with this work?', category: 'Platform Overview', categoryCode: 'PO', type: 'text', interviewSection: '7. Hidden Labor' },
  { id: 'UWT_02', question: 'Do you take excessive risks to get work done?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'yes_no', interviewSection: '7. Hidden Labor' },
  { id: 'UWT_02a', question: 'Do you take excessive risks to get paid?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'yes_no', interviewSection: '7. Hidden Labor' },
  { id: 'UWT_02b', question: 'What risks do you take while doing the work?', category: 'Unpaid Work Time', categoryCode: 'UWT', type: 'text', followUpTo: 'UWT_02', interviewSection: '7. Hidden Labor' },

  // Contracts & Terms
  { id: 'CT_01', question: 'Do you have an employment contract?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_01a', question: 'Do you understand the terms and conditions?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', followUpTo: 'CT_01', interviewSection: '8. Legal Framework' },
  { id: 'CT_02', question: 'Are the terms clear and understandable?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_03', question: 'Do you have digital access to the contract?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_04', question: 'Where can you access the contract/terms?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'text', interviewSection: '8. Legal Framework' },
  { id: 'CT_05', question: 'Do terms include pay details?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_05a', question: 'Do terms include bonus details?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_05b', question: 'Do terms include incentive details?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { id: 'CT_06', question: 'Are you notified when contract changes?', category: 'Contracts & Terms', categoryCode: 'CT', type: 'yes_no', interviewSection: '8. Legal Framework' },
  { 
    id: 'CT_06a', 
    question: 'How far ahead are you notified of changes?', 
    category: 'Contracts & Terms', 
    categoryCode: 'CT', 
    type: 'multiple_choice',
    options: ['No notification', 'Same day', '1-3 days', '1 week', '2 weeks', '1 month', '2+ months', 'Other'],
    followUpTo: 'CT_06',
    interviewSection: '8. Legal Framework'
  },

  // Health & Safety
  { id: 'HS_01', question: 'Does work affect your physical health?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_01a', question: 'Does work affect your mental health?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_01b', question: 'How does work affect your health?', category: 'Health & Safety', categoryCode: 'HS', type: 'text', followUpTo: 'HS_01', interviewSection: '9. Health & Safety' },
  { id: 'HS_02', question: 'Does the platform address health risks?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_02a', question: 'What steps does the platform take for health risks?', category: 'Health & Safety', categoryCode: 'HS', type: 'text', followUpTo: 'HS_02', interviewSection: '9. Health & Safety' },
  { id: 'HS_03', question: 'Did you receive safety training?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_04', question: 'Does platform provide insurance?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_04a', question: 'Do you pay for insurance?', category: 'Health & Safety', categoryCode: 'HS', type: 'yes_no', interviewSection: '9. Health & Safety' },
  { id: 'HS_04b', question: 'What insurance do you pay?', category: 'Health & Safety', categoryCode: 'HS', type: 'text', followUpTo: 'HS_04', interviewSection: '9. Health & Safety' },

  // Data & Privacy
  { id: 'DP_01', question: 'Do you know what data the platform collects about you?', category: 'Data & Privacy', categoryCode: 'DP', type: 'yes_no', interviewSection: '10. Data & Privacy' },
  { id: 'DP_01a', question: 'What data does the platform collect?', category: 'Data & Privacy', categoryCode: 'DP', type: 'text', followUpTo: 'DP_01', interviewSection: '10. Data & Privacy' },
  { id: 'DP_02', question: 'Does platform inform you about data collection?', category: 'Data & Privacy', categoryCode: 'DP', type: 'yes_no', interviewSection: '10. Data & Privacy' },
  { id: 'DP_03', question: 'Do you know what the measures to protect your data?', category: 'Data & Privacy', categoryCode: 'DP', type: 'yes_no', interviewSection: '10. Data & Privacy' },
  { id: 'DP_03a', question: 'What measures can you take to protect your data?', category: 'Data & Privacy', categoryCode: 'DP', type: 'text', followUpTo: 'DP_03', interviewSection: '10. Data & Privacy' },

  // Platform Management (Support Systems)
  { id: 'PM_03', question: 'Do you know who to contact when something goes wrong?', category: 'Platform Management', categoryCode: 'PM', type: 'yes_no', interviewSection: '11. Support Systems' },
  { id: 'PM_03a', question: 'Who do you contact when something goes wrong?', category: 'Platform Management', categoryCode: 'PM', type: 'text', followUpTo: 'PM_03', interviewSection: '11. Support Systems' },
  { id: 'PM_04', question: 'Are there channels for wage issues?', category: 'Platform Management', categoryCode: 'PM', type: 'yes_no', interviewSection: '11. Support Systems' },
  { id: 'PM_04a', question: 'What channels exist for wage issues?', category: 'Platform Management', categoryCode: 'PM', type: 'text', followUpTo: 'PM_04', interviewSection: '11. Support Systems' },
  { id: 'PM_05', question: 'Are there channels for suspension/deactivation issues?', category: 'Platform Management', categoryCode: 'PM', type: 'yes_no', interviewSection: '11. Support Systems' },
  { id: 'PM_05a', question: 'What channels exist for contact if you are suspension/deactivation?', category: 'Platform Management', categoryCode: 'PM', type: 'text', followUpTo: 'PM_05', interviewSection: '11. Support Systems' },

  // Support Experience
  { id: 'SE_01', question: 'Have you contacted support before?', category: 'Support Experience', categoryCode: 'SE', type: 'yes_no', interviewSection: '11. Support Systems' },
  { id: 'SE_02', question: 'What was the issue you contacted support about?', category: 'Support Experience', categoryCode: 'SE', type: 'text', followUpTo: 'SE_01', interviewSection: '11. Support Systems' },
  { id: 'SE_02a', question: 'How was the issue handled?', category: 'Support Experience', categoryCode: 'SE', type: 'text', followUpTo: 'SE_01', interviewSection: '11. Support Systems' },
  { id: 'SE_02b', question: 'Could it have been handled better?', category: 'Support Experience', categoryCode: 'SE', type: 'yes_no', followUpTo: 'SE_01', interviewSection: '11. Support Systems' },

  // Due Process
  { id: 'DUE_01', question: 'Have you experienced disciplinary action?', category: 'Due Process', categoryCode: 'DUE', type: 'yes_no', interviewSection: '12. Due Process & Appeals' },
  { id: 'DUE_01a', question: 'Have you experienced deactivation?', category: 'Due Process', categoryCode: 'DUE', type: 'yes_no', interviewSection: '12. Due Process & Appeals' },
  { id: 'DUE_01b', question: 'What disciplinary action did you experience?', category: 'Due Process', categoryCode: 'DUE', type: 'text', followUpTo: 'DUE_01', interviewSection: '12. Due Process & Appeals' },
  { id: 'DUE_02', question: 'Do you know how to contest management decisions?', category: 'Due Process', categoryCode: 'DUE', type: 'yes_no', interviewSection: '12. Due Process & Appeals' },
  { id: 'DUE_02a', question: 'How can you contest management decisions?', category: 'Due Process', categoryCode: 'DUE', type: 'text', followUpTo: 'DUE_02', interviewSection: '12. Due Process & Appeals' },
  { id: 'DUE_03', question: 'Can you reach the platform directly for supervisor problems?', category: 'Due Process', categoryCode: 'DUE', type: 'yes_no', interviewSection: '12. Due Process & Appeals' },

  // Collective Action (Appeals)
  { id: 'CA_03', question: 'Do you know how to appeal bad ratings?', category: 'Collective Action', categoryCode: 'CA', type: 'yes_no', interviewSection: '12. Due Process & Appeals' },
  { id: 'CA_03a', question: 'How do you appeal bad ratings or decisions?', category: 'Collective Action', categoryCode: 'CA', type: 'text', followUpTo: 'CA_03', interviewSection: '12. Due Process & Appeals' },

  // Discrimination
  { id: 'DIS_01', question: 'Have you felt discriminated against based on your identity?', category: 'Discrimination', categoryCode: 'DIS', type: 'yes_no', interviewSection: '13. Fair Treatment' },
  { id: 'DIS_01a', question: 'What discrimination did you experience?', category: 'Discrimination', categoryCode: 'DIS', type: 'text', followUpTo: 'DIS_01', interviewSection: '13. Fair Treatment' },
  { id: 'DIS_02', question: 'Are there anti-discrimination policies?', category: 'Discrimination', categoryCode: 'DIS', type: 'yes_no', interviewSection: '13. Fair Treatment' },

  // Worker Voice
  { id: 'WV_01', question: 'Do you have any say in shaping platform policies?', category: 'Worker Voice', categoryCode: 'WV', type: 'yes_no', interviewSection: '14. Worker Voice & Representation' },
  { id: 'WV_01a', question: 'What influence do you have on platform policies?', category: 'Worker Voice', categoryCode: 'WV', type: 'text', followUpTo: 'WV_01', interviewSection: '14. Worker Voice & Representation' },
  { id: 'WV_02', question: 'Are there collective mechanisms to empower workers?', category: 'Worker Voice', categoryCode: 'WV', type: 'yes_no', interviewSection: '14. Worker Voice & Representation' },
  { id: 'WV_03', question: 'Do workers have channels to share ideas collectively?', category: 'Worker Voice', categoryCode: 'WV', type: 'yes_no', interviewSection: '14. Worker Voice & Representation' },
  { id: 'WV_03a', question: 'What channels do workers use to share ideas?', category: 'Worker Voice', categoryCode: 'WV', type: 'text', followUpTo: 'WV_03', interviewSection: '14. Worker Voice & Representation' },
  { id: 'WV_04', question: 'Can all workers participate in these discussions?', category: 'Worker Voice', categoryCode: 'WV', type: 'yes_no', interviewSection: '14. Worker Voice & Representation' },

  // Collective Action
  { id: 'CA_01', question: 'Is there a worker group the platform recognizes?', category: 'Collective Action', categoryCode: 'CA', type: 'yes_no', interviewSection: '15. Collective Action' },
  { id: 'CA_02', question: 'Can workers demonstrate or strike?', category: 'Collective Action', categoryCode: 'CA', type: 'yes_no', interviewSection: '15. Collective Action' },
  { id: 'CA_02a', question: 'Can workers take collective action?', category: 'Collective Action', categoryCode: 'CA', type: 'yes_no', interviewSection: '15. Collective Action' },

  // Platform Comparison
  { 
    id: 'PC_01', 
    question: 'How does this platform compare to others in the sector?', 
    category: 'Platform Comparison', 
    categoryCode: 'PC', 
    type: 'multiple_choice',
    options: ['Much better', 'Somewhat better', 'About the same', 'Somewhat worse', 'Much worse', 'No comparison'],
    interviewSection: '16. Final Assessment'
  },
  { id: 'PC_02', question: 'What one thing would you change about this platform?', category: 'Platform Comparison', categoryCode: 'PC', type: 'text', interviewSection: '16. Final Assessment' },

  // Research Documentation
  { id: 'RD_01', question: 'Key quotes and observations', category: 'Research Documentation', categoryCode: 'RD', type: 'text', interviewSection: '17. Research Notes' },
  { id: 'RD_02', question: 'Interviewer reflections', category: 'Research Documentation', categoryCode: 'RD', type: 'text', interviewSection: '17. Research Notes' }
];
