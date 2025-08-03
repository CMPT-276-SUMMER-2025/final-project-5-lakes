import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";     
import EditData from "./pages/EditData"; 
import VisualSelect from "./pages/VisualSelect";
import EditSave from "./pages/EditSave";
import Header from "./components/layout/Header";     
import Footer from "./components/layout/Footer";  
import FAQPage from "./pages/FAQPage";   
import AboutUs from "./pages/AboutUsPage"; 

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit-data" element={<EditData />} />
        <Route path="/visual-select" element={<VisualSelect />} />
        <Route path="/edit-save" element={<EditSave />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;

