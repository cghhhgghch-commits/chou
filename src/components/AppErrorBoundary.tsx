import { Component, ErrorInfo, ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application startup error:", error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main dir="rtl" style={{ minHeight: "100vh", padding: "32px 20px", background: "#f8fafc", fontFamily: "sans-serif" }}>
        <section style={{ maxWidth: 520, margin: "10vh auto", padding: 24, borderRadius: 16, background: "#fff", border: "1px solid #fecaca", boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)" }}>
          <h1 style={{ margin: "0 0 12px", color: "#991b1b", fontSize: 22 }}>تعذر تشغيل التطبيق</h1>
          <p style={{ margin: "0 0 16px", color: "#475569", lineHeight: 1.8 }}>
            أغلق التطبيق وافتحه من جديد. إذا استمرت المشكلة، أرسل نص الخطأ التالي للدعم:
          </p>
          <code style={{ display: "block", padding: 12, direction: "ltr", textAlign: "left", overflowWrap: "anywhere", color: "#7f1d1d", background: "#fef2f2", borderRadius: 8 }}>
            {this.state.error.message || "Unknown application error"}
          </code>
        </section>
      </main>
    );
  }
}
