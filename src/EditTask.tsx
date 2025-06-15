import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from "firebase/auth"; 




function EditTask() {

     const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);
    const [isChecked4, setIsChecked4] = useState(false);
    const [isChecked5, setIsChecked5] = useState(false);
    const [isChecked6, setIsChecked6] = useState(false);
    const [isChecked7, setIsChecked7] = useState(false);

    const handleCheck = (mainSetIsChecked:any) => {
        mainSetIsChecked((prev:boolean) => !prev);
    };

   
const navigate = useNavigate();
   const {id} = useParams();
   let [name, setName] = useState("");
   let [details, setDetails] = useState("");
   let [Diffeculty, setDiffeculty] = useState("");

     let [simple, setSimple] = useState(Diffeculty === 'Simple'?true: false); 
  let [easy, setEasy] = useState(Diffeculty === 'Easy'?true: false); 
  let [medium, setMedium] = useState(Diffeculty === 'Medium'?true: false); 
  let [hard, setHard] = useState(Diffeculty === 'Hard'?true: false); 
  let [extreme, setExtreme] = useState(Diffeculty === 'Extreme'?true: false); 
  
  let [loading, setLoading] = useState(true);
  const handleDiffSwitch = (d:React.Dispatch<React.SetStateAction<boolean>>) =>{
    setSimple(false);
    setEasy(false);
    setMedium(false);
    setHard(false);
    setExtreme(false);
    d(true);
  }
  
 

    const auth = getAuth();
useEffect(() => {

   
   

   const fetchTaskByID = async (taskId : string) => {
 const player = auth.currentUser;
      if(!player) return;
  const docRef = doc( db,'Players', player.uid, 'tasks', taskId);




  const docSnap = await getDoc(docRef);
  if(docSnap.exists())
  {
    const data = docSnap.data();
    setName(data.name);
    setDetails(data.details);
    setDiffeculty(data.Diffeculty);
   
  switch (data.Diffeculty) {
  case 'Simple':
    setSimple(true);
    break;
  case 'Easy':
    setEasy(true);
    break;
  case 'Medium':
    setMedium(true);
    break;
  case 'Hard':
    setHard(true);
    break;
  case 'Extreme':
    setExtreme(true);
    break;
  default:
    break;
}


    if(data.repeatDays.includes(0)){
      setIsChecked(true);
    }  if(data.repeatDays.includes(1)){
      setIsChecked2(true);
    }  if(data.repeatDays.includes(2)){
      setIsChecked3(true);
    }  if(data.repeatDays.includes(3)){
      setIsChecked4(true);
    }  if(data.repeatDays.includes(4)){
      setIsChecked5(true);
    }  if(data.repeatDays.includes(5)){
      setIsChecked6(true);
    }  if(data.repeatDays.includes(6)){
      setIsChecked7(true);
    }  

    
    

  }else{
    console.log("No Such Task");
  }
  setLoading(false);
   }

  fetchTaskByID(id as string);


  
  
}, []);

const player = auth.currentUser;

const UpdateData = async (taskId: string) => {
      if(!player) return;
  const docRef = doc( db,'Players', player.uid, 'tasks', taskId);

   const newRepeatDays: number[] = [];
  if (isChecked) newRepeatDays.push(0);
  if (isChecked2) newRepeatDays.push(1);
  if (isChecked3) newRepeatDays.push(2);
  if (isChecked4) newRepeatDays.push(3);
  if (isChecked5) newRepeatDays.push(4);
  if (isChecked6) newRepeatDays.push(5);
  if (isChecked7) newRepeatDays.push(6);


 

  try{
    await updateDoc(docRef, {
      name: name,
      details: details,
      Diffeculty: Diffeculty,
      repeatDays: newRepeatDays,
      
    }
    );
    console.log("Updated");
  }
  
  catch(error){
console.error("Error updating document: ", error);
  }
}

const DeleteData = async (taskId: string) => {
  if(!player) return;
const docRef = doc(db,'Players', player.uid, 'tasks', taskId);
try{
  await deleteDoc(docRef);
  console.log("Deleted");
}
catch(error){
  console.error("Error deleting document: ", error);
}
}









  return (loading? <h1 className='loading'>LOADING..</h1>:
    <div>
      
   

      <div className="topPart">
          
              <div className="btmbtns">
      <h2>Edit:</h2>
      <h4 className='actionButtons' onClick={()=> navigate('/')}> Back</h4>
                <h4 className='actionButtons' onClick={() =>{
                  UpdateData(id as string);
                  navigate('/');  }}>Update</h4>
                  
               </div>
       <div className="outerinputcon">
            <div className="innerinputcon">
  <textarea className='taskNameInput' value={name}  onChange={(e) => setName(e.target.value)}  placeholder='Task Name'/>

        <textarea className='taskDetailsInput' value={details}  onChange={(e) => setDetails(e.target.value)} placeholder='Task Details'/>
        
            </div>
           </div>
       
        
        
        </div>

      <div className="bottomPart">

          <div id="outerWeekDaysDiv">
  
          <h2 className='r'>Repeat:</h2>
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
            <div className={simple ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setSimple); setDiffeculty('Simple')}}>Simple</div>
          <div className={easy ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setEasy); setDiffeculty('Easy')}}>Easy</div>
          <div className={medium ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setMedium); setDiffeculty('Medium')}}>Medium</div>
          <div className={hard ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setHard); setDiffeculty('Hard')}}>Hard</div>
          <div className={extreme ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setExtreme); setDiffeculty('Extreme')}}>Extreme</div>
          </div>
          <div className="outerDelete">
          <button className="red" onClick={() =>{
        DeleteData(id as string);
        navigate('/');
      }}>Delete</button>  
      </div>    
      </div>
       
     
    </div>
  );
}

export default EditTask;
