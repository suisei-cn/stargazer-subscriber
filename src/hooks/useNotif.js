import {useEffect, useState} from "react";
import {useRequest} from "@umijs/hooks";
import {BACKEND_URL} from "../config";

export const useNotif = (session) => {
    const [state, setState] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {error: notifPullError, loading: notifPullLoading, run: pullNotif} = useRequest(
        {
            url: `${BACKEND_URL}/users/${session && session.user}`,
            method: "get",
            headers: {
                "Authorization": `bearer ${session && session.token}`
            }
        }, {
            manual: true, onSuccess: (result, params) => {
                setState(result.notif);
            }
        }
    )

    const {error: notifPutError, loading: notifPutLoading, run: putNotif} = useRequest(
        (notif) => ({
            url: `${BACKEND_URL}/users/${session && session.user}`,
            method: "put",
            data: {
                notif: notif
            },
            headers: {
                "Authorization": `bearer ${session && session.token}`
            }
        }), {
            manual: true, throttleInterval: 300,
            onSuccess: (result, params) => {
                pullNotif();
            }
        }
    )

    useEffect(() => {
        setError(notifPullError || notifPutError);
    }, [notifPutError, notifPullError]);
    useEffect(() => {
        setLoading(notifPullLoading || notifPutLoading);
    }, [notifPullLoading, notifPutLoading]);

    useEffect(() => {
        if (session && session.token && session.user) {
            pullNotif();
        }
    }, [session])

    const dispatch = (action) => {
        switch (action.type) {
            case "pull":
                pullNotif();
                break;
            case "toggle":
                let newState = state.slice();
                if (newState.includes(action.data)) {
                    newState = newState.filter(x => x !== action.data);
                } else {
                    newState.push(action.data);
                }
                putNotif(newState);
                break;
            default:
                throw new Error();
        }
    }

    return [state, error, loading, dispatch];
}
