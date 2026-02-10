import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function WeeklyChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 py-8">No data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis
          dataKey="weekLabel"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            color: '#f3f4f6'
          }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          formatter={(value) => [`${value}%`, 'Completion']}
        />
        <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.percentage >= 70 ? '#10b981' : entry.percentage >= 40 ? '#f59e0b' : '#ef4444'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyChart
