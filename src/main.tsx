// main.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Firebase
import { collection, getDocs, setDoc, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';

// Utils & CSS
import './myTheme.css';

// Components
//import TaskList from './TaskList';
import ToDoPage from './ToDoPage';
import Habits from './HabitsPage';
import Account from './AccountPage';
import AddTask from './AddTask';
import AddTaskPage from './AddTaskPage';
import TasksPage from './TasksPage';
import LogIn from './LogIn';
import EditTask from './EditTask';
import XPBar from './XPBar';
import AddToDoPage from './AddToDoPage';
import TaskSearchBar from './TaskSearchBar';
import EditToDo from './EditToDo';

// Icons

const Home = () => {

  // Types
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

  const auth = getAuth();

  // States
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [shownData, setShownData] = useState<'Tasks' | 'Todo' | 'Habits' | 'Account'>('Tasks');

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [finalTasks, setFinalTasks] = useState<TaskType[]>([]);

  const [currentXP, setCurrentXP] = useState<number>();
  const [currentMaxXP, setCurrentMaxXP] = useState<number>();
  const [Level, setLevel] = useState<number>();
  const [darkMode, setDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  const [search, setSearch] = useState<boolean>(false);
  const [searchedContent, setSearchedContent] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);


  
  // --- Firebase Functions ---
  const fetchTasks = async () => {
    const player = auth.currentUser;
    if (!player) return;

    const taskRef = collection(db, 'Players', player.uid, 'tasks');
    const snapshot = await getDocs(taskRef);

    const taskList: TaskType[] = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      details: doc.data().details,
      Diffeculty: doc.data().Diffeculty,
      repeatDays: doc.data().repeatDays,
      isDone: doc.data().isDone,
      randomDrop: doc.data().randomDrop,
      gotRewards: doc.data().gotRewards,
    }));

    setTasks(taskList);
    setIsFetching(false);
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (user) {
      const prefRef = doc(db, 'Players', user.uid, 'data', 'playerPref');
      await setDoc(prefRef, { Darkmode: newMode });
    }
  };

  const baseXPData = async (id: string) => {
    const playerDocRef = doc(db, 'Players', id, 'data', 'playerData');
    const playerPrefRef = doc(db, 'Players', id, 'data', 'playerPref');

    const playerDocSnap = await getDoc(playerDocRef);
    const playerPrefSnap = await getDoc(playerPrefRef);

    const pref = playerPrefSnap?.data();
    if (pref && typeof pref.Darkmode === 'boolean') setDarkMode(pref.Darkmode);

    if (!playerDocSnap.exists()) {
      await setDoc(playerDocRef, {
        level: 1,
        xp: 0,
        maxXp: 150,
        GivenReward: 0,
        Username: user?.displayName,
      });

      setLevel(1);
      setCurrentXP(0);
      setCurrentMaxXP(150);
    } else {
      const data = playerDocSnap.data();
      setLevel(data.level);
      setCurrentXP(data.xp);
      setCurrentMaxXP(data.maxXp);
    }
  };

  const checkIfSignedIn = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await baseXPData(currentUser.uid);
        fetchTasks();
      }
      setIsLoading(false);
      setIsThemeLoaded(true);
    });
  };

  const isTodayTask = (task: TaskType) => {
    const todayIndex = new Date().getDay();
    return Array.isArray(task.repeatDays) && task.repeatDays.includes(todayIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6);
  };

  const handleCheck = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
  };

  const deleteCollection = async (collectionPath: string) => {
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    const promises = snapshot.docs.map(docSnap => deleteDoc(doc(db, collectionPath, docSnap.id)));
    await Promise.all(promises);
  };

  const resetAccount = async () => {
    if (!user) return;

    const playerDocRef = doc(db, 'Players', user.uid, 'data', 'playerData');
    const playerTasksRef = collection(db, 'Players', user.uid, 'tasks');

    const playerDocSnap = await getDoc(playerDocRef);
    const playerTaskSnap = await getDocs(playerTasksRef);

    if (playerDocSnap.exists()) await deleteCollection(`Players/${user.uid}/data`);
    if (!playerTaskSnap.empty) await deleteCollection(`Players/${user.uid}/tasks`);
  };

  // --- useEffect Hooks ---
  useEffect(() => {
    if (!search) {
      const todayIndex = new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;;
      if (user) baseXPData(user.uid);
      checkIfSignedIn();

      const todayTasks = tasks.filter(task => Array.isArray(task.repeatDays) && task.repeatDays.includes(todayIndex));
      setFilteredTasks(todayTasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (!search) setFinalTasks(showAll ? tasks : filteredTasks);
  }, [showAll, filteredTasks, tasks, search]);

  useEffect(() => {
    document.body.className = darkMode ? 'Dark' : 'Light';
  }, [darkMode]);

  useEffect(() => {
    if (search && inputRef.current) inputRef.current.focus();
  }, [search]);

  useEffect(() => {
    if (search) {
      const source = showAll ? tasks : filteredTasks;
      const filteredSearch = source.filter(task =>
        task.name.toString().toLowerCase().includes(searchedContent.toLowerCase()) ||
        task.details.toString().toLowerCase().includes(searchedContent.toLowerCase())
      );
      setFinalTasks(filteredSearch);
    } else {
      setFinalTasks(showAll ? tasks : filteredTasks);
    }
  }, [searchedContent, search, showAll, tasks, filteredTasks]);

  // --- Conditional Rendering ---
  if (!window.navigator.onLine) {
    return (
      <div>
        <h1>Offline</h1>
        <h2>Check your internet connection</h2>
      </div>
    );
  } else if (!isThemeLoaded || isLoading || isFetching) {
    return (
      <div className='loadingScene'>
        <h1 className='loading'>LOADING...</h1>
      </div>
    );
  } else if (!user) {
    return <LogIn />;
  }
 // --- Main UI ---
return (
  <>
   <TaskSearchBar
  search={search}
  setSearch={setSearch}
  searchedContent={searchedContent}
  setSearchedContent={setSearchedContent}
  showAll={showAll}
  setShowAll={setShowAll}
  handleCheck={handleCheck}
/>


    <br /><br />

    <div className={darkMode ? 'lvldivd' : 'lvldiv'}>
      <h3>Lvl</h3>
      <h3 className='levelnum'>{Level}</h3>
    </div>
    <XPBar maxXp={currentMaxXP as number} xp={currentXP as number} darkMode={darkMode} />

    <div>
      {shownData === 'Tasks' ? (
   <TasksPage
    tasks={tasks}
    filteredTasks={filteredTasks}
    finalTasks={finalTasks}
    showAll={showAll}
    darkMode={darkMode}
    isTodayTask={isTodayTask}
    />
) : shownData === 'Todo' ? (
  <div className="TodoCon" ><ToDoPage darkmode={darkMode}  /></div>
) : shownData === 'Habits' ? (
        <div className="HabitsCon"><Habits /></div>
      ) : shownData === 'Account' ? (
        <div className='AccountCon'>
          <Account />
          <button className='dmbtn' onClick={toggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <button className='logOut' onClick={resetAccount}>Reset</button>
        </div>
      ) : <h1>195Error</h1>}
    </div>

   <div className="bottomLine">
    <button onClick={() => setShownData('Tasks')}>Tasks</button>
    <button onClick={() => setShownData('Todo')}>To-Do</button>
    <AddTask />
    <button onClick={() => setShownData('Habits')}>Habits</button>
    <button onClick={() => setShownData('Account')}>Account</button>
  </div>
    <br /><br /><br /><br /><br />
  </>
);

};

// --- Render App ---
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ToDos" element={<ToDoPage darkmode={false} />} />
      <Route path="/Habits" element={<Habits />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/addTask" element={<AddTaskPage />} />
      <Route path="/addToDo" element={<AddToDoPage />} />
      <Route path="/EditTask/:id" element={<EditTask />} />
      <Route path="/EditToDo/:id" element={<EditToDo />} />
      <Route path="/LogIn" element={<LogIn />} />
    </Routes>
  </BrowserRouter>
);

