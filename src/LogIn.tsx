import { login } from './firebaseConfig';




function LogIn(){



  
   

    return(
        <div className='outerLogin'>
            <h1 className='lginHlo'>Welcome</h1>
        <button  className='loginBtn'onClick={()=>{login()}}>
            Log In With Google
        </button>
        </div>
    );
    
    
}

export default LogIn;
