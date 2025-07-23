
function ViewUpload() {
    return (
        <div>
            <p className="text-lg font-semibold">View Upload</p>
            <div className="mt-1 p-3 border rounded bg-white shadow-sm text-sm mb-10 hover:bg-gray-100 hover:cursor-pointer">
                <div className="flex items-center justify-between">
                    <span>user_upload.pdf</span>
                    <span className="text-xs text-gray-500">4.1 MB</span>
                </div>
            </div>
        </div>
    );
}

export default ViewUpload;