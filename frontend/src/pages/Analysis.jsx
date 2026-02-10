import { useState } from 'react'
import Navbar from '../components/Navbar'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import { useAnalysis } from '../hooks/useAnalysis'
import { useHabits } from '../hooks/useHabits'
import { TrendingUp, TrendingDown, Lightbulb, Award, Target, BarChart3, Download } from 'lucide-react'

function Analysis() {
  const { autoAnalysis, autoLoading, useWeeklyAnalysis } = useAnalysis()
  const { habits } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState(null)

  const { data: weeklyData } = useWeeklyAnalysis(selectedHabitId)

  if (autoLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-container animate-fade-in">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Analysis & Insights</h1>
            <p className="text-gray-400">Track your progress and get personalized recommendations</p>
          </div>
          <button
            onClick={() => {
              const token = localStorage.getItem('token');
              fetch('http://localhost:5000/api/analysis/report', {
                headers: { Authorization: `Bearer ${token}` }
              })
                .then(res => res.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'habit-report.txt';
                  a.click();
                })
                .catch(err => console.error('Download failed', err));
            }}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Report
          </button>
        </div>

        {/* Auto Analysis Cards */}
        {autoAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Most Followed Habit */}
            {autoAnalysis.mostFollowed && (
              <div className="glass-card p-6 bg-gradient-to-br from-success/10 to-emerald-900/10 border-success/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Award className="text-success" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Most Followed</h3>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{autoAnalysis.mostFollowed.icon}</span>
                  <p className="text-xl font-semibold text-white">{autoAnalysis.mostFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-success" size={20} />
                  <span className="text-2xl font-bold text-success">{autoAnalysis.mostFollowed.percentage}%</span>
                  <span className="text-gray-400">completion</span>
                </div>
              </div>
            )}

            {/* Least Followed Habit */}
            {autoAnalysis.leastFollowed && (
              <div className="glass-card p-6 bg-gradient-to-br from-warning/10 to-orange-900/10 border-warning/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Target className="text-warning" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Needs Attention</h3>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{autoAnalysis.leastFollowed.icon}</span>
                  <p className="text-xl font-semibold text-white">{autoAnalysis.leastFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="text-warning" size={20} />
                  <span className="text-2xl font-bold text-warning">{autoAnalysis.leastFollowed.percentage}%</span>
                  <span className="text-gray-400">completion</span>
                </div>
              </div>
            )}

            {/* Overall Performance */}
            <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-violet-900/10 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">Overall</h3>
              </div>
              <p className="text-sm text-gray-400 mb-2">Average Completion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  {autoAnalysis.overallPercentage || 0}%
                </span>
              </div>
              <div className="mt-3 bg-white/5 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-primary to-violet-600 h-full rounded-full transition-all duration-500 shadow-lg shadow-primary/20"
                  style={{ width: `${autoAnalysis.overallPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Progress Chart */}
        <div className="glass-panel p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Weekly Progress</h2>

          {habits.length > 0 ? (
            <>
              <div className="mb-6">
                <label className="label">
                  Select Habit to Analyze
                </label>
                <select
                  value={selectedHabitId || ''}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  className="input max-w-md bg-white/5 border-white/10 text-white [&>option]:text-gray-900"
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(habit => (
                    <option key={habit._id} value={habit._id}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedHabitId && weeklyData?.weeks ? (
                <div>
                  <p className="text-gray-400 mb-4">
                    Showing 4-week progress for: <span className="font-semibold text-white">{weeklyData.habitName}</span>
                  </p>
                  <WeeklyChart data={weeklyData.weeks} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12 border-2 border-dashed border-white/10 rounded-xl">
                  Select a habit above to view weekly progress
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-12 border-2 border-dashed border-white/10 rounded-xl">
              Create some habits first to see progress charts
            </div>
          )}
        </div>

        {/* Monthly Distribution */}
        {autoAnalysis?.allHabits && autoAnalysis.allHabits.length > 0 && (
          <div className="glass-panel p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Monthly Habit Distribution</h2>
            <p className="text-gray-400 mb-6">
              Completion percentage for all your habits this month
            </p>
            <MonthlyChart habits={autoAnalysis.allHabits} />
          </div>
        )}

        {/* Personalized Suggestions */}
        {autoAnalysis?.suggestions && autoAnalysis.suggestions.length > 0 && (
          <div className="glass-panel p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Lightbulb className="text-secondary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Personalized Tips</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autoAnalysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="glass-card p-6 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-secondary font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!autoAnalysis || autoAnalysis.message) && (
          <div className="glass-panel p-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <BarChart3 className="text-gray-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Analysis Available Yet</h3>
            <p className="text-gray-400 mb-6">
              {autoAnalysis?.message || 'Start tracking your habits to see insights and recommendations!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
