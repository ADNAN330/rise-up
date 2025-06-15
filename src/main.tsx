//Reacts
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

//Firebase
import {collection, getDocs, setDoc, getDoc, doc, deleteDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';

//Utils
import './myTheme.css';
import DailyResetSingle from './utils/TaskCheckReset';

//Elements
import Task from './Task';
import ToDo from './ToDo';
import Habits from './Habits';
import Account from './Account';
import AddTask from './AddTask';
import AddTaskPage from './AddTaskPage';
import LogIn from './LogIn';

import EditTask from './EditTask';
import XPBar from './XPBar';

//Icons
import searchIcon from './Icons/Search-icon.png'


const Home = () => {

   
 
  type TaskRepeating = 0|1|2|3|4|5|6;
  type TaskType = {

    id: string;
    name: string|number;
    details: string|number;
    Diffeculty : 'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    randomDrop: number;
    repeatDays: TaskRepeating[];
    gotRewards: boolean;
    isDone: boolean;
    };
  
  
  
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [shownData, setShownData] = useState<'Tasks' |'Todo' |'Habits' |'Account'>('Tasks');
  
  
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [finalTasks, setFinalTasks] = useState<TaskType[]>([]);

  const [currentXP, setCurrentXP] = useState<number>();
  const [currentMaxXP, setCurrentMaxXP] = useState<number>();
  const [Level, setLevel] = useState<number>();
  const [darkMode, setDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  const [search, setSearch] = useState<Boolean>(false)
  const [searchedContent, setSearchedContent] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchTasks = async () => {
    
    const player = auth.currentUser;
    if(!player) return;
  const taskRef = collection( db,'Players', player.uid, 'tasks');
  
  
  const Snapshot = await getDocs(taskRef);
  
  
  const taskList: TaskType[]= Snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    details: doc.data().details,
    Diffeculty: doc.data().Diffeculty,
    repeatDays: doc.data().repeatDays,
    isDone: doc.data().isDone,
    randomDrop: doc.data().randomDrop,
    gotRewards: doc.data().gotRewards,

  }))





setTasks(taskList);

setIsFetching(false);

}

const toggleDarkMode = async () => {
  const newMode = !darkMode;
  setDarkMode(newMode);

  if (user) {
    const prefRef = doc(db, "Players", user.uid, "data", "playerPref");
    await setDoc(prefRef, { Darkmode: newMode });
  }
};

const baseXPData = async (id: string) => {
  const playerDocRef = doc(db, "Players", id, "data", "playerData");
  const playerPrefRef = doc(db, "Players", id, "data", "playerPref");

  const playerDocSnap = await getDoc(playerDocRef);
  const playerPrefSnap = await getDoc(playerPrefRef);

  const pref = playerPrefSnap?.data();
  if (pref && typeof pref.Darkmode === 'boolean') {
   
    setDarkMode(pref.Darkmode);
    
  }

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


 const [user, setUser] = useState<User|null>(null);

    const checkIfSignedIn = () => {
      
      onAuthStateChanged(auth, async (currentUser)=> {
        
        setUser(currentUser);
        if(currentUser){
         await baseXPData(currentUser.uid);
          fetchTasks();
        }
          setIsLoading(false);
          setIsThemeLoaded(true);
         
    
    })
  
  }


useEffect(() => {
  if(!search){
  const todayIndex : any = new Date().getDay();
 if (user) baseXPData(user.uid);

  checkIfSignedIn();
  const todayTasks = tasks.filter(task => Array.isArray(task.repeatDays) && task.repeatDays.includes(todayIndex));
  setFilteredTasks(todayTasks);
  }
}, [tasks]);
useEffect(() =>{

  if(!search)
 setFinalTasks(showAll? tasks : filteredTasks);

},[showAll, finalTasks, tasks, searchedContent])

useEffect(() => {
  document.body.className = darkMode ? 'Dark' : 'Light';
}, [darkMode]);

useEffect(() => {
  if(search && inputRef.current){
    inputRef.current.focus();
  }
},[search])

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



const isTodayTask = (task: TaskType) => {
  const todayIndex = new Date().getDay()
  return Array.isArray(task.repeatDays) && task.repeatDays.includes(todayIndex as 0|1|2|3|4|5|6);
};


  const handleCheck = (mainSetIsChecked: React.Dispatch<React.SetStateAction<boolean>>) => {
        mainSetIsChecked((prev:boolean) => !prev);
    };


const deleteCollection = async (collectionPath: string) => {
  const colRef = collection(db, collectionPath);
  const snapshot = await getDocs(colRef);

  const promises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, collectionPath, docSnap.id)));
  await Promise.all(promises);
};
    const resetAccount = async() =>{

      if(!user) return;
 const playerDocRef = doc(db, "Players", user.uid, "data", "playerData"); 
 
 const playerTasksRef = collection(db, "Players", user.uid, "tasks");

  const playerDocSnap = await getDoc(playerDocRef); 

  const playerTaskSnap = await getDocs(playerTasksRef);

  if (playerDocSnap.exists()) 
    await deleteCollection(`Players/${user.uid}/data`);
  

  if(!playerTaskSnap.empty){
    await deleteCollection(`Players/${user.uid}/tasks`);
  }
  
}



    if(!window.navigator.onLine) //Offline State
      {
      return(
        <div>
          <h1>Offline</h1>
          <h2>Check your internet connection</h2>
        </div>
      )

    }else if(isThemeLoaded === false) //Loading state
      {

  return(<div className='loadingScene'>
  <h1 className='loading'>LOADING....</h1>
  
  </div>)
 }else if(isLoading === true) //Loading state
      {

 return(<div className='loadingScene'>
  <h1 className='loading'>LOADING...</h1>
  
  </div>)
 }
