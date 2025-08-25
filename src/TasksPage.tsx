import React from 'react';
import TaskList from './TaskList';

type TaskType = {
  id: string;
  name: string | number;
  details: string | number;
  Diffeculty: 'Simple' | 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  randomDrop: number;
  repeatDays: (0|1|2|3|4|5|6)[];
  gotRewards: boolean;
  isDone: boolean;
};

interface TasksPageProps {
  tasks: TaskType[];
  filteredTasks: TaskType[];
  finalTasks: TaskType[];
  showAll: boolean;
  darkMode: boolean;
  isTodayTask: (task: TaskType) => boolean;
}

const TasksPage: React.FC<TasksPageProps> = ({
  finalTasks,
  darkMode,
  isTodayTask
}) => {
  return (
    <>
      {finalTasks.length === 0 ? (
        <h2>No tasks yet. Add some!</h2>
      ) : (
        <TaskList tasks={finalTasks} darkMode={darkMode} isTodayTask={isTodayTask} />
      )}
    </>
  );
};

export default TasksPage;
