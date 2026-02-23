import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const AttentionHeatmap = () => {
    // Dummy data for 32 students (8x4 grid or similar)
    // Dummy data for 32 students (8x4 grid or similar)
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Generate random attention score (0-100) only on client-side
        const newStudents = Array.from({ length: 32 }, (_, i) => {
            const score = Math.floor(Math.random() * 40) + 60; // Bias towards 60-100 for realism
            return {
                id: i + 1,
                name: `Siswa ${i + 1}`,
                attentionScore: score,
            };
        });
        setStudents(newStudents);
    }, []);

    // Helper to determine color based on score
    const getCellColor = (score) => {
        if (score >= 90) return 'bg-[#46BD84]'; // High attention (Green)
        if (score >= 75) return 'bg-[#8BC34A]'; // Good (Light Green)
        if (score >= 60) return 'bg-[#FFEB3B]'; // Moderate (Yellow)
        if (score >= 40) return 'bg-[#FF9800]'; // Low (Orange)
        return 'bg-[#F44336]'; // Critical (Red)
    };

    return (
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[#1F2937] font-['Inter']">Attention Heatmap</h3>
                    <p className="text-sm text-gray-500">Visualisasi tingkat fokus siswa di kelas saat ini.</p>
                </div>
                <button className="text-gray-400 hover:text-[#0041C9] transition-colors">
                    <Info size={20} />
                </button>
            </div>

            {/* The Classroom Grid - 8 Columns x 4 Rows */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {students.map((student) => (
                    <div
                        key={student.id}
                        className={`
              relative group aspect-square rounded-[8px] flex flex-col items-center justify-center 
              cursor-pointer transition-all hover:scale-105 hover:shadow-md border border-black/5
              ${getCellColor(student.attentionScore)}
            `}
                    >
                        {/* Score Number */}
                        <span className="text-white font-bold text-lg drop-shadow-md">
                            {student.attentionScore}%
                        </span>

                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 w-24 bg-black/80 backdrop-blur-sm text-white text-xs rounded py-1 px-2 text-center">
                            {student.name}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Teacher Desk Indicator (Optional realistic touch) */}
            <div className="mt-8 flex justify-center">
                <div className="w-1/3 h-8 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Meja Guru
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-gray-600 justify-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#46BD84]"></div> &gt;90% (Sangat Fokus)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#8BC34A]"></div> 75-89% (Fokus)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FF9800]"></div> 40-59% (Kurang Fokus)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F44336]"></div> &lt;40% (Butuh Perhatian)</div>
            </div>
        </div>
    );
};

export default AttentionHeatmap;
