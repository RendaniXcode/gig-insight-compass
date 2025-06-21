
import { Question } from '../types/survey';

export const SURVEY_QUESTIONS: Question[] = [
  // Basic Information
  { id: 'BI_01', question: 'Platform Name', category: 'Basic Information', categoryCode: 'BI' },
  { id: 'BI_02', question: 'Employment Type (Employee/Freelancer/Contractor)', category: 'Basic Information', categoryCode: 'BI' },
  { id: 'BI_03', question: 'Interview Code & Date', category: 'Basic Information', categoryCode: 'BI' },
  
  // Personal Background
  { id: 'PB_01', question: 'Age and highest education level', category: 'Personal Background', categoryCode: 'PB' },
  
  // Platform Introduction
  { id: 'PI_01', question: 'How long have you been working for this platform?', category: 'Platform Introduction', categoryCode: 'PI' },
  
  // Platform Overview
  { id: 'PO_01', question: 'Is this your main job or do you have others?', category: 'Platform Overview', categoryCode: 'PO' },
  { id: 'PO_02', question: 'What challenges do you face with this work?', category: 'Platform Overview', categoryCode: 'PO' },
  { id: 'PO_03', question: 'How does income compare to your previous job?', category: 'Platform Overview', categoryCode: 'PO' },
  
  // Work Structure
  { id: 'WS_01', question: 'How many hours per day/week do you work?', category: 'Work Structure', categoryCode: 'WS' },
  { id: 'WS_02', question: 'Are you paid hourly or per task/service?', category: 'Work Structure', categoryCode: 'WS' },
  { id: 'WS_03', question: 'How does the app assign tasks?', category: 'Work Structure', categoryCode: 'WS' },
  { id: 'WS_04', question: 'If you don\'t want a task can you cancel without penalty?', category: 'Work Structure', categoryCode: 'WS' },
  
  // Payment & Earnings
  { id: 'PE_01', question: 'How much do you earn per hour/task?', category: 'Payment & Earnings', categoryCode: 'PE' },
  { id: 'PE_02', question: 'How much do you make per week/month from the platform?', category: 'Payment & Earnings', categoryCode: 'PE' },
  { id: 'PE_03', question: 'How frequently are you paid?', category: 'Payment & Earnings', categoryCode: 'PE' },
  { id: 'PE_04', question: 'Is payment always on time? Any delays?', category: 'Payment & Earnings', categoryCode: 'PE' },
  { id: 'PE_05', question: 'Is payment always made in full? Any deductions?', category: 'Payment & Earnings', categoryCode: 'PE' },
  { id: 'PE_06', question: 'How do you receive payment? Can you choose currency?', category: 'Payment & Earnings', categoryCode: 'PE' },
  
  // Work Costs
  { id: 'WC_01', question: 'What proportion of your income goes to work costs?', category: 'Work Costs', categoryCode: 'WC' },
  { id: 'WC_02', question: 'Do you pay commission or fees to the platform?', category: 'Work Costs', categoryCode: 'WC' },
  { id: 'WC_03', question: 'Does your income fluctuate? Why?', category: 'Work Costs', categoryCode: 'WC' },
  
  // Unpaid Work Time
  { id: 'UWT_01', question: 'Is some work time unpaid (like applying for jobs)? How much?', category: 'Unpaid Work Time', categoryCode: 'UWT' },
  { id: 'UWT_02', question: 'Do you take excessive risks to get work or get paid?', category: 'Unpaid Work Time', categoryCode: 'UWT' },
  
  // Contracts & Terms
  { id: 'CT_01', question: 'Do you have an employment contract or terms & conditions?', category: 'Contracts & Terms', categoryCode: 'CT' },
  { id: 'CT_02', question: 'Are terms clear and understandable?', category: 'Contracts & Terms', categoryCode: 'CT' },
  { id: 'CT_03', question: 'Do you have digital access to the contract?', category: 'Contracts & Terms', categoryCode: 'CT' },
  { id: 'CT_04', question: 'Where can you access the contract/terms?', category: 'Contracts & Terms', categoryCode: 'CT' },
  { id: 'CT_05', question: 'Do terms include pay details bonuses incentives?', category: 'Contracts & Terms', categoryCode: 'CT' },
  { id: 'CT_06', question: 'If contract changes are you notified? How far ahead?', category: 'Contracts & Terms', categoryCode: 'CT' },
  
  // Health & Safety
  { id: 'HS_01', question: 'Does work affect your physical or mental health?', category: 'Health & Safety', categoryCode: 'HS' },
  { id: 'HS_02', question: 'Does the platform take steps to address health risks?', category: 'Health & Safety', categoryCode: 'HS' },
  { id: 'HS_03', question: 'Did you receive safety training?', category: 'Health & Safety', categoryCode: 'HS' },
  { id: 'HS_04', question: 'Does platform provide insurance? What does it cover?', category: 'Health & Safety', categoryCode: 'HS' },
  
  // Data & Privacy
  { id: 'DP_01', question: 'What data does the platform collect about you?', category: 'Data & Privacy', categoryCode: 'DP' },
  { id: 'DP_02', question: 'Does platform inform you about data collection?', category: 'Data & Privacy', categoryCode: 'DP' },
  { id: 'DP_03', question: 'What measures protect your data?', category: 'Data & Privacy', categoryCode: 'DP' },
  
  // Platform Management
  { id: 'PM_01', question: 'How does the rating system work?', category: 'Platform Management', categoryCode: 'PM' },
  { id: 'PM_02', question: 'Can you appeal a bad rating?', category: 'Platform Management', categoryCode: 'PM' },
  { id: 'PM_03', question: 'Who do you contact when something goes wrong?', category: 'Platform Management', categoryCode: 'PM' },
  { id: 'PM_04', question: 'What channels exist for wage issues?', category: 'Platform Management', categoryCode: 'PM' },
  
  // Support Experience
  { id: 'SE_01', question: 'Have you contacted support before?', category: 'Support Experience', categoryCode: 'SE' },
  { id: 'SE_02', question: 'What was the issue and how was it handled?', category: 'Support Experience', categoryCode: 'SE' },
  
  // Due Process
  { id: 'DUE_01', question: 'Have you experienced disciplinary action or deactivation?', category: 'Due Process', categoryCode: 'DUE' },
  { id: 'DUE_02', question: 'How can you contest management decisions?', category: 'Due Process', categoryCode: 'DUE' },
  { id: 'DUE_03', question: 'Can you reach platform directly if there are supervisor problems?', category: 'Due Process', categoryCode: 'DUE' },
  
  // Discrimination
  { id: 'DIS_01', question: 'Have you felt discriminated against based on your identity?', category: 'Discrimination', categoryCode: 'DIS' },
  { id: 'DIS_02', question: 'Are there anti-discrimination policies?', category: 'Discrimination', categoryCode: 'DIS' },
  
  // Worker Voice
  { id: 'WV_01', question: 'What say do you have in shaping platform policies?', category: 'Worker Voice', categoryCode: 'WV' },
  { id: 'WV_02', question: 'Are there collective mechanisms to empower workers?', category: 'Worker Voice', categoryCode: 'WV' },
  { id: 'WV_03', question: 'What channels do workers use to share ideas collectively?', category: 'Worker Voice', categoryCode: 'WV' },
  
  // Collective Action
  { id: 'CA_01', question: 'Is there a worker group the platform recognizes?', category: 'Collective Action', categoryCode: 'CA' },
  { id: 'CA_02', question: 'Can workers demonstrate strike or take collective action?', category: 'Collective Action', categoryCode: 'CA' },
  
  // Platform Comparison
  { id: 'PC_01', question: 'How does this platform compare to others in the sector?', category: 'Platform Comparison', categoryCode: 'PC' },
  { id: 'PC_02', question: 'What one thing would you change about this platform?', category: 'Platform Comparison', categoryCode: 'PC' },
  
  // Research Documentation
  { id: 'RD_01', question: 'Key quotes and observations', category: 'Research Documentation', categoryCode: 'RD' },
  { id: 'RD_02', question: 'Interviewer reflections', category: 'Research Documentation', categoryCode: 'RD' }
];
