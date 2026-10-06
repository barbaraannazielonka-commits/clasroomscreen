import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LessonFlow runtime error caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('cs_saved_lessons');
      localStorage.removeItem('cs_active_lesson');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center font-sans">
          <h1 className="text-2xl font-bold mb-3">LessonFlow</h1>
          <p className="text-slate-400 max-w-md mb-5 text-sm">
            Stored browser data had an issue. Click below to reload LessonFlow with fresh starter screens:
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm shadow-lg transition-colors cursor-pointer"
          >
            Reset & Open LessonFlow
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </RootErrorBoundary>
);
