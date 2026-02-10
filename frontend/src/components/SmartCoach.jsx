import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, Award, Calendar, Sparkles } from 'lucide-react';

const QUOTES = [
    "Small steps every day lead to big results.",
    "Consistency is the key to success.",
    "Your future is created by what you do today.",
    "Don't stop when you're tired. Stop when you're done.",
    "Excellence is not an act, but a habit.",
    "Believe you can and you're halfway there.",
];

function SmartCoach({ habits }) {
    const calculations = useMemo(() => {
        if (!habits || habits.length === 0) return null;

        let totalCompletions = 0;
        let maxStreak = 0;
        let bestDay = { day: '', count: 0 };
        const dayCounts = {};
        const streaks = {};

        const today = new Date().toISOString().split('T')[0];

        habits.forEach(habit => {
            // Sort valid tracking dates
            const dates = habit.tracking
                .filter(t => t.completed && t.date <= today)
                .map(t => t.date)
                .sort();

            // Count completions
            totalCompletions += dates.length;

            // Calculate streak
            let currentStreak = 0;
            let tempStreak = 0;
            // Simple streak logic (consecutive days)
            // This is a simplified version; robust streak calc would need date maths
            // For now, we'll just count total completions as "momentum" for simplicity in this demo
            currentStreak = dates.length; // Placeholder for actual consecutive logic

            // Best Day Analysis
            dates.forEach(date => {
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
                if (dayCounts[dayName] > bestDay.count) {
                    bestDay = { day: dayName, count: dayCounts[dayName] };
                }
            });
        });

        const completionRate = habits.length > 0 ? Math.round(totalCompletions / (habits.length * 7) * 100) : 0; // Approx weekly rate

        return {
            totalCompletions,
            bestDay: bestDay.day || 'Today',
            quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
            level: Math.floor(totalCompletions / 10) + 1 // Gamification level
        };
    }, [habits]);

    if (!calculations) return null;

    return (
        <div className="glass-panel p-6 bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 border-violet-500/20 relative overflow-hidden group">
            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-700"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
                    <Sparkles className="text-white" size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">AI Smart Coach</h2>
                    <p className="text-xs text-violet-200 uppercase tracking-widest font-semibold flex items-center gap-2">
                        Level {calculations.level} Achiever
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="text-amber-400" size={18} />
                            <p className="text-amber-100 font-medium">Daily Design</p>
                        </div>
                        <p className="text-sm text-gray-300 italic">"{calculations.quote}"</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                            <TrendingUp className="text-success mx-auto mb-1" size={18} />
                            <p className="text-xs text-gray-400">Total Wins</p>
                            <p className="text-xl font-bold text-white">{calculations.totalCompletions}</p>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5 text-center">
                            <Calendar className="text-accent mx-auto mb-1" size={18} />
                            <p className="text-xs text-gray-400">Best Day</p>
                            <p className="text-xl font-bold text-white">{calculations.bestDay}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/5 relative overflow-hidden">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Award className="text-yellow-500" size={18} />
                        Next Milestone
                    </h3>
                    <div className="relative pt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Level {calculations.level}</span>
                            <span>Level {calculations.level + 1}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2.5 rounded-full relative"
                                style={{ width: `${(calculations.totalCompletions % 10) * 10}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">
                            {10 - (calculations.totalCompletions % 10)} more completions to level up!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SmartCoach;
