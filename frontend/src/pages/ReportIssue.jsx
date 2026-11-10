
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const categories = [
  "Electrical",
  "Plumbing",
  "Internet",
  "Furniture",
  "Classroom Equipment",
  "Cleanliness",
  "Other"
];

export default function ReportIssue() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { data } = await api.post("/issues", form);
      navigate(`/issues/${data.issue._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit issue");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="report-page">
      <button
        type="button"
        className="report-back"
        onClick={() => navigate(-1)}
      >
        ← Back to issues
      </button>

      <div className="report-heading">
        <p className="eyebrow">CAMPUS OPERATIONS</p>
        <h1>Report an issue</h1>
        <p className="muted">
          Tell us what's wrong and where it needs attention.
        </p>
      </div>

      <form className="report-form" onSubmit={submit}>
        <div className="report-form-heading">
          <h2>Issue information</h2>
          <p>Fields marked with * are required.</p>
        </div>

        <label>
          Issue title *
          <input
            name="title"
            value={form.title}
            onChange={change}
            required
            maxLength="120"
            placeholder="e.g. Projector not working in Room 204"
          />
        </label>

        <label>
          Category *
          <select
            name="category"
            value={form.category}
            onChange={change}
            required
          >
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Campus location *
          <input
            name="location"
            value={form.location}
            onChange={change}
            required
            maxLength="120"
            placeholder="Building, floor, room or area"
          />
          <small className="field-help">
            Be specific so the maintenance team can find the problem.
          </small>
        </label>

        <label>
          Description *
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            required
            maxLength="2000"
            rows="5"
            placeholder="Describe what happened and who is affected..."
          />
          <small className="field-help">
            Maximum 2000 characters.
          </small>
        </label>

        {error && <div className="alert">{error}</div>}

        <div className="report-actions">
          <button
            type="button"
            className="button button-outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {busy ? "Submitting..." : "Submit report"}
          </button>
        </div>
      </form>
    </div>
  );
}

