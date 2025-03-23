import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, orderBy, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore';
import { db, collections, User } from '../firebase';
import { symptomApi } from '../api/symptomApi';
import { mockSymptomService } from './mockSymptomService';

// Symptom Assessment interfaces
export interface Symptom {
  name: string;
  description: string;
  bodyPart?: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: number; // in days
  frequency: 'constant' | 'intermittent' | 'periodic';
  additionalNotes?: string;
}

export interface RiskFactor {
  type: 'age' | 'gender' | 'medicalHistory' | 'lifestyle' | 'familyHistory';
  value: string;
  impact: 'low' | 'medium' | 'high';
}

export interface PossibleCondition {
  name: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
}

export interface RecommendedAction {
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'routine';
}

export interface SymptomAssessment {
  id: string;
  patientId: string;
  symptoms: Symptom[];
  riskFactors: RiskFactor[];
  analysis: {
    possibleConditions: PossibleCondition[];
    recommendedActions: RecommendedAction[];
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    disclaimer: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Make sure to add this to collections in firebase.ts
// symptomAssessments: 'symptomAssessments'

/**
 * Symptom Service - Handles all symptom checker related operations with Firestore
 */
export const symptomService = {
  isOfflineMode: false,

  handleError(error: Error | { response?: unknown; message?: string }): typeof mockSymptomService {
    if ('response' in error) {
      throw error;
    }
    console.log('Network unavailable, using offline mode for assessment history');
    this.isOfflineMode = true;
    return mockSymptomService;
  },

  /**
   * Submit symptoms and get AI assessment
   * @param patientId - The patient's ID
   * @param userInput - The user's description of symptoms
   * @returns The assessment result
   */
  submitSymptoms: async (data: { patientId: string; symptoms: string[]; description: string }) => {
    try {
      const extractedSymptoms = await symptomService.extractSymptoms(data.description);
      const aiResponse = await symptomService.generateAIResponse(data.description);
      
      if (!aiResponse || !aiResponse.analysis) {
        throw new Error('Invalid AI response structure');
      }
      
      const analysis = aiResponse.analysis;
  
      const assessment: Omit<SymptomAssessment, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId: data.patientId,
        symptoms: extractedSymptoms || [],
        riskFactors: [],
        analysis: {
          possibleConditions: analysis?.possibleConditions || [],
          recommendedActions: analysis?.recommendedActions || [],
          severity: analysis?.severity || 'low',
          confidence: analysis?.confidence || 0.8,
          disclaimer: analysis?.disclaimer || 'This is an AI-generated assessment and should not replace professional medical advice.'
        }
      };
  
      const docRef = await addDoc(collection(db, collections.symptomAssessments), {
        ...assessment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
  
      return {
        id: docRef.id,
        ...assessment,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error submitting symptoms:', error);
      // Return a valid assessment object with empty analysis to prevent undefined errors
      return {
        id: 'error',
        patientId: data.patientId,
        symptoms: [],
        riskFactors: [],
        analysis: {
          possibleConditions: [],
          recommendedActions: [],
          severity: 'low',
          confidence: 0,
          disclaimer: 'Unable to process symptoms at this time. Please try again later.'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },

  // Get assessment history for a patient with real-time updates
  subscribeToAssessmentHistory: (patientId: string, onUpdate: (assessments: SymptomAssessment[]) => void) => {
    const assessmentsQuery = query(
      collection(db, collections.symptomAssessments),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(assessmentsQuery, async (snapshot) => {
      const assessments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof Timestamp ?
          doc.data().createdAt.toDate() :
          new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt instanceof Timestamp ?
          doc.data().updatedAt.toDate() :
          new Date(doc.data().updatedAt)
      })) as SymptomAssessment[];
      onUpdate(assessments);
    });
  },

  /**
   * Get assessment history for a patient
   * @param patientId - The patient's ID
   * @returns Array of previous symptom assessments
   */
  getAssessmentHistory: async (patientId: string) => {
    try {
      const assessmentsQuery = query(
        collection(db, collections.symptomAssessments),
        where('patientId', '==', patientId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(assessmentsQuery);
      const assessments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof Timestamp ?
          doc.data().createdAt.toDate() :
          new Date(doc.data().createdAt),
        updatedAt: doc.data().updatedAt instanceof Timestamp ?
          doc.data().updatedAt.toDate() :
          new Date(doc.data().updatedAt)
      })) as SymptomAssessment[];

      // Cache successful response
      localStorage.setItem(`assessment_history_${patientId}`, JSON.stringify(assessments));
      return assessments;
    } catch (error) {
      console.error('Error getting assessment history:', error);
      if (!navigator.onLine) {
        console.log('Network unavailable, using offline mode for assessment history');
        const cachedData = localStorage.getItem(`assessment_history_${patientId}`);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        return mockSymptomService.getAssessmentHistory(patientId);
      }
      throw error;
    }
  },

  // Get specific assessment
  getAssessmentById: async (assessmentId: string): Promise<SymptomAssessment | null> => {
    try {
      const docRef = doc(db, collections.symptomAssessments, assessmentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ?
          data.createdAt.toDate() :
          new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ?
          data.updatedAt.toDate() :
          new Date(data.updatedAt)
      } as SymptomAssessment;
    } catch (error) {
      console.error('Error getting assessment:', error);
      if (!navigator.onLine) {
        console.log('Using offline mode for assessment retrieval');
        return mockSymptomService.getAssessmentById(assessmentId);
      }
      throw error;
    }
  },

  /**
   * Get emergency assessments (for healthcare providers)
   * @returns Array of assessments with high emergency level
   */
  getEmergencyAssessments: async (): Promise<Array<SymptomAssessment & { patientName: string }>> => {
    try {
      const emergencyQuery = query(
        collection(db, collections.symptomAssessments),
        where('emergencyLevel', 'in', ['medium', 'high']),
        orderBy('createdAt', 'desc')
      );

      const emergencySnapshot = await getDocs(emergencyQuery);
      const emergencyAssessments: Array<SymptomAssessment & { patientName: string }> = [];

      for (const docSnapshot of emergencySnapshot.docs) {
        const data = docSnapshot.data();
        
        // Get patient details
        const patientDoc = await getDoc(doc(db, collections.users, data.patientId));
        const patientName = patientDoc.exists() ? (patientDoc.data() as User).displayName : 'Unknown Patient';
        
        emergencyAssessments.push({
          id: docSnapshot.id,
          ...data,
          patientName,
          createdAt: data.createdAt instanceof Timestamp ? 
            data.createdAt.toDate() : 
            new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? 
            data.updatedAt.toDate() : 
            new Date(data.updatedAt)
        } as SymptomAssessment & { patientName: string });
      }

      return emergencyAssessments;
    } catch (error) {
      console.error('Error getting emergency assessments:', error);
      throw error;
    }
  },

  /**
   * Generate AI response based on user input
   * @param userInput - The user's description of symptoms
   * @returns AI generated response
   */
  generateAIResponse: async (userInput: string): Promise<{ analysis: { possibleConditions: PossibleCondition[]; recommendedActions: RecommendedAction[]; severity: 'low' | 'medium' | 'high'; confidence: number; disclaimer: string; } }> => {
    try {
      const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
      if (!GROQ_API_KEY || typeof GROQ_API_KEY !== 'string' || !GROQ_API_KEY.trim()) {
        throw new Error('Invalid or missing GROQ_API_KEY in environment variables');
      }

      if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
        throw new Error('Invalid or empty user input');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant. Analyze the symptoms and provide a response in raw JSON format only, without any markdown code blocks or formatting. The response must be a valid JSON object with the following structure: {"possibleConditions": [{"name": string, "description": string, "probability": string}], "recommendedActions": [{"title": string, "description": string, "urgency": string}], "severity": string, "confidence": number, "disclaimer": string}. Do not include any markdown formatting or code block markers in your response.'
            },
            {
              role: 'user',
              content: `Patient describes the following symptoms: ${userInput}. Please analyze these symptoms and provide a structured assessment.`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData.error === 'object' ? JSON.stringify(errorData.error) : (errorData.error || 'Unknown error');
        throw new Error(`GroqCloud API error: ${errorMessage}. Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Invalid response structure from Groq API');
      }
      let aiContent;
      try {
        // Clean the response of any markdown formatting
        const cleanContent = data.choices[0].message.content
          .replace(/```json\n/g, '')
          .replace(/```/g, '')
          .trim();
        aiContent = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response as JSON');
      }
      
      // Ensure we have a valid analysis object structure
      const analysis = {
        possibleConditions: Array.isArray(aiContent.possibleConditions) ? aiContent.possibleConditions : [],
        recommendedActions: Array.isArray(aiContent.recommendedActions) ? aiContent.recommendedActions : [],
        severity: (aiContent.severity?.toLowerCase() === 'high' ? 'high' : 
                  aiContent.severity?.toLowerCase() === 'medium' ? 'medium' : 'low') as 'low' | 'medium' | 'high',
        confidence: typeof aiContent.confidence === 'number' ? aiContent.confidence : 0.8,
        disclaimer: aiContent.disclaimer || 'This is an AI-generated assessment and should not replace professional medical advice.'
      };
      
      return { analysis };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        analysis: {
          possibleConditions: [],
          recommendedActions: [],
          severity: 'low',
          confidence: 0,
          disclaimer: 'Unable to process symptoms at this time. Please try again later or consult with a healthcare professional directly.'
        }
      };
    }
  },

  /**
   * Extract symptoms from user input
   * @param userInput - The user's description of symptoms
   * @returns Array of extracted symptoms
   */
  extractSymptoms: async (userInput: string): Promise<Symptom[]> => {
    const input = userInput.toLowerCase();
    const symptoms: Symptom[] = [];
    
    // Common symptom patterns with variations
    const symptomPatterns = [
      {
        keywords: ['headache', 'head pain', 'migraine', 'head ache', 'head hurts'],
        name: 'Headache',
        description: 'Pain or discomfort in the head region',
        bodyPart: 'Head'
      },
      {
        keywords: ['fever', 'temperature', 'hot', 'chills', 'sweating', 'sweats'],
        name: 'Fever',
        description: 'Elevated body temperature',
        bodyPart: 'Systemic'
      },
      {
        keywords: ['cough', 'coughing', 'hack', 'clearing throat'],
        name: 'Cough',
        description: 'Forceful expulsion of air from the lungs',
        bodyPart: 'Chest'
      },
      {
        keywords: ['chest pain', 'chest discomfort', 'chest tightness', 'chest pressure'],
        name: 'Chest Pain',
        description: 'Pain or discomfort in the chest area',
        bodyPart: 'Chest'
      },
      {
        keywords: ['shortness of breath', 'difficulty breathing', 'can\'t breathe', 'breathless', 'short of breath'],
        name: 'Dyspnea',
        description: 'Shortness of breath or difficulty breathing',
        bodyPart: 'Chest'
      },
      {
        keywords: ['nausea', 'feel sick', 'queasy', 'upset stomach'],
        name: 'Nausea',
        description: 'Feeling of sickness with an inclination to vomit',
        bodyPart: 'Abdomen'
      },
      {
        keywords: ['vomiting', 'throwing up', 'vomit', 'puking'],
        name: 'Vomiting',
        description: 'Forceful expulsion of stomach contents through the mouth',
        bodyPart: 'Abdomen'
      },
      {
        keywords: ['diarrhea', 'loose stool', 'watery stool', 'frequent bowel movements'],
        name: 'Diarrhea',
        description: 'Loose, watery stools occurring more frequently than usual',
        bodyPart: 'Abdomen'
      },
      {
        keywords: ['abdominal pain', 'stomach pain', 'belly pain', 'stomach ache', 'tummy ache'],
        name: 'Abdominal Pain',
        description: 'Pain or discomfort in the abdominal region',
        bodyPart: 'Abdomen'
      },
      {
        keywords: ['fatigue', 'tired', 'exhausted', 'no energy', 'weakness', 'lethargy'],
        name: 'Fatigue',
        description: 'Extreme tiredness resulting from mental or physical exertion',
        bodyPart: 'Systemic'
      },
      {
        keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'spinning'],
        name: 'Dizziness',
        description: 'Sensation of spinning or whirling, making you feel unbalanced',
        bodyPart: 'Head'
      },
      {
        keywords: ['rash', 'skin irritation', 'hives', 'itchy skin', 'skin outbreak'],
        name: 'Skin Rash',
        description: 'Area of irritated or swollen skin that affects the color or texture of the skin',
        bodyPart: 'Skin'
      },
      {
        keywords: ['sore throat', 'throat pain', 'painful swallowing', 'scratchy throat'],
        name: 'Sore Throat',
        description: 'Pain or irritation in the throat that often worsens when swallowing',
        bodyPart: 'Throat'
      },
      {
        keywords: ['runny nose', 'stuffy nose', 'nasal congestion', 'blocked nose'],
        name: 'Nasal Congestion',
        description: 'Blockage of the nasal passages usually due to membranes lining the nose becoming swollen',
        bodyPart: 'Nose'
      }
    ];
    
    // Extract duration information
    let duration = 1; // Default to 1 day
    if (input.includes('day')) {
      const dayMatch = input.match(/\d+\s*day/); // Match patterns like "3 days" or "3day"
      if (dayMatch) {
        const dayNumber = parseInt(dayMatch[0]);
        if (!isNaN(dayNumber)) {
          duration = dayNumber;
        }
      }
    } else if (input.includes('week')) {
      const weekMatch = input.match(/\d+\s*week/);
      if (weekMatch) {
        const weekNumber = parseInt(weekMatch[0]);
        if (!isNaN(weekNumber)) {
          duration = weekNumber * 7; // Convert weeks to days
        }
      }
    }
    
    // Check for each symptom pattern
    for (const pattern of symptomPatterns) {
      if (pattern.keywords.some(keyword => input.includes(keyword))) {
        // Determine severity based on context
        let severity: 'mild' | 'moderate' | 'severe' = 'moderate'; // Default to moderate
        
        const severeIndicators = ['severe', 'intense', 'extreme', 'worst', 'unbearable', 'excruciating'];
        const mildIndicators = ['mild', 'slight', 'minor', 'little', 'faint'];
        
        // Check for words near the symptom that indicate severity
        if (severeIndicators.some(indicator => input.includes(indicator))) {
          severity = 'severe';
        } else if (mildIndicators.some(indicator => input.includes(indicator))) {
          severity = 'mild';
        }
        
        // Special case for chest pain - always treat as severe
        if (pattern.name === 'Chest Pain') {
          severity = 'severe';
        }
        
        // Determine frequency
        let frequency: 'constant' | 'intermittent' | 'periodic' = 'intermittent'; // Default
        
        if (input.includes('constant') || input.includes('continuous') || input.includes('all the time')) {
          frequency = 'constant';
        } else if (input.includes('comes and goes') || input.includes('intermittent') || input.includes('on and off')) {
          frequency = 'intermittent';
        } else if (input.includes('periodic') || input.includes('at times') || input.includes('occasionally')) {
          frequency = 'periodic';
        }
        
        // Add the symptom to the list
        symptoms.push({
          name: pattern.name,
          description: pattern.description,
          bodyPart: pattern.bodyPart,
          severity,
          duration,
          frequency
        });
      }
    }
    
    return symptoms;
  }
};