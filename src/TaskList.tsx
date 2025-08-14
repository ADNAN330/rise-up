// TaskList.tsx
import React from 'react';
import Task from './Task';
import DailyResetSingle from './utils/TaskCheckReset';


 type TaskRepeating = 0 | 1 | 2 | 3 | 4 | 5 | 6;
  type TaskType = {
    id: string;
    name: string | number;
    details: string | number;
    Diffeculty: 'Simple' | 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    randomDrop: number;
    repeatDays: TaskRepeating[];
    gotRewards: boolean;
    isDone: boolean;
  };
interface TaskListProps {
  tasks: TaskType[];
  darkMode: boolean;
  isTodayTask: (task: TaskType) => boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, darkMode, isTodayTask }) => {
  return (
    <>
      {tasks.map((task) => (
        <div key={task.id}>
          <DailyResetSingle taskId={task.id} />
          <Task
            darkClass={darkMode}
            inToday={isTodayTask(task) ? 'checkArea' : 'checkAreaNotToday'}
            myid={task.id}
            name={task.name}
            details={task.details}
            Diffeculty={task.Diffeculty}
            repeatDays={task.repeatDays}
            randomDrop={task.randomDrop}
            gotRewards={task.gotRewards}
            isDone={task.isDone}
          />
        </div>
      ))}
    </>
  );
};

export default TaskList;
