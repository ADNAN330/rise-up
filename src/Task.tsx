import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { doc, runTransaction, FieldPath, Timestamp, onSnapshot, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';

import XpReward from './utils/XpReward';

type TaskRepeating = 0|1|2|3|4|5|6
type Taskprops = {
    name: string| number ;

     details: string|number;

     Diffeculty : 'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme';
     

     repeatDays: TaskRepeating[];

     myid: number|string;

     randomDrop: number;

     gotRewards: boolean;

     isDone: boolean;
     
     darkClass: boolean;

     inToday: string;
}



const Task: React.FC<Taskprops> = ({name, details, Diffeculty, myid, randomDrop, gotRewards, darkClass, inToday}) => {
    const navigate = useNavigate();
    


      const [showReward, setShowReward] = useState<boolean>(false);
  const [givenReward, setGivenReward] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
   const [isChecked, setIsChecked] = useState<boolean>(false);
   const [streak, setStreak] = useState<number>()
    let outerReward:number;
  

   

 
        
     
    
    
  

    useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const taskRef = doc(db, 'Players', user.uid, 'tasks', String(myid));
  const unsubscribe = onSnapshot(taskRef, (snapshot) => {
    const data = snapshot.data();
    if (data) {
      setIsChecked(data.isDone ?? false);
      if(!loading)
      setStreak(data.Streak ?? 0);
    }
  });

  return () => unsubscribe();
}, [myid]);


    const handleCheck = async () => {
        if (loading) return;
        setLoading(true);
        
        setIsChecked((prev) => !prev);
        
        await HandleDailyCheckAndRewardSystem(!isChecked);
        
        setLoading(false);
        setShowReward(true);
        
         setTimeout(() => {
          setShowReward(false);
    
        }, 3000);
    };



 

     const HandleDailyCheckAndRewardSystem =  async (newVal: boolean) => {

         await runTransaction(db, async (tra)=>{

             const RandomXpReward = (): number => {
                 switch (Diffeculty) {
                   case 'Simple': return Math.floor(Math.random() * 11) + 10;
                   case 'Easy': return Math.floor(Math.random() * 15) + 21;
                   case 'Medium': return Math.floor(Math.random() * 15) + 36;
                   case 'Hard': return Math.floor(Math.random() * 15) + 51;
                   case 'Extreme': return Math.floor(Math.random() * 25) + 66;
                   default: return 0;
                 }
               };

             const auth = getAuth();
             const player = auth.currentUser;
             if(!player) return;

             
             const dataRef = doc(db, 'Players', player.uid, 'data', 'playerData');
             const datasnap = await tra.get(dataRef);
             
            const XpRewards: number = gotRewards ? randomDrop : RandomXpReward();
            outerReward = XpRewards;
            
           tra.update(doc(db, 'Players', player.uid, 'tasks', String(myid)), {
                                  isDone: newVal,
                                  randomDrop: XpRewards,
                                  gotRewards: true,
                                  lastChecked: Timestamp.now(),
                                  Streak: newVal? increment(1) : increment(-1),
                     });
                   if (datasnap.exists()) {

                       const data = datasnap.data();

                      let currentXP: number = data.xp || 0;
  
                  
 
                         

              
               tra.update(dataRef, new FieldPath('xp'), currentXP);
           
        
    }
        


        })
                await XpReward(newVal? outerReward : -outerReward);
                 setGivenReward(newVal? outerReward : -outerReward)
    }
    

    
    return (
<div>


  
             <div className={givenReward > 0 && showReward ? 'rewardAppear showReward':givenReward < 0 && showReward ? 'rewardAppear showRedReward' : 'showReward'}>{givenReward}XP</div>

        
        <div className="collector">
      
            <div className="outer">

        <div className={'TaskBox'}>

            <div className={!loading? isChecked? 'isChecked': darkClass? 'detailsAreaD':'detailsArea' : !isChecked? 'isChecked' : darkClass? 'detailsAreaD':'detailsArea'} onClick={() =>{navigate('/EditTask'+'/' + myid)}}>

            <h3 className="TaskTitle">{name}</h3>

            <h5>{details}</h5>
            <div className="difAndStr">
            <h6>{Diffeculty}</h6>
            <h6>{streak}</h6>
            </div>
           
            

            </div>
            <div className={isChecked ? ' checkArea' : inToday}>

 <input className="check" type="checkbox" onChange={handleCheck} checked={isChecked} disabled={loading}/> 
           

            </div>
         
  
  
  
        </div>

             </div>

        </div>
        </div>
      
    );
  }
  
  export default Task;