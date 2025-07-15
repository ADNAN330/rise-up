import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import { getAuth } from 'firebase/auth';






function AddToDoPage() {
  
  
  
  

  
  const navigate = useNavigate();
  let [todoName, setToDoName] = useState('');
  let [todoDetails, setToDoDetails] = useState('');
  let [todoDiffeculty, setToDoDiffeculty] = useState<'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme'>('Simple');







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


  
    

  
  
  
  const auth = getAuth();
  const addToDo = async (name: string| number , details: string|number, Diffeculty : 'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme' ) => {
    try {
       const player = auth.currentUser;
      if(!player) return;
      await addDoc(collection( db,'Players', player.uid, 'todos'), {
        name,
        details,
        Diffeculty,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


function Submit() {
 
  

  addToDo(todoName, todoDetails, todoDiffeculty);
  navigate('/');
}

  
      
  
    return (
      <div>
        <div className="topPart">
          
              <div className="btmbtns">
                <h3>Add A New ToDo</h3>
                 <h4 className='actionButtons' onClick={()=> navigate('/')}> Back</h4>
                 <h4 className='actionButtons' onClick={Submit}>Add</h4>
              </div>
           
           <div className="outerinputcon">
            <div className="innerinputcon">
  <textarea className='taskNameInput' value={todoName}  onChange={(e) => setToDoName(e.target.value)}  placeholder='ToDo Name'/>

        <textarea className='taskDetailsInput' value={todoDetails}  onChange={(e) => setToDoDetails(e.target.value)} placeholder='ToDo Details'/>
        
            </div>
           </div>
      
        
        </div>
       
      

          <h2 className='r'>Diffeculty:</h2>
          <div className="diffContainer">
            <div className={simple ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setSimple); setToDoDiffeculty('Simple')}}>Simple</div>
          <div className={easy ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setEasy); setToDoDiffeculty('Easy')}}>Easy</div>
          <div className={medium ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setMedium); setToDoDiffeculty('Medium')}}>Medium</div>
          <div className={hard ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setHard); setToDoDiffeculty('Hard')}}>Hard</div>
          <div className={extreme ? 'diffPicked' : 'diffs'} onClick={()=>{handleDiffSwitch(setExtreme); setToDoDiffeculty('Extreme')}}>Extreme</div>
          </div>
          
       
      </div>
    );
  }
  
  export default AddToDoPage;
  