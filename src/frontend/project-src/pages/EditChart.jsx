import EditChartStepper from "../components/editchart/EditChartStepper";
import EditChartButtons from "../components/editchart/EditChartButtons";
import DownloadButtons from "../components/editchart/DownloadButtons";
import { Download } from 'lucide-react';

function EditChart() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
            <EditChartStepper />
            <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                        <div>
                            <h2 className="font-semibold text-center">Edit Chart</h2>
                            <p className="text-md text-gray-600 text-center mb-10">
                                Review and edit your generated chart below.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 bg-blue-50 rounded-xl p-4 sm:p-6">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-6">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <h3 className="text-lg font-semibold">Download Visual</h3>
                                        <Download className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-1 mb-4 italic">
                                        Download your visual using one of the formats below
                                    </p>
                                    <DownloadButtons />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditChartButtons />
        </div>
    );
}

export default EditChart;
