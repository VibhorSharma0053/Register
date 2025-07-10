import DashboardPage from "./pages/Dashboard";
import EmployeeDetail from "./pages/EmployeePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/employee/:id" element={<EmployeeDetail />} />
      </Routes>
    </BrowserRouter>

    // <EmployeeDetail/>
  );
};

export default App;
