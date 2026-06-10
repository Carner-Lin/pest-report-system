// This component renders the text and select fields for the pest report form.

function PestBasicFields({
                             pests,
                             formData,
                             onChange,
                             onDatabaseSelect,
                         }) {
    return (
        <div className="submit-basic-box">
            <h4>Report details</h4>

            <div className="form-group">
                <label>Select from pest database</label>
                <select value={formData.pest_id} onChange={onDatabaseSelect}>
                    <option value="">-- Select from database --</option>
                    {pests.map((pest) => (
                        <option key={pest.id} value={pest.id}>
                            {pest.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Pest name</label>
                <input
                    type="text"
                    name="custom_pest_name"
                    placeholder="Enter pest name"
                    value={formData.custom_pest_name}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label>Type</label>
                <input
                    type="text"
                    name="pest_type"
                    placeholder="Enter pest type"
                    value={formData.pest_type}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    placeholder="Enter pest description"
                    value={formData.description}
                    onChange={onChange}
                />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select
                    name="status_choice"
                    value={formData.status_choice}
                    onChange={onChange}
                >
                    <option value="Uncertain">Uncertain</option>
                    <option value="Regulated">Regulated</option>
                    <option value="Non-regulated">Non-regulated</option>
                    <option value="Not assessed">Not assessed</option>
                </select>
            </div>

            <div className="form-group">
                <label>Notifiable</label>
                <select
                    name="notifiable_choice"
                    value={formData.notifiable_choice}
                    onChange={onChange}
                >
                    <option value="Uncertain">Uncertain</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
        </div>
    );
}

export default PestBasicFields;