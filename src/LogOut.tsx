import { logout } from './firebaseConfig';




function LogOut(){



  
   

    return(
        <>
        <button  className='logOut'onClick={()=>{logout()}}>
            Log Out
        </button>
        </>
    );
    
    
}

export default LogOut;
