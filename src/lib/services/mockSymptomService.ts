import { SymptomAssessment } from './symptomService';

const STORAGE_KEY = 'symptom_assessments';

class MockSymptomService {
  private getStoredAssessments(): SymptomAssessment[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveAssessments(assessments: SymptomAssessment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  }

  async submitSymptoms(data: { patientId: string; symptoms: string[]; description: string }): Promise<SymptomAssessment> {
    const mockAssessment: SymptomAssessment = {
      id: Date.now().toString(),
      patientId: data.patientId,
      symptoms: data.symptoms.map(symptom => ({
        name: symptom,
        description: symptom,
        severity: 'moderate',
        duration: 1,
        frequency: 'constant'
      })),
      riskFactors: [],
      analysis: {
        possibleConditions: [
          {
            name: 'Common Condition',
            description: 'A general condition based on the symptoms described.',
            probability: 'medium'
          }
        ],
        recommendedActions: [
          {
            title: 'Consult Healthcare Provider',
            description: 'Please consult with a healthcare provider for proper diagnosis.',
            urgency: 'soon'
          }
        ],
        severity: 'medium',
        confidence: 0.7,
        disclaimer: 'This is a mock assessment for offline mode. Please consult with a healthcare provider for accurate diagnosis.'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const assessments = this.getStoredAssessments();
    assessments.push(mockAssessment);
    this.saveAssessments(assessments);

    return mockAssessment;
  }

  async getAssessmentHistory(patientId: string): Promise<SymptomAssessment[]> {
    const assessments = this.getStoredAssessments();
    return assessments.filter(assessment => assessment.patientId === patientId);
  }

  async getAssessmentById(assessmentId: string): Promise<SymptomAssessment | null> {
    const assessments = this.getStoredAssessments();
    return assessments.find(assessment => assessment.id === assessmentId) || null;
  }
}

export const mockSymptomService = new MockSymptomService();