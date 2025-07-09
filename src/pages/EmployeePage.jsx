import React, { useState } from "react";

const EmployeePage = () => {
  const [entries, setEntries] = useState([
    {
      date: "2024-07-20",
      work: "Completed monthly sales report and presented to team leadership.",
      rate: 25,
      units: 8,
      deposited: 0,
      isEditing: false,
    },
    {
      date: "2024-07-19",
      work: "Attended client meeting for Project Alpha, provided technical consultation.",
      rate: 30,
      units: 6,
      deposited: 180,
      isEditing: false,
    },
    {
      date: "2024-07-18",
      work: "Developed new feature for internal dashboard, debugged existing modules.",
      rate: 28,
      units: 7,
      deposited: -50,
      isEditing: false,
    },
    {
      date: "2024-07-17",
      work: "Prepared training materials for new hires, conducted onboarding session.",
      rate: 22,
      units: 5,
      deposited: 110,
      isEditing: false,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] =
      field === "rate" || field === "units" || field === "deposited"
        ? parseFloat(value)
        : value;
    setEntries(updated);
  };

  const toggleEdit = (index) => {
    const updated = [...entries];
    updated[index].isEditing = !updated[index].isEditing;
    setEntries(updated);
  };

  const addNewEntry = () => {
    const newEntry = {
      date: "",
      work: "",
      rate: 0,
      units: 0,
      deposited: 0,
      isEditing: true,
    };
    setEntries([newEntry, ...entries]);
  };

  const calculateAmount = (entry) => entry.rate * entry.units;
  const calculateTotal = () =>
    entries.reduce(
      (total, e) => total + calculateAmount(e) + (parseFloat(e.deposited) || 0),
      0
    );

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-[15px] max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Employee Register</h1>
        <div className="flex items-center gap-3">
          <span className="material-icons text-gray-600">notifications</span>
          <div className="w-8 h-8 rounded-full bg-orange-300 text-white font-semibold flex items-center justify-center">
            JD
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="border border-dashed rounded-md text-center py-2 font-medium text-gray-700 mb-4">
        Jane Doe's Entries
      </div>

      {/* Entries */}
      {entries.map((entry, index) => {
        const amount = calculateAmount(entry);
        return (
          <div key={index} className="border border-dashed rounded-md p-3 mb-4 text-gray-800">
            <div className="flex justify-between items-center text-sm mb-1">
              {entry.isEditing ? (
                <input
                  type="date"
                  className="w-full text-sm px-2 py-1 border rounded"
                  value={entry.date}
                  onChange={(e) => handleInputChange(index, "date", e.target.value)}
                />
              ) : (
                <span className="text-gray-600">{entry.date}</span>
              )}
              <span
                className="material-icons text-gray-500 cursor-pointer"
                onClick={() => toggleEdit(index)}
              >
                {entry.isEditing ? "check" : "edit"}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-gray-500 block font-medium mb-1">Work Performed</span>
              {entry.isEditing ? (
                <textarea
                  rows={2}
                  className="w-full border rounded p-1 text-sm"
                  value={entry.work}
                  onChange={(e) => handleInputChange(index, "work", e.target.value)}
                />
              ) : (
                <p>{entry.work}</p>
              )}
            </div>

            <div className="flex justify-between text-sm mb-1 gap-3">
              <div className="flex-1">
                <span className="block text-gray-500">Rate / Unit</span>
                {entry.isEditing ? (
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={entry.rate}
                    onChange={(e) => handleInputChange(index, "rate", e.target.value)}
                  />
                ) : (
                  <span>₹{entry.rate.toFixed(2)}</span>
                )}
              </div>
              <div className="flex-1">
                <span className="block text-gray-500">Units</span>
                {entry.isEditing ? (
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={entry.units}
                    onChange={(e) => handleInputChange(index, "units", e.target.value)}
                  />
                ) : (
                  <span>{entry.units}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Calculated Amount</span>
              <span className="text-indigo-600 font-medium">₹{amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deposited / Due</span>
              {entry.isEditing ? (
                <input
                  type="number"
                  className="w-1/3 border rounded px-2 py-1 text-right"
                  value={entry.deposited}
                  onChange={(e) => handleInputChange(index, "deposited", e.target.value)}
                />
              ) : (
                <span
                  className={`font-medium ${
                    entry.deposited >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {entry.deposited >= 0 ? "+" : ""}
                  ₹{entry.deposited.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="border border-dashed rounded-md p-3 font-medium flex justify-between mb-4">
        <span>Total Amount:</span>
        <span className="text-indigo-600">₹{calculateTotal().toFixed(2)}</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={addNewEntry}
          className="bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700"
        >
          + Add New Entry
        </button>
        <button className="bg-rose-500 text-white py-2 rounded font-medium hover:bg-rose-600">
          ⬇ Download PDF Summary
        </button>
      </div>
    </div>
  );
};

export default EmployeePage;