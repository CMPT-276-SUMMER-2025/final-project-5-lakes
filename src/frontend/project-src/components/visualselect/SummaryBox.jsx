import { ClipboardList } from "lucide-react";

function SummaryBox({ summary }) {
  const hasSummary = Array.isArray(summary) && summary.length > 0;

  return (
    <div className="w-full max-w-6xl mt-10 text-left bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <ClipboardList className="text-blue-600 mr-3 mb-2" size={25} />
        <h3 className="text-xl font-semibold text-gray-800 leading-none">Data Summary</h3>
      </div>

      {hasSummary ? (
        <ul className="text-gray-600 text-lg space-y-2 mt-2">
          {summary.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-lg">No summary available</p>
      )}
    </div>
  );
}

export default SummaryBox;