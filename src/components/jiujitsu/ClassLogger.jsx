import { useState } from "react";
import { Plus, Minus, Save, X, Loader2 } from "lucide-react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export function ClassLogger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [classDetails, setClassDetails] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    instructor: "",
    type: "gi",
    techniquesCovered: "",
    rolls: [{ partner: "", notes: "" }],
  });

  const handleAddRoll = () => {
    setClassDetails((prev) => ({
      ...prev,
      rolls: [...prev.rolls, { partner: "", notes: "" }],
    }));
  };

  const handleRemoveRoll = (index) => {
    setClassDetails((prev) => ({
      ...prev,
      rolls: prev.rolls.filter((_, i) => i !== index),
    }));
  };

  const handleRollChange = (index, field, value) => {
    setClassDetails((prev) => ({
      ...prev,
      rolls: prev.rolls.map((roll, i) =>
        i === index ? { ...roll, [field]: value } : roll
      ),
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!classDetails.instructor.trim()) {
      setError("Please enter an instructor name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Clean up rolls data by removing empty entries
      const cleanedRolls = classDetails.rolls.filter(
        (roll) => roll.partner.trim() || roll.notes.trim()
      );

      // Prepare the data for Firebase
      const classData = {
        ...classDetails,
        rolls: cleanedRolls,
        timestamp: new Date(),
        // Convert date string to Firebase timestamp
        date: new Date(classDetails.date).toISOString(),
      };

      // Add to Firebase
      const classesRef = collection(db, "classes");
      await addDoc(classesRef, classData);

      // Reset form and close modal
      setClassDetails({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        instructor: "",
        type: "gi",
        techniquesCovered: "",
        rolls: [{ partner: "", notes: "" }],
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging class:", error);
      setError("Failed to save class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Log Class
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Log BJJ Class
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={classDetails.date}
                onChange={(e) =>
                  setClassDetails((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={classDetails.time}
                onChange={(e) =>
                  setClassDetails((prev) => ({ ...prev, time: e.target.value }))
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instructor
            </label>
            <input
              type="text"
              value={classDetails.instructor}
              onChange={(e) =>
                setClassDetails((prev) => ({
                  ...prev,
                  instructor: e.target.value,
                }))
              }
              placeholder="Enter instructor name"
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class Type
            </label>
            <select
              value={classDetails.type}
              onChange={(e) =>
                setClassDetails((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            >
              <option value="gi">Gi</option>
              <option value="nogi">No Gi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Techniques Covered
            </label>
            <textarea
              value={classDetails.techniquesCovered}
              onChange={(e) =>
                setClassDetails((prev) => ({
                  ...prev,
                  techniquesCovered: e.target.value.slice(0, 1000),
                }))
              }
              placeholder="What techniques did you learn today?"
              maxLength={1000}
              rows={4}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 resize-none"
            />
            <div className="text-sm text-gray-500 mt-1">
              {classDetails.techniquesCovered.length}/1000 characters
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rolls
              </label>
              <button
                type="button"
                onClick={handleAddRoll}
                className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {classDetails.rolls.map((roll, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg border-gray-200 dark:border-gray-700 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Roll {index + 1}
                    </span>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoll(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    value={roll.partner}
                    onChange={(e) =>
                      handleRollChange(index, "partner", e.target.value)
                    }
                    placeholder="Partner's name"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <textarea
                    value={roll.notes}
                    onChange={(e) =>
                      handleRollChange(index, "notes", e.target.value)
                    }
                    placeholder="Notes about the roll (optional)"
                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 resize-none"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Submit Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Class Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
