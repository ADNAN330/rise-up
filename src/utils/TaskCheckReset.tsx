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

  const repeatDays: number[] = Array.isArray(task.repeatDays) ? task.repeatDays : [];

  const lastChecked: Date | undefined = task.lastChecked?.toDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let shouldResetStreak = false;

if (lastChecked) {
  const last = new Date(lastChecked);
  last.setHours(0, 0, 0, 0);

    if (last.getTime() === today.getTime()) return;

  let day = new Date(last);
  day.setDate(day.getDate() + 1);


  while (day < today) {
    const missedDayIndex = day.getDay();
    if (repeatDays.includes(missedDayIndex)) {
      shouldResetStreak = true;
      break;
    }
    day.setDate(day.getDate() + 1);
  }
} else {
  shouldResetStreak = true;
}

const updates: any = {
  isDone: false,
  gotRewards: false,
  lastChecked: Timestamp.now(),
};

if (shouldResetStreak) {
  updates.Streak = 0;
}

await updateDoc(taskRef, updates);

};


export default function DailyResetSingle({ taskId }: { taskId: string }) {
  useEffect(() => {
    resetDailyTask(taskId);
  }, [taskId]);

  return null;
}
