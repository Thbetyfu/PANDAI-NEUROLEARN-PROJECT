import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[Boundary] 🚨 React UI Crash Didapatkan:", error);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full w-full items-center justify-center bg-[#F8F8F8] p-4 text-[#616161]">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-lg text-center font-['Inter']">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Sebagian Antarmuka Gagal Dimuat</h2>
                        <p className="text-sm mb-6 leading-relaxed">Dashboard mencegah seluruh aplikasi mati (White Screen of Death). Kami mendeteksi format data visual atau render grafik yang tidak valid. Silakan muat ulang halaman.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-[#0041C9] text-white rounded-lg font-bold shadow hover:bg-[#002B8A] transition-colors"
                        >
                            Muat Ulang UI
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
