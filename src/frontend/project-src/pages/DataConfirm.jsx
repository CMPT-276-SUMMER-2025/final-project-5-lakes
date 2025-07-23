import DataConfirmStepper from "../components/dataconfirm/DataConfirmStepper";
import EditableTable from "../components/dataconfirm/EditableTable";
import ViewUpload from "../components/dataconfirm/ViewUpload";
import AdditionalInfo from "../components/dataconfirm/AdditionalInfo";
import DataConfirmButtons from "../components/dataconfirm/DataConfirmButtons";

function DataConfirm() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
      <DataConfirmStepper />
      <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left - Data Table */}
          <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div>
              <h2 className="font-semibold text-center">Edit Data</h2>
              <p className="text-md text-gray-600 text-center mb-10">
                Review and edit your uploaded data below. You can modify any field as needed.
              </p>
              <EditableTable />
            </div>
          </div>

          {/* Right - Main Content */}
          <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-center">Review Your Upload</h2>
                <p className="text-md text-gray-600 text-center mb-10">
                  Review your uploaded files and make any necessary adjustments before proceeding to the next step.
                </p>
                <ViewUpload />
                <AdditionalInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DataConfirmButtons />
    </div>
  );
}

export default DataConfirm;