import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Hospitals } from "./pages/Hospitals";
import { Medicines } from "./pages/Medicines";
import { Schemes } from "./pages/Schemes";
import { Appointments } from "./pages/Appointments";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
