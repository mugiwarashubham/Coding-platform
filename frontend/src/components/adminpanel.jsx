import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z.array(
    z.enum([
      "array",
      "linkedlist",
      "graph",
      "dp",
      "tree",
      "math",
      "sorting",
    ])
  ).min(1, "Select at least one tag"),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1),
        output: z.string().min(1),
        explanation: z.string().optional(),
      })
    )
    .min(1),

  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1),
        output: z.string().min(1),
      })
    )
    .min(1),

  startCode: z.array(
    z.object({
      language: z.string(),
      initialCode: z.string().min(1),
    })
  ),

  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1),
    })
  ),
});

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),

    defaultValues: {
      tags: ["array"],

      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      hiddenTestCases: [
        {
          input: "",
          output: "",
        },
      ],

      startCode: [
        {
          language: "c++",
          initialCode: "",
        },
        {
          language: "java",
          initialCode: "",
        },
        {
          language: "javascript",
          initialCode: "",
        },
      ],

      referenceSolution: [
        {
          language: "c++",
          completeCode: "",
        },
        {
          language: "java",
          completeCode: "",
        },
        {
          language: "javascript",
          completeCode: "",
        },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosClient.post(
        "/problem/create",
        data
      );

      console.log(response.data);

      alert("Problem Created Successfully");
      navigate("/");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-4xl font-bold mb-8">
          Create Problem
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          {/* BASIC INFO */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <h2 className="card-title mb-4">
                Basic Information
              </h2>

              <input
                {...register("title")}
                placeholder="Problem Title"
                className="input input-bordered w-full"
              />

              {errors.title && (
                <p className="text-error">
                  {errors.title.message}
                </p>
              )}

              <textarea
                {...register("description")}
                placeholder="Problem Description"
                rows={8}
                className="textarea textarea-bordered w-full"
              />

              {errors.description && (
                <p className="text-error">
                  {errors.description.message}
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-4">

                <select
                  {...register("difficulty")}
                  className="select select-bordered"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select
                  multiple
                  {...register("tags")}
                  className="select select-bordered h-40"
                >
                  <option value="array">Array</option>
                  <option value="linkedlist">
                    Linked List
                  </option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                  <option value="tree">Tree</option>
                  <option value="math">Math</option>
                  <option value="sorting">
                    Sorting
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* VISIBLE TEST CASES */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <div className="flex justify-between items-center">
                <h2 className="card-title">
                  Visible Test Cases
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    appendVisible({
                      input: "",
                      output: "",
                      explanation: "",
                    })
                  }
                >
                  Add
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <input
                    {...register(
                      `visibleTestCases.${index}.input`
                    )}
                    placeholder="Input"
                    className="input input-bordered w-full"
                  />

                  <input
                    {...register(
                      `visibleTestCases.${index}.output`
                    )}
                    placeholder="Output"
                    className="input input-bordered w-full"
                  />

                  <textarea
                    {...register(
                      `visibleTestCases.${index}.explanation`
                    )}
                    placeholder="Explanation"
                    className="textarea textarea-bordered w-full"
                  />

                  <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() =>
                      removeVisible(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* HIDDEN TEST CASES */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <div className="flex justify-between items-center">
                <h2 className="card-title">
                  Hidden Test Cases
                </h2>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    appendHidden({
                      input: "",
                      output: "",
                    })
                  }
                >
                  Add
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <input
                    {...register(
                      `hiddenTestCases.${index}.input`
                    )}
                    placeholder="Input"
                    className="input input-bordered w-full"
                  />

                  <input
                    {...register(
                      `hiddenTestCases.${index}.output`
                    )}
                    placeholder="Output"
                    className="input input-bordered w-full"
                  />

                  <button
                    type="button"
                    className="btn btn-error btn-xs"
                    onClick={() =>
                      removeHidden(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CODE TEMPLATES */}

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">

              <h2 className="card-title">
                Code Templates & Solutions
              </h2>

              {["c++", "java", "javascript"].map(
                (lang, index) => (
                  <div
                    key={lang}
                    className="mt-6 space-y-3"
                  >
                    <h3 className="font-bold text-lg">
                      {lang.toUpperCase()}
                    </h3>

                    <textarea
                      {...register(
                        `startCode.${index}.initialCode`
                      )}
                      rows={6}
                      placeholder="Starter Code"
                      className="textarea textarea-bordered w-full font-mono"
                    />

                    <textarea
                      {...register(
                        `referenceSolution.${index}.completeCode`
                      )}
                      rows={8}
                      placeholder="Reference Solution"
                      className="textarea textarea-bordered w-full font-mono"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Create Problem
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminPanel;