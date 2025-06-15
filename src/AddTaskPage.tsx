import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import { getAuth } from 'firebase/auth';






function AddTaskPage( ) {
  
  
  
  
  type TaskRepeater = 0|1|2|3|4|5|6;
  
  const navigate = useNavigate();
  let [taskName, setTaskName] = useState('');
  let [taskDetails, setTaskDetails] = useState('');
  let [taskDiffeculty, setTaskDiffeculty] = useState<'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme'>('Simple');
  //let [taskRepeat, setTaskRepeat] = useState<TaskRepeater[]>([]);


  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [isChecked5, setIsChecked5] = useState(false);
  const [isChecked6, setIsChecked6] = useState(false);
  const [isChecked7, setIsChecked7] = useState(false);
  const [isCheckedEveryDay, setIsCheckedEveryDay] = useState(false)



  //Difficulties:

  let [simple, setSimple] = useState(true); 
  let [easy, setEasy] = useState(false); 
  let [medium, setMedium] = useState(false); 
  let [hard, setHard] = useState(false); 
  let [extreme, setExtreme] = useState(false); 
  
  const handleDiffSwitch = (d:React.Dispatch<React.SetStateAction<boolean>>) =>{
    setSimple(false);
    setEasy(false);
    setMedium(false);
    setHard(false);
    setExtreme(false);
    d(true);
  }
  const allDays = false

  useEffect(() => {
  const allDaysChecked = [
    isChecked, isChecked2, isChecked3,
    isChecked4, isChecked5, isChecked6,
    isChecked7
  ].every(Boolean);

  setIsCheckedEveryDay(allDaysChecked);
}, [
  isChecked, isChecked2, isChecked3,
  isChecked4, isChecked5, isChecked6,
  isChecked7
]);
    const handleCheck = (mainSetIsChecked:any) => {
        mainSetIsChecked((prev:boolean) => !prev);
    };
    const setEveryDay = ()=>{
      if(isCheckedEveryDay === false){
        setIsChecked(true);
        setIsChecked2(true);
        setIsChecked3(true);
        setIsChecked4(true);
        setIsChecked5(true);
        setIsChecked6(true);
        setIsChecked7(true);
        setIsCheckedEveryDay(true);
      }
      else if(isCheckedEveryDay === true){
         setIsChecked(false);
        setIsChecked2(false);
        setIsChecked3(false);
        setIsChecked4(false);
        setIsChecked5(false);
        setIsChecked6(false);
        setIsChecked7(false);
        setIsCheckedEveryDay(false);
      }
    }
    /*const removeDay = (day: number) => {
      setTaskRepeat((prev) => prev.filter((item) => item !== day));
    }*/
    

   const auth = getAuth();


   
  const addTask = async (name: string| number , details: string|number, Diffeculty : 'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme' ,  repeatDays:TaskRepeater[]) => {
    try {
       const player = auth.currentUser;
      if(!player) return;
      await addDoc(collection( db,'Players', player.uid, 'tasks'), {
        name,
        details,
        Diffeculty,
        repeatDays,
        createdAt: new Date()
      });
      console.log('Task added!');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


function Submit() {
  const updatedDays: TaskRepeater[] = [];
 



  if (isChecked) updatedDays.push(0);
  if (isChecked2) updatedDays.push(1);
  if (isChecked3) updatedDays.push(2);
  if (isChecked4) updatedDays.push(3);
  if (isChecked5) updatedDays.push(4);
  if (isChecked6) updatedDays.push(5);
  if (isChecked7) updatedDays.push(6);

  

  addTask(taskName, taskDetails, taskDiffeculty, updatedDays);
  console.log(updatedDays);
  navigate('/');
}

  
      
  
// This code below is so messed up, but as they say, if it works, don't touch it.
    return (
      <div>
        <div className="topPart">
          
              <div className="btmbtns">
                <h3>Add a new task</h3>
                 <h4 className='actionButtons' onClick={()=> navigate('/')}> Back</h4>
                 <h4 className='actionButtons' onClick={Submit}>Add</h4>
              </div>
           
           <div className="outerinputcon">
            <div className="innerinputcon">
  <textarea className='taskNameInput' value={taskName}  onChange={(e) => setTaskName(e.target.value)}  placeholder='Task Name'/>

        <textarea className='taskDetailsInput' value={taskDetails}  onChange={(e) => setTaskDetails(e.target.value)} placeholder='Task Details'/>
        
            </div>
           </div>
      
        
        </div>
       
        <div id="outerWeekDaysDiv">
  
          <h2 className='r'>Repeat:</h2>
          <h4 className={isCheckedEveryDay || allDays ? "allWeekDaysClicked" : "allWeekDays"} onClick={()=> {handleCheck(setIsCheckedEveryDay); setEveryDay(); }}>{isCheckedEveryDay? 'None' : 'Everyday'}</h4>
        <div id="weekDaysDiv">
        <h4 className={isChecked? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked)}}>Sun</h4>
        <h4 className={isChecked2? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked2)}}>Mon</h4>
        <h4 className={isChecked3? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked3)}}>Tue</h4>
        <h4 className={isChecked4? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked4)}}>Wed</h4>
        <h4 className={isChecked5? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked5)}}>Thu</h4>
        <h4 className={isChecked6? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked6)}}>Fri</h4>
        <h4 className={isChecked7? "weekDaysClicked" : "weekDays"} onClick={()=> {handleCheck(setIsChecked7)}}>Sat</h4>
        </div>
        </div>
          <h2 className='r'>Diffeculty:</h2>
          <div className="diffContainer">
            <div className={simple ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setSimple); setTaskDiffeculty('Simple')}}>Simple</div>
          <div className={easy ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setEasy); setTaskDiffeculty('Easy')}}>Easy</div>
          <div className={medium ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setMedium); setTaskDiffeculty('Medium')}}>Medium</div>
          <div className={hard ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setHard); setTaskDiffeculty('Hard')}}>Hard</div>
          <div className={extreme ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setExtreme); setTaskDiffeculty('Extreme')}}>Extreme</div>
          </div>
          
       
      </div>
    );
  }
  
  export default AddTaskPage;
  