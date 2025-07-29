import { useLocation } from "react-router-dom";


function ExportPage() {
  const location = useLocation();
  const { chartConfig } = location.state || {};
  console.log(chartConfig);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Export Your Data</h1>
      <p className="text-lg text-gray-600 mb-8">
        Choose the format you want to export your data to.
      </p>
      {/* Export options go here */}
    </div>
  );
}
export default ExportPage;