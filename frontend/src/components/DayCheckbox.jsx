import { Check } from 'lucide-react'

function DayCheckbox({ habit, date, onToggle }) {
  const entry = habit.tracking?.find(t => t.date === date)
  const isChecked = entry?.completed || false

  const handleClick = () => {
    onToggle(habit._id, date)
  }

  return (
    <td className="checkbox-cell" onClick={handleClick}>
      <div className="flex items-center justify-center">
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${isChecked
              ? 'bg-success border-success shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : 'border-gray-600 bg-surface/50 hover:border-primary hover:bg-surface'
            }`}
        >
          {isChecked && <Check className="text-white" size={16} strokeWidth={3} />}
        </div>
      </div>
    </td>
  )
}

export default DayCheckbox
