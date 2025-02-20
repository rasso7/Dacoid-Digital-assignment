"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
  },
];

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [attempts, setAttempts] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB();
      const storedAttempts = await getAllAttempts(db);
      setAttempts(storedAttempts);
    };
    initDB();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResults && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
  }, [timeLeft, showResults, isAnswered]);

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("QuizDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("attempts")) {
          db.createObjectStore("attempts", { autoIncrement: true });
        }
      };
    });
  };

  const saveAttempt = async (attempt) => {
    const db = await openDB();
    const tx = db.transaction("attempts", "readwrite");
    const store = tx.objectStore("attempts");
    await store.add(attempt);
  };

  const getAllAttempts = async (db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction("attempts", "readonly");
      const store = tx.objectStore("attempts");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast({ title: "Correct!", description: "Well done!", duration: 2000 });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${quizData[currentQuestion].correctAnswer}`,
        duration: 2000,
      });
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      const attempt = {
        date: new Date().toLocaleString(),
        score,
        totalQuestions: quizData.length,
      };
      await saveAttempt(attempt);
      setAttempts([...attempts, attempt]);
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setShowResults(false);
    setTimeLeft(30);
    setIsAnswered(false);
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-center">
            Your Score: {score}/{quizData.length}
          </div>
          <Progress value={(score / quizData.length) * 100} />
          <h3 className="font-semibold">Previous Attempts:</h3>
          {attempts.map((attempt, index) => (
            <div key={index} className="p-2 bg-muted rounded-lg">
              {attempt.date}: {attempt.score}/{attempt.totalQuestions}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={restartQuiz} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1}/{quizData.length}
        </CardTitle>
        <Progress value={(currentQuestion / quizData.length) * 100} />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">
          {quizData[currentQuestion].question}
        </h2>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={handleAnswer}
          className="space-y-2"
        >
          {quizData[currentQuestion].options.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 p-4 rounded-lg border"
            >
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="w-full"
        >
          {currentQuestion === quizData.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
}
