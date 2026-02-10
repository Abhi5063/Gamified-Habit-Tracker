import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SmartCoach from '../components/SmartCoach'
import { useHabits } from '../hooks/useHabits'
import { Table, BarChart3, TrendingUp, Target, Plus, Zap } from 'lucide-react'

function Dashboard() {
  const { habits, isLoading } = useHabits()

  const today = new Date().toISOString().split('T')[0]

  const todayCompleted = habits.filter(habit => {
    const todayEntry = habit.tracking?.find(t => t.date === today)
    return todayEntry?.completed
  }).length

  const completionRate = habits.length > 0
    ? Math.round((todayCompleted / habits.length) * 100)
    : 0

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-container animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your habit tracking overview.</p>
        </div>

        {/* Smart Coach AI */}
        <div className="mb-8">
          <SmartCoach habits={habits} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Target className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1 relative z-10">Total Habits</p>
            <p className="text-3xl font-bold text-white relative z-10">{habits.length}</p>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="text-success" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1 relative z-10">Completed Today</p>
            <p className="text-3xl font-bold text-white relative z-10">{todayCompleted}</p>
          </div>

          <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="text-secondary" size={24} />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1 relative z-10">Today's Progress</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <p className="text-3xl font-bold text-white">{completionRate}%</p>
              <div className="w-24 h-2 bg-gray-700 rounded-full ml-auto self-center overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link
            to="/habits"
            className="glass-card p-8 hover:bg-surface/80 group border-l-4 border-l-primary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                <Table className="text-primary" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Habit Table</h3>
                <p className="text-gray-400">Track your daily habits with checkboxes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              Go to Habit Table
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          <Link
            to="/analysis"
            className="glass-card p-8 hover:bg-surface/80 group border-l-4 border-l-secondary"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform backdrop-blur-sm">
                <BarChart3 className="text-secondary" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Analysis & Insights</h3>
                <p className="text-gray-400">View your progress and get personalized tips</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondary font-medium">
              View Analysis
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Quick Start Guide */}
        {habits.length === 0 && (
          <div className="mt-8 glass-panel p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Get Started!</h3>
                <p className="text-gray-300 mb-4">
                  You haven't created any habits yet. Start building better habits today!
                </p>
                <Link to="/habits" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={18} />
                  Create Your First Habit
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
