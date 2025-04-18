import React, { useContext, useEffect , useState} from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const UserProtectedWrapper = ({ children }) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true);
    const{user,setUser} = useContext(UserDataContext);


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, {
            headers:{
                Authorization: `Bearer ${token}`
    
            }
        }).then((response)=>{
            if(response.status === 200){
                setUser(response.data.user);
                setIsLoading(false);
            }
        }).catch((error)=>{
            console.log(error);
            cookies.remove('token');
            navigate('/login');
        })
    },[token]); 

    if(isLoading){
        return(
            <div>Loading...</div>
        )
    }
    if (!token) {
        return null; 
    }

    return <>{children}</>;
};

export default UserProtectedWrapper;
