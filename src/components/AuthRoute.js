import React, {useEffect} from "react";
import {useBoolean} from "@uifabric/react-hooks"
import {Redirect} from "react-router-dom";
import {useQuery} from "../hooks/useQuery";

export const AuthRoute = (prop) => {
    const query = useQuery();
    const [isTokenSet, {setTrue: setToken}] = useBoolean(false);
    useEffect(() => {
        const _token = query.get("token")
        if (_token) {
            console.log("set token")
            prop.setToken(_token);
            setToken();
        }
    }, [query, prop])
    return (
        <>
            <p>Authenticating...</p>
            {isTokenSet && <Redirect to={prop.redirect}/>}
        </>
    )
}
