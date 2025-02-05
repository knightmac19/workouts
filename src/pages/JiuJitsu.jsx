import { useState, useEffect } from "react";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  PenSquare,
  X,
  Save,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { ClassLogger } from "../components/jiujitsu/ClassLogger";
import ClassHistory from "../components/jiujitsu/ClassHistory";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

export function JiuJitsu() {
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [journalModalMode, setJournalModalMode] = useState("new");
  const [editingEntry, setEditingEntry] = useState("");
  const [currentJournalEntry, setCurrentJournalEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Firebase collection reference
  const journalEntriesRef = collection(db, "journalEntries");

  useEffect(() => {
    // Query to get the most recent journal entry
    const q = query(journalEntriesRef, orderBy("timestamp", "desc"), limit(1));

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setIsLoading(false);
        if (!snapshot.empty) {
          const entry = snapshot.docs[0];
          setCurrentJournalEntry({
            id: entry.id,
            ...entry.data(),
          });
        } else {
          setCurrentJournalEntry(null);
        }
      },
      (err) => {
        console.error("Error fetching journal entries:", err);
        setError("Failed to load journal entries");
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    // Handle both Firestore Timestamps and ISO strings
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const handleOpenNewJournalModal = () => {
    setJournalModalMode("new");
    setEditingEntry("");
    setIsJournalModalOpen(true);
  };

  const handleOpenEditJournalModal = () => {
    setJournalModalMode("edit");
    setEditingEntry(currentJournalEntry.content);
    setIsJournalModalOpen(true);
  };

  const handleSaveJournalEntry = async () => {
    if (!editingEntry.trim()) return;

    try {
      if (journalModalMode === "new") {
        await addDoc(journalEntriesRef, {
          content: editingEntry,
          timestamp: new Date(),
        });
      } else {
        const entryRef = doc(db, "journalEntries", currentJournalEntry.id);
        await updateDoc(entryRef, {
          content: editingEntry,
          timestamp: new Date(), // Update timestamp on edit
        });
      }

      setEditingEntry("");
      setIsJournalModalOpen(false);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setError("Failed to save journal entry");
    }
  };

  const handleDeleteJournalEntry = async () => {
    if (
      !currentJournalEntry ||
      !window.confirm("Are you sure you want to delete this journal entry?")
    ) {
      return;
    }

    try {
      const entryRef = doc(db, "journalEntries", currentJournalEntry.id);
      await deleteDoc(entryRef);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      setError("Failed to delete journal entry");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Today's Classes
          </h2>
        </div>
        <div className="p-4">
          <ClassLogger />
        </div>
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Journal Entry
            </h2>
            <button
              onClick={handleOpenNewJournalModal}
              className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              New Entry
            </button>
          </div>
          <button
            onClick={() => setShowJournalEntry(!showJournalEntry)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            {showJournalEntry ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {showJournalEntry && (
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-red-500 dark:text-red-400 text-center">
                {error}
              </div>
            ) : currentJournalEntry ? (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTimestamp(currentJournalEntry.timestamp)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleOpenEditJournalModal}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDeleteJournalEntry}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {currentJournalEntry.content}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No journal entries yet. Click "New Entry" to create one.
              </p>
            )}
          </div>
        )}
      </section>
      {/* // Then add this section after your journal entry section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Class History
          </h2>
        </div>
        <div className="p-4">
          <ClassHistory />
        </div>
      </section>
      {isJournalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {journalModalMode === "new"
                  ? "New Journal Entry"
                  : "Edit Journal Entry"}
              </h2>
              <button
                onClick={() => setIsJournalModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                value={editingEntry}
                onChange={(e) => setEditingEntry(e.target.value)}
                placeholder="What's on your mind today?"
                rows={6}
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveJournalEntry}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {journalModalMode === "new" ? "Save Entry" : "Update Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
