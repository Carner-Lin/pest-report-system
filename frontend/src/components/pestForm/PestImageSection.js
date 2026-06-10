// This component handles image upload, preview, and AI identification display.

function PestImageSection({
                              selectedImageFile,
                              imagePreview,
                              aiLoading,
                              aiResult,
                              onImageChange,
                              onIdentifyPest,
                          }) {
    return (
        <div className="submit-image-box">
            <div className="submit-image-header">
                <label className="submit-image-label">Upload pest image</label>
                <button
                    type="button"
                    className="ai-identify-btn"
                    onClick={onIdentifyPest}
                    disabled={aiLoading}
                >
                    {aiLoading ? "Identifying." : "Identify with AI"}
                </button>
            </div>

            <div className="custom-file-upload">
                <input
                    id="pest-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden-file-input"
                />

                <label htmlFor="pest-image-upload" className="custom-file-btn">
                    Choose File
                </label>

                <span className="custom-file-name">
                    {selectedImageFile ? selectedImageFile.name : "No file chosen"}
                </span>
            </div>

            <div className="submit-image-preview-box">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        className="submit-image-preview"
                    />
                ) : (
                    <div className="submit-image-placeholder">
                        No image selected
                    </div>
                )}
            </div>

            {aiResult && (
                <div className="ai-result-box">
                    <p>
                        <strong>AI Predicted Name:</strong> {aiResult.predicted_name}
                    </p>
                    <p>
                        <strong>Type:</strong> {aiResult.predicted_type}
                    </p>
                    <p>
                        <strong>Confidence:</strong>{" "}
                        {Math.round((aiResult.confidence || 0) * 100)}%
                    </p>
                    <p className="ai-result-note">
                        AI suggestion only. Please verify before submitting.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PestImageSection;