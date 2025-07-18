import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EmployeePage = () => {
  const { id } = useParams(); // Get employee ID from route
  const API_URL = "https://register-backend-uhok.onrender.com";

  const [employee, setEmployee] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setEntries(
          data.work_entries?.map((e) => ({
            ...e,
            isEditing: false,
          })) || []
        );
        console.log(data.work_entries);
      })
      .catch((err) => console.error("Failed to fetch employee:", err));
  }, [id]);

  const handleInputChange = (index, field, value) => {
    const updated = [...entries];
    if (["rate_per_unit", "no_of_units", "deposit_or_due"].includes(field)) {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setEntries(updated);
    console.log(updated);
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
      rate_per_unit: 0,
      no_of_units: 0,
      deposit_or_due: 0,
      isEditing: true,
    };
    setEntries([newEntry, ...entries]);
  };

  const calculateAmount = (entry) => {
    const rate = parseFloat(entry.rate_per_unit) || 0;
    const units = parseFloat(entry.no_of_units) || 0;
    return rate * units;
  };

  const calculateTotal = () =>
    entries.reduce(
      (total, e) =>
        total + calculateAmount(e) + (parseFloat(e.deposit_or_due) || 0),
      0
    );

  const handleSave = () => {
    fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        work_entries: entries.map((entry) => ({
          date: entry.date,
          work: entry.work,
          rate_per_unit: entry.rate_per_unit,
          no_of_units: entry.no_of_units,
          amount: entry.rate_per_unit * entry.no_of_units,
          deposit_or_due: entry.deposit_or_due ?? 0,
        })),
        earned: calculateTotal(),
      }),
    })
      .then((res) => {
        if (res.ok) alert("✅ Saved successfully!");
        else alert("❌ Save failed");
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("⚠ Error saving employee data.");
      });
  };
  const handleDownloadPDF = async (id) => {
    try {
      const response = await fetch(
        `https://register-backend-uhok.onrender.com/employees/${id}/download`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Employee_${id}_Summary.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  if (!employee) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-[15px] max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Employee Register</h1>
        <div className="flex items-center gap-3">
          <span className="material-icons text-gray-600">notifications</span>
          <div className="w-8 h-8 rounded-full bg-orange-300 text-white font-semibold flex items-center justify-center">
            {employee.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="border border-dashed rounded-md text-center py-2 font-medium text-gray-700 mb-4">
        {employee.name}'s Entries
      </div>

      {/* Entries */}
      {entries.map((entry, index) => {
        const amount = calculateAmount(entry);
        return (
          <div
            key={index}
            className="border border-dashed rounded-md p-3 mb-4 text-gray-800"
          >
            <div className="flex justify-between items-center text-sm mb-1">
              {entry.isEditing ? (
                <input
                  type="date"
                  className="w-full text-sm px-2 py-1 border rounded"
                  value={entry.date}
                  onChange={(e) =>
                    handleInputChange(index, "date", e.target.value)
                  }
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
              <span className="text-gray-500 block font-medium mb-1">
                Work Performed
              </span>
              {entry.isEditing ? (
                <textarea
                  rows={2}
                  className="w-full border rounded p-1 text-sm"
                  value={entry.work}
                  onChange={(e) =>
                    handleInputChange(index, "work", e.target.value)
                  }
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
                    value={entry.rate_per_unit}
                    onChange={(e) =>
                      handleInputChange(index, "rate_per_unit", e.target.value)
                    }
                  />
                ) : (
                  <span>₹{(entry.rate_per_unit ?? 0).toFixed(2)}</span>
                )}
              </div>
              <div className="flex-1">
                <span className="block text-gray-500">Units</span>
                {entry.isEditing ? (
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={entry.no_of_units}
                    onChange={(e) =>
                      handleInputChange(index, "no_of_units", e.target.value)
                    }
                  />
                ) : (
                  <span>{entry.no_of_units}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Calculated Amount</span>
              <span className="text-indigo-600 font-medium">
                ₹{Number.isNaN(amount) ? "0.00" : amount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deposited / Due</span>
              {entry.isEditing ? (
                <input
                  type="number"
                  className="w-1/3 border rounded px-2 py-1 text-right"
                  value={entry.deposit_or_due}
                  onChange={(e) =>
                    handleInputChange(index, "deposit_or_due", e.target.value)
                  }
                />
              ) : (
                <span
                  className={`font-medium ${
                    (entry.deposit_or_due ?? 0) >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {(entry.deposit_or_due ?? 0) >= 0 ? "+" : ""}₹
                  {Number.isNaN(entry.deposit_or_due)
                    ? "0.00"
                    : (entry.deposit_or_due ?? 0).toFixed(2)}
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
        <button
          onClick={handleSave}
          className="bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700"
        >
          💾 Save Work Entries
        </button>
        <button
          onClick={() => handleDownloadPDF(id)}
          className="bg-rose-500 text-white py-2 rounded font-medium hover:bg-rose-600"
        >
          ⬇ Download PDF Summary
        </button>
      </div>
    </div>
  );
};

export default EmployeePage;
