export default function AttemptHistory({ attempts }) {
  return (
    <div className="mt-8 ">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        📜 Attempt History
      </h3>

      {attempts.length > 0 ? (
        <ul className="space-y-3">
          {attempts.map((attempt, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              <span className="text-lg font-medium text-gray-700">
                🏆 Score:{" "}
                <span className="text-blue-600 font-semibold">
                  {attempt.score}
                </span>
              </span>
              <span className="text-sm text-gray-500">
                📅 {new Date(attempt.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          🚫 No previous attempts.
        </p>
      )}
    </div>
  );
}
