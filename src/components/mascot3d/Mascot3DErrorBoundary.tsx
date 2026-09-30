import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface Mascot3DErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onCatchError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface Mascot3DErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class Mascot3DErrorBoundary extends Component<
  Mascot3DErrorBoundaryProps,
  Mascot3DErrorBoundaryState
> {
  constructor(props: Mascot3DErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): Mascot3DErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn('[TADE 3D Engine] Caught rendering/runtime error. Falling back to 2.5D canonical renderer.', error);
    if (this.props.onCatchError) {
      this.props.onCatchError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
