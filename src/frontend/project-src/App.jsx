import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";     
import DataConfirm from "./pages/DataConfirm"; 
import VisualSelect from "./pages/VisualSelect";
import EditChart from "./pages/EditChart";
import ExportPage from "./pages/ExportPage";
import Header from "./components/layout/Header";     
import Footer from "./components/layout/Footer";     

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/data-confirm" element={<DataConfirm/>} /> 
        <Route path="/visual-select" element={<VisualSelect />} />
        <Route path="/edit-chart" element={<EditChart />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;

