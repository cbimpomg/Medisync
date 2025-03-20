import { api } from './index';
import type { Symptom, SymptomAssessment } from '../services/symptomService';

export const symptomApi = {
  submit: (data: { patientId: string; symptoms: string[]; description: string }) =>
    api.post<SymptomAssessment>('/symptoms/assess', data),

  getHistory: (patientId: string) =>
    api.get<SymptomAssessment[]>(`/symptoms/history/${patientId}`),

  getById: (assessmentId: string) =>
    api.get<SymptomAssessment>(`/symptoms/assessment/${assessmentId}`),

  getEmergencyAssessments: () =>
    api.get<SymptomAssessment[]>('/symptoms/emergency'),

  analyzeSymptoms: (data: { symptoms: string[]; duration: string; severity: string; additionalInfo: string }) =>
    api.post<{
      possibleConditions: Array<{
        name: string;
        description: string;
        probability: string;
      }>;
      recommendedActions: Array<{
        title: string;
        description: string;
        urgency: 'immediate' | 'soon' | 'routine';
      }>;
      severity: 'low' | 'medium' | 'high';
      confidence: number;
      disclaimer: string;
    }>('/symptoms/analyze', data)
};