import React from 'react';
import { ThemeToggle } from './components/theme-toggle';
import { AssessmentForm } from './components/assessment-form';
import { useThemeStore } from './store/theme';

function App() {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Diabetes Risk Assessment</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Assess Your Diabetes Risk</h2>
          <p className="text-lg opacity-80">
            Complete the form below to receive a personalized risk assessment and health recommendations.
          </p>
        </div>

        <AssessmentForm />

        <div className="mt-8 text-center text-sm opacity-70">
          <p>
            Disclaimer: This tool is for informational purposes only and should not replace professional medical advice.
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;