else if(user === null)//Sign in page
{
  return(
 <LogIn/>
  )
}
else if(isFetching === true)//Loading data
  {

   return(<div className='loadingScene'>
  <h1 className='loading'>LOADING..</h1>
  
  </div>)
 }
else if(tasks.length === 0)// In case of no tasks At all
  {
  return ( 
    <>
    <div>
       <div>
     {!search? (<div className="buttonContainer"><button className='buttons' onClick={() =>alert('Beta, For any bugs : adnanhamdo2005@gmail.com')}>Info</button>
      
       <button className='buttons' onClick={() =>handleCheck(setShowAll)}>{showAll ? 'Show For Today' : 'Show All'}</button>
       <img className='buttons' src={searchIcon} alt="search" onClick={() => setSearch(true)}/></div>):
       (
        <div className="buttonContainer">
          <button className='buttons' onClick={() => {
                    setSearch(false);
                    setSearchedContent('');
                  }}>Back</button>
          <input type="text" placeholder='Search Here...'/>
        </div>
       ) }
    </div>

      <h1> You have no tasks</h1>
      <h2> Have a rest or add another tasks, it's up to you</h2>
       <div className={darkMode? 'lvldivd':'lvldiv'}> <h3>Lvl</h3><h3 className='levelnum'>{Level}</h3></div>
      
       <XPBar maxXp={currentMaxXP as number} xp={currentXP as number} darkMode={darkMode}/>

    </div>
           <div className="bottomLine">
            <button onClick={()=> setShownData('Tasks')}>Tasks</button>
          <button onClick={()=> setShownData('Todo')}>To-Do</button>
          <AddTask />
          <button onClick={()=> setShownData('Habits')}>Habits</button>
          <button onClick={()=> setShownData('Account')}>Account</button>
 <button className='dmbtn' onClick={toggleDarkMode}>{darkMode? 'Light':'Dark'}</button>
        </div>

     </>
  );
}
else return ( //The main state, shows all tasks or only today's tasks
  <>
 
    <div>
     {!search? (<div className="buttonContainer">
      
       <img className='buttons' src={searchIcon} alt="search" onClick={() => setSearch(true)}/>
       <button className='buttons' onClick={() =>handleCheck(setShowAll)}>{showAll ? 'Show For Today' : 'Show All'}</button>
       
       <button className='buttons' onClick={() =>alert('Beta, For any bugs : adnanhamdo2005@gmail.com')}>Info</button>
       </div>):
       (
         <div className="buttonContainer">
           <button className='buttons' onClick={() => {
             setSearch(false);
             setSearchedContent('');
            }}>Back</button>
          <input value={searchedContent} onChange={(e) => setSearchedContent(e.target.value)} ref={inputRef} type="text" placeholder='Search Here...'/>
        </div>
       ) }
    </div>

    <br />
    <br />
   
   
    <div className={darkMode? 'lvldivd':'lvldiv'}> <h3>Lvl</h3><h3 className='levelnum'>{Level}</h3></div>
     <XPBar maxXp={currentMaxXP as number} xp={currentXP as number} darkMode={darkMode}/>
    <div>
      
      {shownData === 'Tasks'?
      
      
       ( finalTasks.map((task) => ( //All tasks
    <div key={String(task.id)}>
    <DailyResetSingle taskId={String(task.id)} />
    <Task 
    darkClass={darkMode}
    inToday={isTodayTask(task) ? 'checkArea' : 'checkAreaNotToday'}
    myid={task.id} 
    key={task.id} 
    name={task.name}
    details={task.details} 
      Diffeculty={task.Diffeculty}  
      repeatDays={task.repeatDays}
      randomDrop={task.randomDrop}
      gotRewards={task.gotRewards}
      isDone={task.isDone}
      />
      
    </div>
  ))
)
      :
      (
           shownData === 'Todo'? <div className="TodoCon"><ToDo/></div>
         : shownData === 'Habits'? <div className="HabitsCon"><Habits/> </div>
         : shownData === 'Account' ?<div className='AccountCon'><Account/>
       <button className='dmbtn' onClick={toggleDarkMode}>{darkMode? 'Light':'Dark'}</button>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <button className='logOut' onClick={() => {resetAccount()}}> reset</button></div>
      : <h1>195Error</h1> 
       ) }

          <div className="bottomLine">
            <button onClick={()=> setShownData('Tasks')}>Tasks</button>
          <button onClick={()=> setShownData('Todo')}>To-Do</button>
          <AddTask />
          <button onClick={()=> setShownData('Habits')}>Habits</button>
          <button onClick={()=> setShownData('Account')}>Acocunt</button>
        </div>
        <br /><br /><br />
        <br /><br /><br />
        <br /><br /><br />
     

     
    </div>
  </>
);
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ToDo" element={<ToDo />} />
      <Route path="/Habits" element={<Habits />} />
      <Route path="/Account" element={<Account />} />
      <Route path="/addTask" element={<AddTaskPage />} />
      <Route path="/EditTask/:id" element={<EditTask />} />
      <Route path="/LogIn" element={<LogIn />} />

     
    </Routes>
  </BrowserRouter>
);








