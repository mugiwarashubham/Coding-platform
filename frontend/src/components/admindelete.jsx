import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const { data } = await axiosClient.get(
        "/problem/getAllProblem"
      );

      setProblems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Delete "${title}" ?`
    );

    if (!confirmDelete) return;

    try {
      await axiosClient.delete(
        `/problem/delete/${id}`
      );

      setProblems((prev) =>
        prev.filter(
          (problem) => problem._id !== id
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete problem");
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "badge-success";

      case "medium":
        return "badge-warning";

      case "hard":
        return "badge-error";

      default:
        return "badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Delete Problems
      </h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table table-zebra">

          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {problems.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8"
                >
                  No Problems Found
                </td>
              </tr>
            ) : (
              problems.map((problem, index) => (
                <tr key={problem._id}>
                  <td>{index + 1}</td>

                  <td>{problem.title}</td>

                  <td>
                    <span
                      className={`badge ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="badge badge-outline"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() =>
                        handleDelete(
                          problem._id,
                          problem.title
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminDelete;