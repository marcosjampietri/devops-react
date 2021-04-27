import Axios from 'axios';
import React, {useEffect} from "react";

function Comptest() {
    const url =
        process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

    const usersUrl = `${url}/api/users`;

    const getUsers = () => {
        Axios.get(usersUrl).then((res) => {
            console.log(res);
      
        });
    };
    
    useEffect(getUsers, [usersUrl])

    return (
        <div>
            <h1>TEST API</h1>
            <button onClick={getUsers}>USER</button>
        </div>
    );
}

export default Comptest;