/*

















 {shownData === 'Tasks'?
      showAll ?<div>
  {finalTasks.map((task) => ( //All tasks
    <div key={String(task.id)}>
    <DailyResetSingle taskId={String(task.id)} />
    <Task 
    darkClass={darkMode? 'TaskBoxD':'TaskBox'}
    myid={task.id} 
    key={task.id} 
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

</div> : filteredTasks.length > 0 ? ( //Today's tasks
        filteredTasks.map((task) => (
      <div key={String(task.id)}>
      <DailyResetSingle taskId={String(task.id)} />
       <Task 
      darkClass={darkMode? 'TaskBoxD':'TaskBox'}
       myid={task.id} 
         key={task.id} 
         name={task.name}
         details={task.details} 
         Diffeculty={task.Diffeculty}  
        repeatDays={task.repeatDays}
        randomDrop={task.randomDrop}
         gotRewards={task.gotRewards}
        isDone={task.isDone}
    />
    
    </div>
    
        ))
      ) : (
        <h2>No tasks for today</h2>
      ): shownData === 'Todo'? <div className="TodoCon"><ToDo/></div> 
      : shownData === 'Habits'? <div className="HabitsCon"><Habits/> </div>
      : shownData === 'Account' ?<div className='AccountCon'><Account/>
      <button className='dmbtn' onClick={toggleDarkMode}>{darkMode? 'Light':'Dark'}</button>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <button className='buttons' onClick={() => {resetAccount()}}> reset</button></div>
      : <h1>195Error</h1> }
       
        <div className="bottomLine">
          <AddTask />
            <button onClick={()=> setShownData('Tasks')}>Tasks</button>
          <button onClick={()=> setShownData('Todo')}>To-Do</button>
          <button onClick={()=> setShownData('Habits')}>Habits</button>
          <button onClick={()=> setShownData('Account')}>Acocunt</button>
        </div>
        <br /><br /><br />
        <br /><br /><br />
        <br /><br /><br />




*/ 