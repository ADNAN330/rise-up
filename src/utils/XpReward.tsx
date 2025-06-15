
import { doc, runTransaction } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';





const XpReward = async (GivenReward: number)=> {
 
         await runTransaction(db, async (tra)=>{

           

             const auth = getAuth();
             const player = auth.currentUser;
             if(!player) return;

             
             const dataRef = doc(db, 'Players', player.uid, 'data', 'playerData');
             const datasnap = await tra.get(dataRef);
             

             if (datasnap.exists()) {
               
               const data = datasnap.data();
               
               let lvl: number = data.level || 1;
               let currentXP: number = data.xp || 0;
               let currentMaxXP: number = data.maxXp;
               let currentReward: number = data.GivenReward || GivenReward;
               currentXP += GivenReward;

               while (currentXP >= currentMaxXP) {
                 currentXP = currentXP - currentMaxXP;
                 currentMaxXP += Math.round(currentMaxXP * 0.15);
                 lvl++;
                }

                    await tra.update(dataRef, {
                            xp: currentXP,
                         maxXp: currentMaxXP,
                         level: lvl,
                         GivenReward: currentReward,
                      });
        
    }
        


   
  })
   return(
        <div className="showRewards">{GivenReward}</div>
    )

    }
    
   
    
   
  
  
  export default XpReward;