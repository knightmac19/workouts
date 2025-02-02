// src/pages/Progress.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Progress() {
  // Placeholder data - will be replaced with real data from Firebase
  const workoutData = [
    { date: "1/26", workouts: 2, jiujitsu: 1 },
    { date: "1/27", workouts: 1, jiujitsu: 1 },
    { date: "1/28", workouts: 3, jiujitsu: 0 },
    { date: "1/29", workouts: 2, jiujitsu: 1 },
    { date: "1/30", workouts: 1, jiujitsu: 1 },
    { date: "1/31", workouts: 2, jiujitsu: 0 },
    { date: "2/1", workouts: 2, jiujitsu: 1 },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="workouts"
                stroke="#2563eb"
                name="Workouts"
              />
              <Line
                type="monotone"
                dataKey="jiujitsu"
                stroke="#7c3aed"
                name="Jiu Jitsu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Workouts</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Jiu Jitsu Classes</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Active Days</p>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Streak</p>
            <p className="text-2xl font-bold">5</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent PRs</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">Back Squat</p>
              <p className="text-sm text-gray-500">235 lbs × 3</p>
            </div>
            <span className="text-sm text-gray-500">Jan 28</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-medium">Bench Press</p>
              <p className="text-sm text-gray-500">185 lbs × 5</p>
            </div>
            <span className="text-sm text-gray-500">Jan 30</span>
          </div>
        </div>
      </section>
    </div>
  );
}
