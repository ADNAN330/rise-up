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
}

const ToDoList: React.FC<ToDoListProps> = ({todos}) => {
  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id}>
          
          <ToDo
          name={todo.name}
          details={todo.details}
          Diffeculty={todo.Diffeculty}
          />
        </div>
      ))}
    </>
  );
};

export default ToDoList;
