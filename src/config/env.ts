// Environment configuration

// OpenAI API Key
export const OPENAI_API_KEY = import.meta.env.VITE_MEDICAL_AI_API_KEY;

// Function to check if required environment variables are set
export const validateEnvironment = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please check your environment variables.');
  }
};