import React, { useState } from 'react';
import { useHealthDataStore } from '../store/health-data';
import { calculateBMI, getRiskLevel } from '../lib/utils';
import { RiskAssessment } from './risk-assessment';
import { HealthMetricsChart } from './health-metrics-chart';
import { jsPDF } from 'jspdf';

export function AssessmentForm() {
  const { data, updateData } = useHealthDataStore();
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('symptoms.')) {
        const symptomName = name.split('.')[1];
        updateData({
          symptoms: {
            ...data.symptoms,
            [symptomName]: checked
          }
        });
      } else {
        updateData({ [name]: checked });
      }
    } else if (type === 'number') {
      updateData({ [name]: parseFloat(value) });
    } else {
      updateData({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const bmi = data.weight && data.height ? calculateBMI(data.weight, data.height) : 0;
    
    doc.setFontSize(20);
    doc.text('Diabetes Risk Assessment Report <br/> Designed By Samuel', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Patient Information:`, 20, 40);
    doc.text(`Age: ${data.age || 'N/A'}`, 30, 50);
    doc.text(`Gender: ${data.gender || 'N/A'}`, 30, 60);
    doc.text(`BMI: ${bmi.toFixed(1)}`, 30, 70);
    doc.text(`Risk Level: ${getRiskLevel(calculateRiskScore())}`, 20, 90);
    
    doc.save('diabetes-risk-assessment.pdf');
  };

  const calculateRiskScore = (): number => {
    let score = 0;
    
    // Age risk
    if (data.age) {
      if (data.age > 45) score += 20;
      else if (data.age > 35) score += 10;
    }

    // BMI risk
    const bmi = data.weight && data.height ? calculateBMI(data.weight, data.height) : 0;
    if (bmi > 30) score += 20;
    else if (bmi > 25) score += 10;

    // Blood glucose risk
    if (data.bloodGlucoseFasting && data.bloodGlucoseFasting > 100) score += 20;
    if (data.bloodGlucosePostMeal && data.bloodGlucosePostMeal > 140) score += 20;

    // Family history
    if (data.familyHistory) score += 15;

    // Physical activity
    if (data.physicalActivityDays && data.physicalActivityDays < 3) score += 10;

    // Symptoms
    if (data.symptoms?.increasedThirst) score += 10;
    if (data.symptoms?.frequentUrination) score += 10;
    if (data.symptoms?.unexplainedWeightLoss) score += 15;
    if (data.symptoms?.fatigue) score += 10;
    if (data.symptoms?.blurredVision) score += 15;
    if (data.symptoms?.slowHealingSores) score += 15;
    if (data.symptoms?.frequentInfections) score += 15;

    return Math.min(100, score);
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={data.age || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={data.gender || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={data.weight || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={data.height || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Fasting Blood Glucose (mg/dL)</label>
            <input
              type="number"
              name="bloodGlucoseFasting"
              value={data.bloodGlucoseFasting || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Post-meal Blood Glucose (mg/dL)</label>
            <input
              type="number"
              name="bloodGlucosePostMeal"
              value={data.bloodGlucosePostMeal || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Sleep Hours (per day)</label>
            <input
              type="number"
              name="sleepHours"
              value={data.sleepHours || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Physical Activity (days per week)</label>
            <input
              type="number"
              name="physicalActivityDays"
              min="0"
              max="7"
              value={data.physicalActivityDays || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Physical Activity Intensity</label>
            <select
              name="physicalActivityIntensity"
              value={data.physicalActivityIntensity || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            >
              <option value="">Select intensity</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Ethnicity</label>
            <input
              type="text"
              name="ethnicity"
              value={data.ethnicity || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              required
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium">Family History of Diabetes</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="familyHistory"
                checked={data.familyHistory || false}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Yes, I have family members with diabetes</span>
            </div>
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium mb-2">Symptoms</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.increasedThirst"
                  checked={data.symptoms?.increasedThirst || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Increased Thirst</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.frequentUrination"
                  checked={data.symptoms?.frequentUrination || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Frequent Urination</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.unexplainedWeightLoss"
                  checked={data.symptoms?.unexplainedWeightLoss || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Unexplained Weight Loss</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.fatigue"
                  checked={data.symptoms?.fatigue || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Fatigue</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.blurredVision"
                  checked={data.symptoms?.blurredVision || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Blurred Vision</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.slowHealingSores"
                  checked={data.symptoms?.slowHealingSores || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Slow-Healing Sores</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="symptoms.frequentInfections"
                  checked={data.symptoms?.frequentInfections || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Frequent Infections</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            Calculate Risk Assessment
          </button>
        </div>
      </form>

      {showResults && (
        <div className="space-y-8">
          <RiskAssessment 
            riskScore={calculateRiskScore()} 
            data={data} 
          />
          <HealthMetricsChart data={data} />
          <div className="flex justify-center">
            <button
              onClick={generatePDF}
              className="bg-secondary text-secondary-foreground py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}