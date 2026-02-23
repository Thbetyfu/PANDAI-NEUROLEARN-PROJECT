import { cn } from '@/lib/utils';

const Button = ({
    children,
    className,
    variant = 'primary',
    disabled,
    onClick,
    type = 'button',
    ...props
}) => {

    // Base styles common to all buttons
    const baseStyles = "w-full rounded-[8px] text-lg font-bold transition-all relative overflow-hidden group font-['Inter'] flex items-center justify-center gap-2";

    // Variants
    const variants = {
        primary: `text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-lg ${disabled ? 'bg-gray-300 cursor-not-allowed shadow-none' : ''}`,
        outline: "bg-transparent border-2 border-[#001D5A] text-[#001D5A] hover:bg-slate-50",
        ghost: "bg-transparent text-[#616161] hover:text-[#001D5A] hover:bg-slate-100/50",
    };

    // Primary Gradient handling
    const gradientStyle = variant === 'primary' && !disabled ? {
        background: 'radial-gradient(169.4% 84.49% at 50% 50%, #0041C9 0%, #A241FF 100%)'
    } : {};

    return (
        <button
            type={type}
            className={cn(baseStyles, variants[variant], className)}
            style={gradientStyle}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {/* Glossy overlay for primary buttons if needed, or stick to simple gradient */}
            {variant === 'primary' && !disabled && (
                <div className="absolute inset-0 rounded-[8px] border border-white/10 pointer-events-none"></div>
            )}

            {children}
        </button>
    );
};

export default Button;
