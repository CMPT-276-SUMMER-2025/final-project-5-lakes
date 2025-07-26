


function bytesToMB(size) {
    if (size < 1024) {
        return size + ' bytes';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}


function ViewUpload({fileName, fileSize}) {
    return (
        <div>
            <p className="text-lg font-semibold">View Upload</p>
            <div className="mt-1 p-3 border rounded bg-white shadow-sm text-sm mb-10 hover:bg-gray-100 hover:cursor-pointer">
                <div className="flex items-center justify-between">
                    <span>{fileName}</span>
                    <span className="text-xs text-gray-500">{bytesToMB(fileSize)}</span>
                </div>
            </div>
        </div>
    );
}

export default ViewUpload;