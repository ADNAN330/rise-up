import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from "firebase/auth"; 




function EditToDo() {



   
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

   
   

   const fetchTaskByID = async (todoId : string) => {
 const player = auth.currentUser;
      if(!player) return;
  const docRef = doc( db,'Players', player.uid, 'todos', todoId);




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



    

  }else{
    console.log("No Such ToDo");
  }
  setLoading(false);
   }

  fetchTaskByID(id as string);


  
  
}, []);

const player = auth.currentUser;

const UpdateData = async (todoId: string) => {
      if(!player) return;
  const docRef = doc( db,'Players', player.uid, 'todos', todoId);




 

  try{
    await updateDoc(docRef, {
      name: name,
      details: details,
      Diffeculty: Diffeculty,
    }
    );
    console.log("Updated");
  }
  
  catch(error){
console.error("Error updating document: ", error);
  }
}

const DeleteData = async (todoId: string) => {
  if(!player) return;
const docRef = doc(db,'Players', player.uid, 'todos', todoId);
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
  <textarea className='taskNameInput' value={name}  onChange={(e) => setName(e.target.value)}  placeholder='ToDo Name'/>

        <textarea className='taskDetailsInput' value={details}  onChange={(e) => setDetails(e.target.value)} placeholder='ToDo Details'/>
        
            </div>
           </div>
       
        
        
        </div>

      <div className="bottomPart">

        
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

export default EditToDo;
