// src/pages/Dashboard.jsx
export function Dashboard() {
  const workoutTypes = [
    { type: "mobility", variants: ["short", "medium", "long"] },
    { type: "iron-neck", variants: ["standard"] },
    { type: "ancillary", variants: ["standard"] },
    {
      type: "hypertrophy",
      variants: ["Lower Body 1", "Upper Push", "Lower Body 2", "Upper Pull"],
    },
    { type: "cardio", variants: ["tabata", "zone 2"] },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-4">Today's Workouts</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">No workouts scheduled for today</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutTypes.map(({ type, variants }) => (
            <div key={type} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium capitalize mb-2">{type}</h3>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <button
                    key={variant}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
