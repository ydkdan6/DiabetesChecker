import { create } from 'zustand';

export interface HealthData {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  bloodGlucoseFasting: number;
  bloodGlucosePostMeal: number;
  sleepHours: number;
  physicalActivityDays: number;
  physicalActivityIntensity: 'low' | 'moderate' | 'high';
  familyHistory: boolean;
  ethnicity: string;
  existingConditions: string[];
  medications: string[];
  dietaryHabits: {
    fruitsVegetables: number;
    processedFoods: number;
    sugaryDrinks: number;
  };
  stressLevel: number;
  symptoms: {
    increasedThirst: boolean;
    frequentUrination: boolean;
    unexplainedWeightLoss: boolean;
    fatigue: boolean;
    blurredVision: boolean;
    slowHealingSores: boolean;
    frequentInfections: boolean;
  };
}

interface HealthDataState {
  data: Partial<HealthData>;
  updateData: (data: Partial<HealthData>) => void;
  resetData: () => void;
}

const initialData: Partial<HealthData> = {
  symptoms: {
    increasedThirst: false,
    frequentUrination: false,
    unexplainedWeightLoss: false,
    fatigue: false,
    blurredVision: false,
    slowHealingSores: false,
    frequentInfections: false,
  }
};

export const useHealthDataStore = create<HealthDataState>((set) => ({
  data: initialData,
  updateData: (newData) => 
    set((state) => {
      // Handle nested symptoms object
      if (newData.symptoms) {
        return {
          data: {
            ...state.data,
            symptoms: {
              ...state.data.symptoms,
              ...newData.symptoms
            },
            ...newData
          }
        };
      }
      return { data: { ...state.data, ...newData } };
    }),
  resetData: () => set({ data: initialData }),
}));