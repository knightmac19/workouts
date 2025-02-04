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
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Classes
          </h2>
        </div>
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Log Class
          </button>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Journal Entry
          </h2>
          <button
            onClick={() => setShowJournalEntry(!showJournalEntry)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showJournalEntry ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
        {showJournalEntry && (
          <div className="p-4">
            <textarea
              value={currentJournalEntry}
              onChange={(e) => setCurrentJournalEntry(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="What are you working on?"
            />
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Class Schedule
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(weeklySchedule).map(([day, classes]) => (
            <div key={day} className="p-4">
              <button
                onClick={() =>
                  setExpandedClass(expandedClass === day ? null : day)
                }
                className="w-full flex justify-between items-center text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
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
                        classInfo.usual
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "bg-gray-50 dark:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex justify-between text-gray-900 dark:text-white">
                        <span>{classInfo.time}</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {classInfo.type}
                        </span>
                      </div>
                      {classInfo.usual && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
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
