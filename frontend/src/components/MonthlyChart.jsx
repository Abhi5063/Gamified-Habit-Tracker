import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function MonthlyChart({ habits }) {
  if (!habits || habits.length === 0) {
    return <div className="text-center text-gray-400 py-8">No data available</div>
  }

  const data = habits.map(habit => ({
    name: habit.name,
    value: habit.percentage
  }))

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#f3f4f6'
          }}
          itemStyle={{ color: '#f3f4f6' }}
          formatter={(value) => `${value}%`}
        />
        <Legend wrapperStyle={{ color: '#9ca3af' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default MonthlyChart
