// TaskList.tsx
import React from 'react';
import ToDo from './ToDo';



  type ToDoType = {
    id: string;
    name: string | number;
    details: string | number;
    Diffeculty: 'Simple' | 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    randomDrop: number;
    gotRewards: boolean;
    isDone: boolean;
  };
interface ToDoListProps {
  todos: ToDoType[];
  darkMode: boolean;
}

const ToDoList: React.FC<ToDoListProps> = ({todos, darkMode}) => {
  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id}>
          
          <ToDo
          name={todo.name}
          details={todo.details}
          Diffeculty={todo.Diffeculty}
          darkmode={darkMode}
          myid={todo.id}
          />
        </div>
      ))}
    </>
  );
};

export default ToDoList;
