import React from "react";


type XPBarProps = {
    xp: number;
    maxXp: number;
    darkMode: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ xp, maxXp, darkMode }) => {
    let xpPercentage = (xp / maxXp) * 100;
 
  return (
    <div>
    
      <div className="outerContainer">
        <div className={darkMode? 'dataShowd' : 'dataShow'}>
            {xp}/{maxXp}xp
        </div>
      <div className="outBar">
        <div className="ExpBar" style={xpPercentage>0?{ width: `${xpPercentage}%` }: { width: '0%' }}>
          

           
        </div>
      </div>

    </div>
    </div>
  );
}

export default XPBar;
