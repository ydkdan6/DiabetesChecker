import React, { useEffect } from 'react';
import { ThemeToggle } from './components/theme-toggle';
import { AssessmentForm } from './components/assessment-form';
import { AuthForm } from './components/auth-form';
import { Preloader } from './components/preloader';
import { useThemeStore } from './store/theme';
import { useAuthStore } from './store/auth';

function App() {
  const { isDarkMode } = useThemeStore();
  const { user, loading, checkUser, signOut } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
    return <Preloader />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* <h1 className="text-2xl font-bold">Diabetes Risk Assessment</h1>L */}
            <p className="text-sm opacity-75">Hi👋, {user.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => signOut()}
              className="text-sm text-primary hover:underline"
            >
              Sign Out
            </button>
          </div>
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
            Disclaimer: Always consult with a healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;