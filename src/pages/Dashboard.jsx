import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      title: "Senior Developer",
      earned: 75000,
      initials: "AJ",
      color: "bg-orange-300",
    },
    {
      id: 2,
      name: "Bob Williams",
      title: "Product Manager",
      earned: 82000,
      initials: "BW",
      color: "bg-black text-white",
    },
    {
      id: 3,
      name: "Charlie Davis",
      title: "UX Designer",
      earned: 68000,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 4,
      name: "Diana Miller",
      title: "Marketing Specialist",
      earned: 62000,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 5,
      name: "Ethan Green",
      title: "Data Analyst",
      earned: 70000,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ]);

  // ➕ Add Employee Logic
  const handleAddEmployee = () => {
    setShowAddModal(true);
  };

  const confirmAddEmployee = () => {
    if (!newEmpName.trim()) {
      alert("Please enter a name.");
      return;
    }

    const initials = newEmpName
      .split(" ")
      .map((w) => w[0].toUpperCase())
      .join("")
      .slice(0, 2);

    const newEmp = {
      id: Date.now(),
      name: newEmpName,
      title: "New Designation",
      earned: 0,
      initials,
      color: "bg-blue-300",
    };

    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setNewEmpName("");
  };

  // 🗑 Remove Employee Logic
  const handleRemoveEmployee = () => {
    setShowModal(true); // show modal instead of direct removal
  };

  const confirmDelete = () => {
    if (!selectedEmpId) return;
    const updated = employees.filter(
      (emp) => emp.id !== parseInt(selectedEmpId)
    );
    setEmployees(updated);
    setShowModal(false);
    setSelectedEmpId(null);
  };

  const handleCardClick = (id) => {
    navigate(`/employee/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white max-w-md mx-auto text-sm px-4 pt-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Employee Register</h1>
        <div className="flex items-center gap-3">
          <span className="material-icons text-gray-600 cursor-pointer">
            logout
          </span>
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="admin"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

      {/* Employee List */}
      <div className="space-y-4 mb-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => handleCardClick(emp.id)}
            className="cursor-pointer flex justify-between items-center bg-white border rounded-lg px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {emp.image ? (
                <img
                  src={emp.image}
                  alt={emp.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${emp.color}`}
                >
                  {emp.initials}
                </div>
              )}
              <div>
                <div className="font-medium">{emp.name}</div>
                <div className="text-gray-500 text-xs">{emp.title}</div>
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Earned:</span>{" "}
                  <span className="text-rose-600 font-semibold">
                    ${emp.earned.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-pink-500 font-bold text-lg">›</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddEmployee}
          className="bg-indigo-600 text-white py-2 rounded-full font-medium hover:bg-indigo-700"
        >
          + Add New Employee
        </button>
        <button
          onClick={handleRemoveEmployee}
          className="bg-rose-500 text-white py-2 rounded-full font-medium hover:bg-rose-600"
        >
          🗑 Remove Employee
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t bg-white flex justify-around py-2 text-gray-500 text-xs">
        <div className="flex flex-col items-center">
          <span className="material-icons text-lg">home</span>
          <span>Home</span>
        </div>
        <div className="flex flex-col items-center text-blue-600">
          <span className="material-icons text-lg">groups</span>
          <span>Employees</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="material-icons text-lg">bar_chart</span>
          <span>Analytics</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="material-icons text-lg">settings</span>
          <span>Settings</span>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Remove Employee</h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={selectedEmpId || ""}
              onChange={(e) => setSelectedEmpId(e.target.value)}
            >
              <option value="" disabled>
                Select an employee
              </option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
            <input
              type="text"
              placeholder="Enter employee name"
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={confirmAddEmployee}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
