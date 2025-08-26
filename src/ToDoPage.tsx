import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; 
import { getAuth } from "firebase/auth";
import ToDoList from "./ToDoList";

type ToDoType = {
  id: string;
  name: string | number;
  details: string | number;
  Diffeculty: "Simple" | "Easy" | "Medium" | "Hard" | "Extreme";
  randomDrop: number;
  gotRewards: boolean;
  isDone: boolean;
};

const ToDoPage: React.FC = () => {
  const [todos, setTodos] = useState<ToDoType[]>([]);

  const auth = getAuth();

  useEffect(() => {
    const fetchToDos = async () => {
    const player = auth.currentUser;
    if (!player) return;

    const todoRef = collection(db, 'Players', player.uid, 'todos');
    const snapshot = await getDocs(todoRef);

    const todoList: ToDoType[] = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      details: doc.data().details,
      Diffeculty: doc.data().Diffeculty,
      isDone: doc.data().isDone,
      randomDrop: doc.data().randomDrop,
      gotRewards: doc.data().gotRewards,
    }));
    setTodos(todoList);
  };

    fetchToDos();
  }, []);


  return (
    <div>
      {todos.length === 0 ? (
        <h2>No todos yet. Add some!</h2>
      ) : (
        <ToDoList todos={todos} />
      )}
    </div>
  );
};

export default ToDoPage;
