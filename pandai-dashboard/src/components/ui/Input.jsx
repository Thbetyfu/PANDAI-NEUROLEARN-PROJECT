import { cn } from '@/lib/utils';

const Input = ({
    icon: Icon,
    className,
    containerClassName,
    ...props
}) => {
    return (
        <div className={cn("relative group", containerClassName)}>
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-[#616161] group-focus-within:text-[#001D5A] transition-colors" />
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-white border-2 border-[#001D5A] rounded-[7px] py-2.5 text-[#001D5A] placeholder-gray-400 focus:outline-none focus:bg-blue-50/10 font-medium font-['Inter'] transition-colors",
                    Icon ? "pl-10 pr-4" : "px-4",
                    className
                )}
                {...props}
            />
        </div>
    );
};

export default Input;
