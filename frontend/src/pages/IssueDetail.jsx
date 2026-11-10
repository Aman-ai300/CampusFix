
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const statuses = [
  "Open",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected"
];

export default function IssueDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [issue, setIssue] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/issues/${id}`);
      setIssue(data.issue);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load issue");
    }
  };

  useEffect(() => {
    load();

    if (user.role === "admin") {
      api.get("/users/staff")
        .then(({ data }) => setStaff(data.staff))
        .catch(() => {});
    }
  }, [id, user.role]);

  const updateStatus = async (status) => {
    setBusy(true);
    setError("");

    try {
      const { data } = await api.patch(`/issues/${id}/status`, { status });
      setIssue(data.issue);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setBusy(false);
    }
  };

  const assign = async () => {
    if (!staffId) return;

    setBusy(true);
    setError("");

    try {
      const { data } = await api.patch(`/issues/${id}/assign`, { staffId });
      setIssue(data.issue);
      setStaffId("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not assign staff");
    } finally {
      setBusy(false);
    }
  };

  const like = async () => {
    setError("");

    try {
      const { data } = await api.post(`/issues/${id}/like`);

      setIssue((current) => ({
        ...current,
        likes: data.liked
          ? [...(current.likes || []), user.id]
          : (current.likes || []).filter(
              (item) => String(item?._id || item) !== user.id
            ),
        likeCount: data.likeCount
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update support");
    }
  };

  if (!issue) {
    return (
      <div className="detail-page">
        <Link to="/" className="report-back">← Back to issues</Link>
        <div className="detail-message">
          {error || "Loading issue..."}
        </div>
      </div>
    );
  }

  const liked = issue.likes?.some(
    (item) => String(item?._id || item) === user.id
  );

  const isOwner = String(issue.createdBy?._id) === user.id;

  return (
    <div className="detail-page">
      <Link to="/" className="report-back">
        ← Back to issues
      </Link>

      <div className="detail-heading">
        <div>
          <p className="eyebrow">CAMPUS OPERATIONS / ISSUE DETAILS</p>
          <h1>Issue details</h1>
        </div>

        <span className={`status status-${issue.status.toLowerCase().replaceAll(" ", "-")}`}>
          {issue.status}
        </span>
      </div>

      {error && <div className="alert">{error}</div>}

      <article className="detail-record">
        <div className="detail-record-top">
          <span className="category-pill">{issue.category}</span>
          <span className={`priority priority-${issue.priority.toLowerCase()}`}>
            {issue.priority} priority
          </span>
        </div>

        <h2>{issue.title}</h2>

        <div className="detail-description-section">
          <h3>Description</h3>
          <p>{issue.description}</p>
        </div>

        <div className="detail-information">
          <div>
            <small>LOCATION</small>
            <strong>{issue.location}</strong>
          </div>

          <div>
            <small>REPORTED BY</small>
            <strong>{issue.createdBy?.name || "Campus member"}</strong>
          </div>

          <div>
            <small>ASSIGNED TO</small>
            <strong>{issue.assignedTo?.name || "Not assigned"}</strong>
          </div>

          <div>
            <small>DATE REPORTED</small>
            <strong>
              {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </strong>
          </div>
        </div>

        <div className="detail-support">
          <div>
            <strong>Community support</strong>
            <p>
              Supporting an issue helps the campus team understand what needs attention.
            </p>
          </div>

          <button
            className={`button ${liked ? "button-outline" : "button-primary"}`}
            onClick={like}
            disabled={isOwner}
          >
            {liked ? "♥ Supported" : "♡ Support issue"}
            {" · "}
            {issue.likeCount ?? issue.likes?.length ?? 0}
          </button>
        </div>

        {isOwner && (
          <p className="detail-note">
            You cannot support an issue you reported yourself.
          </p>
        )}
      </article>

      {(user.role === "admin" || user.role === "staff") && (
        <section className="detail-management">
          <div className="management-heading">
            <p className="eyebrow">STAFF WORKSPACE</p>
            <h2>Manage issue</h2>
            <p>Update the progress of this campus issue.</p>
          </div>

          <label>
            Issue status
            <select
              value={issue.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={busy}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          {user.role === "admin" && (
            <div className="assign-section">
              <label>
                Assign maintenance staff
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  <option value="">Choose a staff member</option>
                  {staff.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} · {member.email}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="button button-primary"
                onClick={assign}
                disabled={!staffId || busy}
              >
                {busy ? "Saving..." : "Assign issue"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

