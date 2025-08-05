import { ChartColumnIncreasing } from "lucide-react";
import PageLoader from "./PageLoader";

function LoadingPopUp({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Reading your table... <ChartColumnIncreasing className="w-5 h-5" />
      </h3>
      <PageLoader />
    </div>
  );
}

export default LoadingPopUp;