export default function GradientTitle({ children, className = "" }) {
    return (
        <h1 className={`text-[28px] font-semibold tracking-[-0.04em] mb-1 font-['Inter'] ${className}`}>
            <span className="bg-gradient-to-r from-[#0041C9] to-[#000000] bg-clip-text text-transparent">
                {children}
            </span>
        </h1>
    );
}
