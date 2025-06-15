import { useEffect } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';

const resetDailyTask = async (taskId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;


  const taskRef = doc(db, 'Players', user.uid, 'tasks', taskId);
  const taskSnap = await getDoc(taskRef);
  if (!taskSnap.exists()) return;

  const task = taskSnap.data();
  const lastChecked: Date | undefined = task.lastChecked?.toDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastChecked || lastChecked.setHours(0, 0, 0, 0) < today.getTime()) {
     let wasDone = task.isDone;
     const dayIndex = new Date().getDay();  

  if (!Array.isArray(task.repeatDays) || !task.repeatDays.includes(dayIndex)) {
 await updateDoc(taskRef, {
      isDone: false,
      gotRewards: false,
      lastChecked: Timestamp.now()
    });
    return;
  }

    if(wasDone == false){
      await updateDoc(taskRef, {
        Streak: 0,
         isDone: false,
      gotRewards: false,
      lastChecked: Timestamp.now()
      })
    }else{
 await updateDoc(taskRef, {
      isDone: false,
      gotRewards: false,
      lastChecked: Timestamp.now()
    });
    }
   
  }
};


export default function DailyResetSingle({ taskId }: { taskId: string }) {
  useEffect(() => {
    resetDailyTask(taskId);
  }, [taskId]);

  return null;
}
