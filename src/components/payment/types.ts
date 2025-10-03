export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: {
    openai: number;
    gemini: number;
  };
  description: string;
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 10,
    credits: {
      openai: 1,
      gemini: 1,
    },
    description: '1 credit each for OpenAI and Gemini',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 149,
    credits: {
      openai: 20,
      gemini: 20,
    },
    description: '20 credits each for OpenAI and Gemini',
  },
];