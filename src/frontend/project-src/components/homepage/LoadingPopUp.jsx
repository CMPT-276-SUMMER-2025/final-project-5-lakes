import { ChartColumnIncreasing } from "lucide-react";
import PageLoader from "./PageLoader";

// LoadingPopUp: Displays a full-screen loading overlay while data is being processed
function LoadingPopUp({ show }) {
  // If not loading, render nothing
  if (!show) return null;

  return (
    // Full-screen white overlay centered with a loading message and animated icon
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Title with animated chart icon */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Reading file... <ChartColumnIncreasing className="w-5 h-5" />
      </h3>
      
      {/* Animated loader */}
      <PageLoader />
    </div>
  );
}

export default LoadingPopUp;