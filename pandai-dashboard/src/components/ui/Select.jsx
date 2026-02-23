import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = ({
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    className,
    containerClassName,
    ...props
}) => {
    return (
        <div className={cn("w-full relative group", containerClassName)}>
            <select
                value={value}
                onChange={onChange}
                className={cn(
                    "w-full appearance-none bg-white border-2 border-[#001D5A] text-[#001D5A] rounded-[7px] px-4 py-3 pr-10 focus:outline-none focus:ring-0 font-bold text-base cursor-pointer hover:bg-gray-50 transition-colors font-['Inter']",
                    !value && "text-gray-400 font-medium", // Placeholder styling
                    className
                )}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.id || opt.value || opt} value={opt.id || opt.value || opt}>
                        {opt.label || opt.name || opt}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#001D5A]">
                <ChevronDown size={24} strokeWidth={3} />
            </div>
        </div>
    );
};

export default Select;
