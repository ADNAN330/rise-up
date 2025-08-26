type ToDoProps = {
name: string | number;

details: string | number;

Diffeculty : 'Simple'| 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}


const ToDo: React.FC<ToDoProps> = ({name, details, Diffeculty}) => {
  
    

  return (
   <div>
        
        <div className="collector">
      
            <div className="outer">

        <div className={'TaskBox'}>

            <div className={'detailsArea'}>

            <h3 className="TaskTitle">{name}</h3>

            <h5 className="TaskDetails">{details}</h5>
            <div className="difAndStr">
            <h6>{Diffeculty}</h6>
            </div>
           
            

            </div>
            <div className={'checkArea'}>

 <input className="check" type="checkbox"/> 
           

            </div>
         
  
  
  
        </div>

             </div>

        </div>
        </div>
  );
}

export default ToDo;
