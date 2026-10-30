import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReturnHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#08090A] text-[#F5F5F7] px-5 sm:px-6 flex flex-col items-center justify-center text-center selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)] select-none">
          {/* Background Dot Matrix (Fixed & Composited) */}
          <div
            className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
            aria-hidden="true"
          />

          <main className="max-w-[1040px] mx-auto w-full flex flex-col items-center justify-center">
            {/* Headline */}
            <h1 className="font-sans font-medium tracking-[-0.045em] leading-[0.98] text-[clamp(2rem,4vw,3.25rem)]">
              <span className="text-[#F5F5F7]">Something went wrong.</span>
            </h1>

            {/* Subcopy */}
            <p className="mt-3 text-[15px] text-[#8E9299] max-w-[40ch] text-pretty">
              An unexpected error interrupted this view.
            </p>

            {/* Recovery Buttons */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="bg-[#F5F5F7] hover:bg-white text-[#08090A] h-10 px-4 rounded-[10px] text-[13px] font-medium tracking-[-0.015em] cursor-pointer transition-colors"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleReturnHome}
                className="bg-[#16181E] hover:bg-[#1E2129] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] h-10 px-4 rounded-[10px] text-[13px] font-medium tracking-[-0.015em] cursor-pointer transition-colors"
              >
                Back to Home
              </button>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}
