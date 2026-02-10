import { useState } from 'react'
import Navbar from '../components/Navbar'
import DayCheckbox from '../components/DayCheckbox'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, X, Check, Calendar } from 'lucide-react'

function HabitTable() {
  const { habits, isLoading, createHabit, deleteHabit, trackHabit } = useHabits()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitIcon, setNewHabitIcon] = useState('📝')

  // Get current month dates
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    dates.push({
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0]
    })
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const handleAddHabit = async (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    await createHabit.mutateAsync({
      name: newHabitName,
      icon: newHabitIcon
    })

    setNewHabitName('')
    setNewHabitIcon('📝')
    setShowAddForm(false)
  }

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit.mutateAsync(id)
    }
  }

  const handleToggleTracking = async (habitId, date) => {
    await trackHabit.mutateAsync({ id: habitId, date })
  }

  if (isLoading) {
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Habit Tracker</h1>
            <div className="flex items-center gap-2 text-primary">
              <Calendar size={20} />
              <p className="font-medium text-lg">{monthName}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? 'Cancel' : 'Add Habit'}
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="glass-panel p-6 mb-8 animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4">Create New Habit</h3>
            <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <label className="label">
                  Icon
                </label>
                <input
                  type="text"
                  value={newHabitIcon}
                  onChange={(e) => setNewHabitIcon(e.target.value)}
                  className="input w-20 text-center text-2xl h-[50px]"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="label">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="input h-[50px]"
                  placeholder="e.g., Morning meditation, Read 30 minutes"
                  autoFocus
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap h-[50px]"
                  disabled={!newHabitName.trim()}
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits Table - Desktop View */}
        <div className="hidden md:block glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="table-head-glass w-16 sticky left-0 bg-surface/95 backdrop-blur-md z-20">
                    Icon
                  </th>
                  <th className="table-head-glass min-w-[200px] sticky left-16 bg-surface/95 backdrop-blur-md z-20">
                    Habit Name
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date.dateString}
                      className={`px-2 py-3 text-xs font-medium text-center min-w-[40px] ${date.dateString === today.toISOString().split('T')[0]
                          ? 'bg-primary/20 text-primary border-b-2 border-primary'
                          : 'text-gray-500'
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="opacity-70">{date.weekday}</div>
                        <div className="font-bold text-lg">{date.day}</div>
                      </div>
                    </th>
                  ))}
                  <th className="table-head-glass w-16 sticky right-0 bg-surface/95 backdrop-blur-md z-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={dates.length + 3} className="px-6 py-12 text-center text-gray-500">
                      No habits yet. Click "Add Habit" to get started!
                    </td>
                  </tr>
                ) : (
                  habits.map((habit) => (
                    <tr key={habit._id} className="table-row-glass group">
                      <td className="table-cell-glass text-center text-2xl sticky left-0 bg-surface/95 backdrop-blur-md z-10 group-hover:bg-surface/80 transition-colors">
                        {habit.icon}
                      </td>
                      <td className="table-cell-glass font-medium sticky left-16 bg-surface/95 backdrop-blur-md z-10 group-hover:bg-surface/80 transition-colors">
                        {habit.name}
                      </td>
                      {dates.map((date) => (
                        <td key={date.dateString} className="px-2 py-3 text-center border-l border-white/5">
                          <div className="flex justify-center">
                            <DayCheckbox
                              habit={habit}
                              date={date.dateString}
                              onToggle={handleToggleTracking}
                            />
                          </div>
                        </td>
                      ))}
                      <td className="table-cell-glass text-center sticky right-0 bg-surface/95 backdrop-blur-md z-10 group-hover:bg-surface/80 transition-colors">
                        <button
                          onClick={() => handleDeleteHabit(habit._id)}
                          className="text-gray-500 hover:text-danger p-2 hover:bg-danger/10 rounded-lg transition-colors"
                          title="Delete habit"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-4 pb-24">
          {habits.length === 0 ? (
            <div className="glass-card p-8 text-center text-gray-400">
              No habits yet. Tap "Add Habit" to start!
            </div>
          ) : (
            habits.map((habit) => {
              const todayDate = new Date().toISOString().split('T')[0]
              const isCompletedToday = habit.tracking?.find(t => t.date === todayDate)?.completed

              return (
                <div key={habit._id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/10">
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{habit.name}</h3>
                      <p className={`text-xs ${isCompletedToday ? 'text-success' : 'text-gray-500'}`}>
                        {isCompletedToday ? 'Completed today' : 'Not completed yet'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DayCheckbox
                      habit={habit}
                      date={todayDate}
                      onToggle={handleToggleTracking}
                    />
                    <button
                      onClick={() => handleDeleteHabit(habit._id)}
                      className="text-gray-500 hover:text-danger p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-gray-600 bg-transparent opacity-50"></div>
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-success bg-success/20 flex items-center justify-center">
              <Check className="text-success" size={16} strokeWidth={3} />
            </div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitTable
