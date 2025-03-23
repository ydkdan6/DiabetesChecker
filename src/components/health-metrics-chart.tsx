import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { calculateBMI } from '../lib/utils';
import type { HealthData } from '../store/health-data';

interface HealthMetricsChartProps {
  data: Partial<HealthData>;
}

export function HealthMetricsChart({ data }: HealthMetricsChartProps) {
  const bmi = data.weight && data.height ? calculateBMI(data.weight, data.height) : 0;

  const metrics = [
    {
      name: 'BMI',
      value: bmi,
      normal: { min: 18.5, max: 24.9 },
      unit: 'kg/m²'
    },
    {
      name: 'Fasting Glucose',
      value: data.bloodGlucoseFasting,
      normal: { min: 70, max: 100 },
      unit: 'mg/dL'
    },
    {
      name: 'Post-meal Glucose',
      value: data.bloodGlucosePostMeal,
      normal: { min: 70, max: 140 },
      unit: 'mg/dL'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6">Health Metrics Visualization</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover p-3 rounded-lg shadow-lg border">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm">
                        Value: {data.value} {data.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Normal range: {data.normal.min} - {data.normal.max} {data.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="normal.max"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="normal.min"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}