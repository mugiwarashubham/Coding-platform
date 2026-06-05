import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data.problemSolved || []);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags?.includes(filters.tag);
    const isSolved = solvedProblems.some(sp => sp._id === problem._id);
    const statusMatch = filters.status === 'all' || (filters.status === 'solved' && isSolved);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar — same as photo */}
      <nav className="navbar bg-base-100 shadow-md px-5">
        <div className="flex-1">
          <NavLink to="/" className="text-2xl font-bold text-primary">
            CodeMaster
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium">Hi, {user?.firstName}</span>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="btn btn-outline btn-sm">
              Admin Panel
            </NavLink>
          )}
          <button className="btn btn-error btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content — same max-w as photo */}
      <div className="max-w-6xl mx-auto p-6">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedlist">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
            <option value="tree">Tree</option>
            <option value="sorting">Sorting</option>
            <option value="math">Math</option>
          </select>
        </div>

        {/* Problem List — same as photo */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center text-lg mt-10">No Problems Found</div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedProblems.some(sp => sp._id === problem._id);
              return (
                <div key={problem._id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="text-lg font-semibold hover:text-primary"
                      >
                        {problem.title}
                      </NavLink>
                      {isSolved && (
                        <div className="badge badge-success">Solved</div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {problem.tags?.map(tag => (
                        <span key={tag} className="badge badge-info">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;
