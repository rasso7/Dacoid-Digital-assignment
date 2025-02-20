import { Button } from "@/components/ui/button";

export default function Scoreboard({ score, totalQuestions, resetQuiz }) {
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
        🎉 Quiz Completed!
      </h2>

      <p className="text-2xl font-semibold text-gray-700">
        Your Score: <span className="text-blue-600">{score}</span> /{" "}
        {totalQuestions}
      </p>

      <p
        className={`text-lg font-medium mt-3 p-2 rounded-lg ${
          percentage >= 75
            ? "bg-green-100 text-green-700"
            : percentage >= 50
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        Percentage: {percentage}%
      </p>

      <div className="mt-6">
        {percentage >= 75 ? (
          <p className="text-green-600 font-medium text-lg">
            🔥 Excellent! You did great!
          </p>
        ) : percentage >= 50 ? (
          <p className="text-yellow-600 font-medium text-lg">
            👍 Good job! Keep practicing!
          </p>
        ) : (
          <p className="text-red-600 font-medium text-lg">
            💪 Don’t give up! Try again!
          </p>
        )}
      </div>

      <Button
        onClick={resetQuiz}
        className="mt-6 bg-purple-600 hover:bg-purple-400"
      >
        Try Again
      </Button>
    </div>
  );
}
