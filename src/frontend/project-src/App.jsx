import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";      
import Header from "./components/Header";     
import Footer from "./components/Footer";     

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/data-confirm" element={<DataConfirm/>} /> */}
        {/* <Route path="/visual-select" element={<VisualSelect />} /> */}
        {/* <Route path="/edit-save" element={<EditSave />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;

