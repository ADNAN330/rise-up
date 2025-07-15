import { useNavigate } from 'react-router-dom';
import AddIcon from './Icons/Add-icon.png' ;
import { useState, useRef, useEffect } from 'react';

function AddTask() {
  const navigate = useNavigate();
  let[isClicked, setIsClicked] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null);
    
    const handleCheck = (mainSetIsChecked: React.Dispatch<React.SetStateAction<boolean>>) => {
        mainSetIsChecked((prev:boolean) => !prev);
    };
  const buttonRef = useRef<HTMLImageElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (
      isClicked &&
      menuRef.current &&
      !menuRef.current.contains(target) &&
      !buttonRef.current?.contains(target)
    ) {
      setIsClicked(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isClicked]);

    return (
      <div>
        <button>
          <img ref={buttonRef} id={isClicked ? 'addButtonClicked' : 'addButton'} src={AddIcon} alt="Add" onClick={() => handleCheck(setIsClicked)} />
        </button>
        <div ref={menuRef} className={isClicked ? 'addingListAppear' : 'addingList'}>
          <div className="AddTask" onClick={() =>navigate('/addTask')}><div className="innerAdds"> Add Task</div>
          </div>
          <div className="AddToDo" onClick={() =>navigate('/addToDo')}><div className="innerAdds"> Add To-Do</div>
          </div>
          <div className="AddHabit"><div className="innerAdds"> Add Habit</div>
          </div>
        </div>
        
      </div>
    );
  }

  export default AddTask;