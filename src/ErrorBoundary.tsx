import React from 'react';
type State = { hasError: boolean; error?: Error };
export default class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error) { console.error(error); }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1>Something went wrong.</h1>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
      </div>;
    }
    return this.props.children;
  }
}