import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";     
import DataConfirm from "./pages/DataConfirm"; 
import VisualSelect from "./pages/VisualSelect";
import EditSave from "./pages/EditSave";
import Header from "./components/layout/Header";     
import Footer from "./components/layout/Footer";  
import FAQPage from "./pages/FAQPage";   

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/data-confirm" element={<DataConfirm/>} /> 
        <Route path="/visual-select" element={<VisualSelect />} />
        <Route path="/edit-save" element={<EditSave />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;

