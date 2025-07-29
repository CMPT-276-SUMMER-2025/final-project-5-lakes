function ViewUpload({ fileName, fileSize, fileContent }) {
  const handleClick = () => {
    // If it's base64: create a Blob and open in new tab
    if (fileContent.startsWith("data:")) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <iframe 
            src="${fileContent}" 
            frameborder="0" 
            style="width:100%;height:100vh;"
            allowfullscreen
          ></iframe>
        `);
      } else {
        alert("Please allow popups for this website.");
      }
    } else {
      // If it's a URL: open directly
      window.open(fileContent, "_blank");
    }
  };

  return (
    <div>
      <p className="text-lg font-semibold">View Upload</p>
      <div
        className="mt-1 p-3 border rounded bg-white shadow-sm text-sm mb-10 hover:bg-gray-100 hover:cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <span>{fileName}</span>
          <span className="text-xs text-gray-500">
            {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      </div>
    </div>
  );
}