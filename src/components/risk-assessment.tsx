import React from 'react';
import { getRiskLevel } from '../lib/utils';
import type { HealthData } from '../store/health-data';

interface RiskAssessmentProps {
  riskScore: number;
  data: Partial<HealthData>;
}

export function RiskAssessment({ riskScore, data }: RiskAssessmentProps) {
  const riskLevel = getRiskLevel(riskScore);
  
  const getRecommendations = () => {
    const recommendations = [];

    if(riskScore >= 10) {
      recommendations.push('Maintain a healthy weight through balanced diet and regular exercise');
    }
    
    if(riskScore >= 20) {
      recommendations.push('Reduce consumption of processed foods and added sugars');
      recommendations.push('Consider keeping a food diary to track eating habits');
    }
    
    if(riskScore >= 30) {
      recommendations.push('Monitor blood pressure regularly');
      recommendations.push('Consider consulting with a nutritionist for a personalized meal plan');
      recommendations.push('Limit alcohol consumption to moderate levels');
    }
    
    if(riskScore >= 50) {
      recommendations.push('Consider participating in a diabetes prevention program');
      recommendations.push('Monitor your weight weekly and track changes');
      recommendations.push('Reduce stress through mindfulness, meditation, or relaxation techniques');
    }
    
    if(riskScore >= 70) {
      recommendations.push('Check your feet daily for cuts, blisters, or swelling');
      recommendations.push('Consider home blood glucose monitoring');
      recommendations.push('Have regular eye examinations');
    }

    if (data.bloodGlucoseFasting && data.bloodGlucoseFasting > 100) {
      recommendations.push('Monitor your fasting blood glucose levels regularly');
    }
    
    if (data.bloodGlucoseFasting && data.bloodGlucoseFasting > 110) {
      recommendations.push('Limit carbohydrate intake, especially refined carbs and sugars');
    }
    
    if (data.physicalActivityDays && data.physicalActivityDays < 3) {
      recommendations.push('Increase physical activity to at least 150 minutes per week');
    }
    
    if (data.physicalActivityDays && data.physicalActivityDays === 0) {
      recommendations.push('Start with short daily walks and gradually increase your activity level');
    }

    if (data.sleepHours && (data.sleepHours < 6 || data.sleepHours > 9)) {
      recommendations.push('Aim for 7-8 hours of sleep per night');
    }
    
    if (data.familyHistory) {
      recommendations.push('Share your family history of diabetes with your healthcare provider');
    }
    

    
    if (data.stressLevel && data.stressLevel > 7) {
      recommendations.push('Implement stress reduction techniques like yoga or deep breathing exercises');
    }
    

    if (riskLevel === 'high' || riskLevel === 'very-high') {
      recommendations.push('Schedule an appointment with your healthcare provider');
      recommendations.push('Get a comprehensive blood panel including HbA1c test');
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Risk Assessment Results</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Risk Score:</span>
          <span className="font-bold">{riskScore.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              riskLevel === 'low' ? 'bg-green-500' :
              riskLevel === 'moderate' ? 'bg-yellow-500' :
              riskLevel === 'high' ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <div className="mt-2 text-sm font-medium text-center">
          {riskLevel === 'low' && 'Low Risk'}
          {riskLevel === 'moderate' && 'Moderate Risk'}
          {riskLevel === 'high' && 'High Risk'}
          {riskLevel === 'very-high' && 'Very High Risk'}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Recommendations:</h4>
        <ul className="list-disc pl-5 space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      {(riskLevel === 'high' || riskLevel === 'very-high') && (
        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md">
          <strong>Important Notice:</strong>
          <p>Your risk assessment indicates a higher risk for diabetes. Please consult with a healthcare provider as soon as possible for proper evaluation and guidance.</p>
        </div>
      )}
    </div>
  );
}