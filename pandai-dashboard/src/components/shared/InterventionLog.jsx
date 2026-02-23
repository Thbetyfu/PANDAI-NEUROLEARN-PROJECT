import { Zap, Lamp, Activity } from 'lucide-react';

const InterventionLog = ({ logs, simpleView = false }) => (
    <div className="w-full">
        {!simpleView && (
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Intervention Log</h3>
            </div>
        )}

        <div className="space-y-2">
            {logs.map((log, index) => (
                <div key={index}
                    className="flex items-center gap-3 px-3 relative bg-[#E8F1FB] rounded-[5px] border border-[#666666]/15 hover:border-[#666666]/30 transition-all group cursor-pointer"
                    style={{ height: '43px' }}
                >
                    {/* Icon - No container, just black icon */}
                    <div className="shrink-0">
                        {log.type === 'tDCS' ? (
                            <Zap size={18} fill="black" className="text-black" />
                        ) : (
                            <Lamp size={18} fill="black" className="text-black" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex items-center justify-between min-w-0">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <h4 className="text-[13px] font-bold text-black truncate font-['Inter']">
                                {log.student}
                            </h4>
                            <div className="hidden sm:flex items-center gap-2">
                                {/* Separator Dot */}
                                <div className="w-1 h-1 rounded-full bg-black/20"></div>
                                <span className="text-[11px] text-black/60 font-medium truncate">
                                    {log.action}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Time Tag - Varying colors to match SVG vibe */}
                            <span
                                className={`text-[10px] font-bold px-2 py-[2px] rounded-[4px] border border-transparent ${index === 0 ? 'bg-[#FF6666]/10 text-[#FF6666]' :
                                        index === 1 ? 'bg-[#FFA600]/10 text-[#FFA600]' :
                                            'bg-[#3ABE45]/10 text-[#3ABE45]'
                                    }`}
                            >
                                {log.time}
                            </span>

                            {/* Status Dots */}
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#0041C9]"></div>
                                {index % 2 === 0 && <div className="w-2 h-2 rounded-full bg-[#C60000]"></div>}
                                {index % 3 === 0 && <div className="w-2 h-2 rounded-full bg-[#3ABE45]"></div>}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* View All Button */}
        <button className="w-full mt-4 py-3 text-xs font-bold text-slate-500 hover:text-[#0041C9] border border-dashed border-gray-300 rounded-xl hover:bg-[#E8F1FB]/50 transition-all flex items-center justify-center gap-2">
            View All History
        </button>
    </div>
);

export default InterventionLog;
