import EditSaveStepper from "../components/editsave/EditSaveStepper";

function EditSave() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-inter">
          <EditSaveStepper />
          <div className="bg-blue-50 rounded-2xl shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              {/* Add your content here */}
            </div>
          </div>
        </div>
    );
}

export default EditSave;
