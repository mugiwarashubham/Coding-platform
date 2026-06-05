import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import axiosClient from "../utils/axiosClient";

function AdminUpdate() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const { data } =
      await axiosClient.get(
        "/problem/getAllProblem"
      );

    setProblems(data);
  };

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Update Problems
      </h1>

      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="card bg-base-100 shadow-md"
          >
            <div className="card-body flex-row justify-between items-center">

              <div>
                <h2 className="font-bold">
                  {problem.title}
                </h2>

                <div className="flex gap-2 mt-2">
                  <span className="badge">
                    {problem.difficulty}
                  </span>
                </div>
              </div>

              <NavLink
                to={`/admin/update/${problem._id}`}
                className="btn btn-warning"
              >
                Update
              </NavLink>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUpdate;