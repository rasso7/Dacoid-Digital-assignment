import { useEffect } from "react";

export default function Timer({ timeLeft, setTimeLeft, onTimeUp }) {
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="flex flex-col items-center text-lg font-semibold text-center">
      <span>Time left</span>
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-600 text-white mt-2">
        {timeLeft}
      </div>
    </div>
  );
}
