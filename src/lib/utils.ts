import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) * (height / 100));
}

export function getRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'very-high' {
  if (score < 30) return 'low';
  if (score < 50) return 'moderate';
  if (score < 75) return 'high';
  return 'very-high';
}