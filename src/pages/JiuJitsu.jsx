// src/pages/JiuJitsu.jsx
import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

export function JiuJitsu() {
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);

  // Placeholder data - will be replaced with Firebase data
  const weeklySchedule = {
    Monday: [
      { time: "6:00 AM", type: "No Gi" },
      { time: "10:00 AM", type: "No Gi" },
      { time: "6:30 PM", type: "No Gi", usual: true },
    ],
    Tuesday: [{ time: "7:15 PM", type: "Gi", usual: true }],
    Wednesday: [
      { time: "6:00 AM", type: "Gi" },
      { time: "10:00 AM", type: "Gi" },
      { time: "6:45 PM", type: "No Gi", usual: true },
    ],
    Thursday: [{ time: "7:15 PM", type: "No Gi", usual: true }],
    Friday: [
      { time: "6:00 AM", type: "Gi" },
      { time: "10:00 AM", type: "Gi" },
    ],
    Saturday: [{ time: "10:30 AM", type: "Gi", usual: true }],
    Sunday: [
      { time: "9:00 AM", type: "No Gi" },
      { time: "10:00 AM", type: "No Gi" },
      { time: "11:00 AM", type: "Open Mat" },
    ],
  };

  const [currentJournalEntry, setCurrentJournalEntry] = useState(
    "Working on guard retention and leg lock defense. Need to focus on maintaining proper posture in closed guard."
  );

  return (
    <div className="space-y-6 pb-16">
      <section className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Today's Classes</h2>
        </div>
        <div className="p-4">
          <button className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Log Class
          </button>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Current Journal Entry</h2>
          <button
            onClick={() => setShowJournalEntry(!showJournalEntry)}
            className="text-gray-500"
          >
            {showJournalEntry ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        {showJournalEntry && (
          <div className="p-4">
            <textarea
              value={currentJournalEntry}
              onChange={(e) => setCurrentJournalEntry(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg"
              placeholder="What are you working on?"
            />
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Class Schedule</h2>
        </div>
        <div className="divide-y">
          {Object.entries(weeklySchedule).map(([day, classes]) => (
            <div key={day} className="p-4">
              <button
                onClick={() =>
                  setExpandedClass(expandedClass === day ? null : day)
                }
                className="w-full flex justify-between items-center"
              >
                <span className="font-medium">{day}</span>
                {expandedClass === day ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedClass === day && (
                <div className="mt-2 space-y-2">
                  {classes.map((classInfo, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        classInfo.usual ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{classInfo.time}</span>
                        <span className="text-gray-600">{classInfo.type}</span>
                      </div>
                      {classInfo.usual && (
                        <span className="text-xs text-blue-600">
                          Usually attended
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
