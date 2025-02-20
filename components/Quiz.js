"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Timer from "./Timer";
import Scoreboard from "./Scoreboard";
import AttemptHistory from "./AttemptHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
const questions = [
  {
    id: 1,
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctAnswer: "B",
    type: "multiple-choice",
  },
  {
    id: 2,
    question:
      "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctAnswer: "B",
    type: "multiple-choice",
  },
  {
    id: 3,
    question:
      "Which of the following is primarily used for structuring web pages?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: "C",
    type: "multiple-choice",
  },
  {
    id: 4,
    question: "Which chemical symbol stands for Gold?",
    options: ["Au", "Gd", "Ag", "Pt"],
    correctAnswer: "A",
    type: "multiple-choice",
  },
  {
    id: 5,
    question:
      "Which of these processes is not typically involved in refining petroleum?",
    options: [
      "Fractional distillation",
      "Cracking",
      "Polymerization",
      "Fermentation",
    ],
    correctAnswer: "D",
    type: "multiple-choice",
  },
  {
    id: 6,
    question: "What is the value of 12 + 28?",
    correctAnswer: "40",
    type: "integer",
  },
  {
    id: 7,
    question: "How many states are there in the United States?",
    correctAnswer: "50",
    type: "integer",
  },
  {
    id: 8,
    question: "In which year was the Declaration of Independence signed?",
    correctAnswer: "1776",
    type: "integer",
  },
  {
    id: 9,
    question: "What is the value of pi rounded to the nearest integer?",
    correctAnswer: "3",
    type: "integer",
  },
  {
    id: 10,
    question:
      "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    correctAnswer: "120",
    type: "integer",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(questions.length).fill("")
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30); //
  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(["attempts"], "readonly");
      const objectStore = transaction.objectStore("attempts");
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        setAttempts(event.target.result);
      };
    } catch (error) {
      console.error("Error loading attempts:", error);
    }
  };

  const saveAttempt = async (score) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(["attempts"], "readwrite");
      const objectStore = transaction.objectStore("attempts");
      objectStore.add({ score, date: new Date().toISOString() });
      loadAttempts();
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30); // Reset timer when moving to next question
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const newScore = questions.reduce(
      (acc, q, i) => (userAnswers[i] === q.correctAnswer ? acc + 1 : acc),
      0
    );
    setScore(newScore);
    setQuizCompleted(true);
    saveAttempt(newScore);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(questions.length).fill(""));
    setQuizCompleted(false);
    setScore(0);
  };

  if (quizCompleted) {
    return (
      <div>
        <Scoreboard
          score={score}
          totalQuestions={questions.length}
          resetQuiz={resetQuiz}
        />

        <AttemptHistory attempts={attempts} />
      </div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-xl bg-gray-100 rounded-2xl border-2 border-purple-500">
      <CardContent className="space-y-6">
        <Timer
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          onTimeUp={handleNext}
        />

        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="w-full"
        />

        <p className="text-gray-600 font-medium">
          Question {currentQuestion + 1} / {questions.length}
        </p>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {questions[currentQuestion].question}
        </h2>

        {questions[currentQuestion].type === "multiple-choice" ? (
          <RadioGroup
            value={userAnswers[currentQuestion]}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {questions[currentQuestion].options.map((option, index) => {
              const optionValue = String.fromCharCode(65 + index);
              const isSelected = userAnswers[currentQuestion] === optionValue;
              const isCorrect =
                optionValue === questions[currentQuestion].correctAnswer;

              return (
                <label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={`flex items-center space-x-3 p-3 border rounded-lg transition cursor-pointer ${
                    isSelected
                      ? isCorrect
                        ? "bg-green-400 border-green-500"
                        : "bg-red-400 border-red-500"
                      : "hover:bg-gray-100"
                  } ${
                    userAnswers[currentQuestion]
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value={optionValue}
                    id={`option-${index}`}
                    disabled={!!userAnswers[currentQuestion]}
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              );
            })}
          </RadioGroup>
        ) : (
          <Input
            type="number"
            value={userAnswers[currentQuestion]}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="p-3 border rounded-lg w-full"
          />
        )}

        <Button
          onClick={handleNext}
          className="w-full py-3 text-lg font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
        </Button>
      </CardContent>
    </Card>
  );
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("QuizDatabase", 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("attempts", { autoIncrement: true });
  });
}
