import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Award, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import api from '../utils/api';

function SmartCoach({ habits }) {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);

    // Basic stats calculation (always available)
    const stats = React.useMemo(() => {
        if (!habits || habits.length === 0) return null;
        let totalCompletions = 0;
        habits.forEach(h => {
            totalCompletions += h.tracking.filter(t => t.completed).length;
        });
        return {
            totalCompletions,
            level: Math.floor(totalCompletions / 10) + 1
        };
    }, [habits]);

    const fetchAIInsights = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/ai/coach');
            setInsight(response.data);
        } catch (error) {
            console.error('Failed to get insights', error);
            // Fallback if AI fails
            setInsight({
                observation: "Keep tracking your habits to unlock more insights!",
                tip: "Consistency beats intensity.",
                quote: "Success is the sum of small efforts repeated day in and day out."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (habits && habits.length > 0) {
            fetchAIInsights();
        }
    }, [habits.length]); // Re-run when habit count changes

    if (!stats) return null;

    return (
        <div className="glass-panel p-6 bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 border-violet-500/20 relative overflow-hidden group">
            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-700"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">AI Smart Coach</h2>
                        <p className="text-xs text-violet-200 uppercase tracking-widest font-semibold flex items-center gap-2">
                            Level {stats.level} Achiever
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchAIInsights}
                    disabled={loading}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                    title="Refresh Insights"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 transition-all duration-500">
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="text-amber-400" size={18} />
                            <p className="text-amber-100 font-medium">AI Observation</p>
                        </div>
                        {loading ? (
                            <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
                        ) : (
                            <p className="text-sm text-gray-300">{insight?.observation || "Analyzing your habits..."}</p>
                        )}
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-success" size={18} />
                            <p className="text-green-100 font-medium">Coach's Tip</p>
                        </div>
                        {loading ? (
                            <div className="h-4 bg-white/10 rounded animate-pulse w-full"></div>
                        ) : (
                            <p className="text-sm text-gray-300">{insight?.tip || "Gathering data for improved tips..."}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Quote Card */}
                    <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/5 relative overflow-hidden flex flex-col justify-center text-center">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-3 bg-white/10 rounded animate-pulse w-full"></div>
                                <div className="h-3 bg-white/10 rounded animate-pulse w-2/3 mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-lg font-serif italic text-white/90 mb-2">"{insight?.quote}"</p>
                            </>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1"><Award size={12} className="text-yellow-500" /> Level {stats.level}</span>
                            <span>{10 - (stats.totalCompletions % 10)} to go</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2.5 rounded-full relative transition-all duration-1000"
                                style={{ width: `${(stats.totalCompletions % 10) * 10}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SmartCoach;
