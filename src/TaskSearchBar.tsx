import React, { useRef, useEffect } from 'react';
import searchIcon from './Icons/Search-icon.png';

interface TaskSearchBarProps {
  search: boolean;
  setSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchedContent: string;
  setSearchedContent: React.Dispatch<React.SetStateAction<string>>;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
  handleCheck: (setter: React.Dispatch<React.SetStateAction<boolean>>) => void;
}

const TaskSearchBar: React.FC<TaskSearchBarProps> = ({
  search,
  setSearch,
  searchedContent,
  setSearchedContent,
  showAll,
  setShowAll,
  handleCheck
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (search && inputRef.current) {
      inputRef.current.focus();
    }
  }, [search]);

  return (
    <div>
      {!search ? (
        <div className="buttonContainer">
          <img
            className="buttons"
            src={searchIcon}
            alt="search"
            onClick={() => setSearch(true)}
          />
          <button className="buttons" onClick={() => handleCheck(setShowAll)}>
            {showAll ? 'Show For Today' : 'Show All'}
          </button>
          <button
            className="buttons"
            onClick={() =>
              alert('Beta, For any bugs : adnanhamdo2005@gmail.com')
            }
          >
            Info
          </button>
        </div>
      ) : (
        <div className="buttonContainer">
          <button
            className="buttons"
            onClick={() => {
              setSearch(false);
              setSearchedContent('');
            }}
          >
            Back
          </button>
          <input
            value={searchedContent}
            onChange={(e) => setSearchedContent(e.target.value)}
            ref={inputRef}
            type="text"
            placeholder="Search Here..."
          />
        </div>
      )}
    </div>
  );
};

export default TaskSearchBar;
