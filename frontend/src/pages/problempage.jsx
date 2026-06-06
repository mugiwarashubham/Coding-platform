import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/chatAi';

const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript',
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  const { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const data = response.data;
        // ✅ FIX: .toLowerCase() lagaya taaki 'JavaScript' aur 'javascript' dono match karein
        const sc = data.startCode.find(sc => sc.language.toLowerCase() === langMap['javascript']);
        setProblem(data);
        setCode(sc?.initialCode || '');
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      // ✅ FIX: yahan bhi .toLowerCase()
      const sc = problem.startCode.find(sc => sc.language.toLowerCase() === langMap[selectedLanguage]);
      setCode(sc?.initialCode || '');
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: langMap[selectedLanguage],
      });
      setRunResult(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({ _error: error?.response?.data || 'Internal server error' });
    } finally {
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: langMap[selectedLanguage],
      });
      setSubmitResult(response.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({ _error: error?.response?.data || 'Internal server error' });
    } finally {
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">

      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeLeftTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab === 'chatAI' ? 'ChatAI' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-relaxed mb-8">
                    {problem.description}
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                        <div className="space-y-1 text-sm font-mono">
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                          {example.explanation && (
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <p className="text-sm text-gray-500">Editorial coming soon.</p>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-base-300 rounded-lg">
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg font-semibold">
                          {problem.title} — {solution.language}
                        </div>
                        <pre className="bg-base-300 p-4 rounded-b-lg text-sm overflow-x-auto">
                          <code>{solution.completeCode}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
                   <ChatAi problem={problem} currentCode={code} currentLanguage={selectedLanguage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['code', 'testcase', 'result'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeRightTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab === 'testcase' ? 'Testcase' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">

          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-base-300">
                {['javascript', 'java', 'cpp'].map(lang => (
                  <button
                    key={lang}
                    className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                  </button>
                ))}
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  onMount={(editor) => { editorRef.current = editor; }}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    folding: true,
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              <div className="p-4 border-t border-base-300 flex justify-between items-center">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveRightTab('testcase')}
                >
                  Console
                </button>
                <div className="flex gap-2">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner loading-xs" /> : 'Run'}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner loading-xs" /> : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>

              {!runResult && (
                <p className="text-gray-500 text-sm">
                  Click "Run" to test your code with the example test cases.
                </p>
              )}

              {runResult?._error && (
                <div className="alert alert-error text-sm">
                  {String(runResult._error)}
                </div>
              )}

              {Array.isArray(runResult) && (() => {
                const allPassed = runResult.every(tc => tc.status_id === 3);
                return (
                  <div className="space-y-4">
                    <div className={`alert ${allPassed ? 'alert-success' : 'alert-error'}`}>
                      <span className="font-semibold">
                        {allPassed ? '✅ All test cases passed!' : '❌ Some test cases failed'}
                      </span>
                    </div>

                    {runResult.map((tc, i) => {
                      const passed = tc.status_id === 3;
                      const visibleTC = problem?.visibleTestCases?.[i];
                      return (
                        <div
                          key={i}
                          className={`rounded-lg border ${passed ? 'border-green-500/40' : 'border-red-500/40'} overflow-hidden`}
                        >
                          <div className={`px-4 py-2 text-sm font-semibold flex items-center gap-2
                            ${passed ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                            {passed
                              ? `✓ Test ${i + 1} Passed`
                              : `✗ Test ${i + 1} Failed — ${tc.status?.description || 'Wrong Answer'}`}
                            {passed && tc.time && (
                              <span className="ml-auto text-xs font-normal text-gray-400">{tc.time}s</span>
                            )}
                          </div>
                          <div className="bg-base-200 p-4 space-y-3 text-sm font-mono">
                            <div>
                              <div className="text-xs text-gray-400 mb-1 font-sans">Input</div>
                              <pre className="bg-base-300 rounded p-2 whitespace-pre-wrap break-all">
                                {visibleTC?.input ?? '—'}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1 font-sans">Expected Output</div>
                              <pre className="bg-base-300 rounded p-2 whitespace-pre-wrap break-all">
                                {visibleTC?.output ?? '—'}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1 font-sans">Your Output</div>
                              <pre className={`rounded p-2 whitespace-pre-wrap break-all ${passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                {tc.stdout?.trim() || '(no output)'}
                              </pre>
                            </div>
                            {tc.stderr && (
                              <div>
                                <div className="text-xs text-red-400 mb-1 font-sans">Stderr</div>
                                <pre className="bg-red-500/10 rounded p-2 text-red-400 whitespace-pre-wrap break-all">
                                  {tc.stderr}
                                </pre>
                              </div>
                            )}
                            {tc.compile_output && (
                              <div>
                                <div className="text-xs text-yellow-400 mb-1 font-sans">Compile Error</div>
                                <pre className="bg-yellow-500/10 rounded p-2 text-yellow-400 whitespace-pre-wrap break-all">
                                  {tc.compile_output}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>

              {!submitResult && (
                <p className="text-gray-500 text-sm">
                  Click "Submit" to submit your solution for evaluation.
                </p>
              )}

              {submitResult?._error && (
                <div className="alert alert-error text-sm">
                  {String(submitResult._error)}
                </div>
              )}

              {submitResult && !submitResult._error && (() => {
                const accepted = submitResult.status === 'accepted';
                return (
                  <div className={`rounded-lg border overflow-hidden ${accepted ? 'border-green-500/40' : 'border-red-500/40'}`}>
                    <div className={`px-6 py-4 ${accepted ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <h4 className={`text-xl font-bold ${accepted ? 'text-green-600' : 'text-red-500'}`}>
                        {accepted
                          ? '🎉 Accepted'
                          : `❌ ${submitResult.status === 'wrong' ? 'Wrong Answer' : 'Runtime Error'}`}
                      </h4>
                    </div>
                    <div className="bg-base-200 p-6 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Test Cases</span>
                        <span className="font-mono font-semibold">
                          {submitResult.testCasesPassed} / {submitResult.testCasesTotal}
                        </span>
                      </div>
                      {accepted && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Runtime</span>
                            <span className="font-mono font-semibold">
                              {submitResult.runtime ? `${submitResult.runtime.toFixed(3)} s` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Memory</span>
                            <span className="font-mono font-semibold">
                              {submitResult.memory ? `${submitResult.memory} KB` : '—'}
                            </span>
                          </div>
                        </>
                      )}
                      {!accepted && submitResult.errorMessage && (
                        <div>
                          <div className="text-xs text-red-400 mb-1">Error</div>
                          <pre className="bg-red-500/10 rounded p-3 text-red-400 text-xs whitespace-pre-wrap overflow-x-auto">
                            {submitResult.errorMessage}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
