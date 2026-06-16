import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [problemId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const { data } =
        await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );

      setSubmissions(
        Array.isArray(data) ? data : []
      );

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data ||
          "Failed to fetch submission history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";

      case "wrong":
        return "badge-error";

      case "error":
        return "badge-warning";

      case "pending":
        return "badge-info";

      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory = 0) => {
    if (memory < 1024)
      return `${memory} KB`;

    return `${(memory / 1024).toFixed(
      2
    )} MB`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-6">
        Submission History
      </h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="alert alert-info">
          <span>
            No submissions found
          </span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table table-zebra">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Passed</th>
                  <th>Submitted</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map(
                  (submission, index) => (
                    <tr
                      key={submission._id}
                    >
                      <td>
                        {index + 1}
                      </td>

                      <td className="font-mono">
                        {
                          submission.language
                        }
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {
                            submission.status
                          }
                        </span>
                      </td>

                      <td>
                        {submission.runtime
                          ? `${submission.runtime.toFixed(
                              3
                            )} s`
                          : "-"}
                      </td>

                      <td>
                        {formatMemory(
                          submission.memory
                        )}
                      </td>

                      <td>
                        {
                          submission.testCasesPassed
                        }
                        /
                        {
                          submission.testCasesTotal
                        }
                      </td>

                      <td>
                        {formatDate(
                          submission.createdAt
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() =>
                            setSelectedSubmission(
                              submission
                            )
                          }
                        >
                          View Code
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>

          <div className="mt-4 text-sm opacity-70">
            Total Submissions:{" "}
            {submissions.length}
          </div>
        </>
      )}

      {selectedSubmission && (
        <div
          className="modal modal-open"
          onClick={() =>
            setSelectedSubmission(null)
          }
        >
          <div
            className="modal-box max-w-5xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3 className="font-bold text-lg mb-4">
              Submission Details
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`badge ${getStatusColor(
                  selectedSubmission.status
                )}`}
              >
                {
                  selectedSubmission.status
                }
              </span>

              <span className="badge badge-outline">
                Language:{" "}
                {
                  selectedSubmission.language
                }
              </span>

              <span className="badge badge-outline">
                Runtime:{" "}
                {
                  selectedSubmission.runtime
                }
                s
              </span>

              <span className="badge badge-outline">
                Memory:{" "}
                {formatMemory(
                  selectedSubmission.memory
                )}
              </span>

              <span className="badge badge-outline">
                Passed:{" "}
                {
                  selectedSubmission.testCasesPassed
                }
                /
                {
                  selectedSubmission.testCasesTotal
                }
              </span>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="alert alert-error mb-4">
                <span>
                  {
                    selectedSubmission.errorMessage
                  }
                </span>
              </div>
            )}

            <pre className="bg-base-300 p-4 rounded-lg overflow-auto max-h-[500px]">
              <code>
                {
                  selectedSubmission.code
                }
              </code>
            </pre>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() =>
                  setSelectedSubmission(
                    null
                  )
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;