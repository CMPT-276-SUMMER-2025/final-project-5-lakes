
function AdditionalInfo() {
  return (
    <div>
      <p className="text-lg font-semibold">Provide Additional Information</p>
      <p className="text-sm text-gray-500 mb-2 italic">
        (Optional) You can include information such as the colour themes and font styles for your visual.
      </p>
      <textarea
        className="w-full mt-2 border p-2 rounded resize-none"
        rows={3}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default AdditionalInfo;