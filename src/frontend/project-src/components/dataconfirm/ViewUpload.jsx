function ViewUpload({ fileName, fileSize, fileContent }) {
  const handleClick = () => {
    
    try {
      if (fileContent?.startsWith("data:")) {
        const [meta, base64Data] = fileContent.split(",");
        const mimeMatch = meta.match(/data:(.*);base64/);

        if (!mimeMatch || !base64Data) {
          alert("Could not read file preview.");
          return;
        }

        const mime = mimeMatch[1];
        const byteChars = atob(base64Data);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });

        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } else if (fileContent?.startsWith("http")) {
        window.open(fileContent, "_blank");
      } else {
        alert("File preview not available.");
      }
    } catch (err) {
      console.error("Failed to open file:", err);
      alert("Something went wrong opening the file.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full max-w-[220px] p-2 border rounded bg-white shadow-sm text-xs hover:bg-gray-100 hover:cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <span className="truncate max-w-[130px]">{fileName}</span>
          <span className="text-[10px] text-gray-500">
            {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>
    </div>
  );
}

export default ViewUpload;