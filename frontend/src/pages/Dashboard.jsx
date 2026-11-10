
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const categories = [
  "Electrical",
  "Plumbing",
  "Internet",
  "Furniture",
  "Classroom Equipment",
  "Cleanliness",
  "Other"
];

const statuses = [
  "Open",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected"
];

export default function Dashboard() {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("popular");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/issues", {
        params: { search, category, status, sort }
      });

      setIssues(data.issues);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load issues");
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, category, status, sort]);

  const like = async (id) => {
    try {
      const { data } = await api.post(`/issues/${id}/like`);

      setIssues((current) =>
        current.map((issue) => {
          if (issue._id !== id) return issue;

          const likes = issue.likes || [];

          return {
            ...issue,
            likeCount: data.likeCount,
            likes: data.liked
              ? [...likes, user.id]
              : likes.filter((uid) => String(uid) !== user.id)
          };
        })
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update support");
    }
  };

  const openCount = issues.filter(
    (issue) => !["Resolved", "Rejected"].includes(issue.status)
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  const supportCount = issues.reduce(
    (total, issue) => total + (issue.likeCount || 0),
    0
  );

  return (
    <div className="dashboard">
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">CAMPUS OPERATIONS</p>
          <h1>Issues</h1>
          <p className="muted">
            Keep track of problems reported across your campus.
          </p>
        </div>

        <Link to="/report" className="button button-primary">
          + Report issue
        </Link>
      </section>

      <section className="dashboard-stats">
        <div className="stat-card">
          <span>Total issues</span>
          <strong>{issues.length}</strong>
          <small>Matching current filters</small>
        </div>

        <div className="stat-card">
          <span>Open and ongoing</span>
          <strong>{openCount}</strong>
          <small>Need attention</small>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
          <small>Successfully completed</small>
        </div>

        <div className="stat-card">
          <span>Community support</span>
          <strong>{supportCount}</strong>
          <small>Total likes received</small>
        </div>
      </section>

      <section className="issue-section">
        <div className="issue-section-heading">
          <div>
            <h2>Reported issues</h2>
            <p className="muted">
              Browse reports and follow their progress.
            </p>
          </div>

          <span className="result-count">
            {issues.length} results
          </span>
        </div>

        <div className="filters">
          <input
            aria-label="Search issues"
            placeholder="Search by title, description or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Most supported</option>
            <option value="newest">Newest first</option>
          </select>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="issue-table-wrapper">
          <table className="issue-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Support</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => {
                const liked = issue.likes?.some(
                  (id) => String(id) === user?.id
                );

                return (
                  <tr key={issue._id}>
                    <td>
                      <Link
                        to={`/issues/${issue._id}`}
                        className="table-issue-title"
                      >
                        {issue.title}
                      </Link>

                      <small className="table-reporter">
                        Reported by {issue.createdBy?.name || "Campus member"}
                      </small>
                    </td>

                    <td>
                      <span className="table-category">
                        {issue.category}
                      </span>
                    </td>

                    <td className="table-location">
                      {issue.location}
                    </td>

                    <td>
                      <span className={`status status-${issue.status.toLowerCase().replaceAll(" ", "-")}`}>
                        {issue.status}
                      </span>
                    </td>

                    <td>
                      <span className={`priority priority-${issue.priority.toLowerCase()}`}>
                        {issue.priority}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`table-like ${liked ? "is-liked" : ""}`}
                        onClick={() => like(issue._id)}
                        disabled={issue.createdBy?._id === user?.id}
                        title="Support this issue"
                      >
                        ♥ {issue.likeCount ?? issue.likes?.length ?? 0}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {issues.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty">
                    No issues found. Try changing your filters or report an issue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
