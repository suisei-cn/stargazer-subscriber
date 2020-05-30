import {useRequest} from "@umijs/hooks";
import {BACKEND_URL} from "../config";
import {useEffect, useReducer, useState} from "react";

export const useSub = (session) => {
    function subReducer(state, action) {
        let selected = state.selected;
        switch (action.type) {
            case "select":
                selected = [...new Set([...selected, ...action.select])];
                selected = selected.filter(x => !action.deselect.includes(x));
                return {changed: true, items: state.items, selected: selected};
            case "update-items":
                return {changed: false, items: action.items, selected: state.selected};
            case "update-selected":
                return {changed: false, items: state.items, selected: action.selected};
            default:
                throw new Error();
        }
    }
    const initSubList = {changed: false, items: [], selected: []}

    const [subList, subListDispatch] = useReducer(subReducer, initSubList);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const {error: pullSubError, loading: pullSubLoading, run: pullSub} = useRequest(
        {
            url: `${BACKEND_URL}/users/${session && session.user}`,
            method: "get",
            headers: {
                "Authorization": `bearer ${session && session.token}`
            }
        }, {
            manual: true, onSuccess: (result, params) => {
                subListDispatch({type: "update-selected", selected: result.sub})
            }
        }
    )
    const {error: pullVtubersError, loading: pullVtubersLoading, run: pullVtubers} = useRequest(
        {
            url: `${BACKEND_URL}/vtubers`,
            method: "get",
        }, {
            manual: true, cacheKey: "vtubers",
            onSuccess: (result, params) => {
                subListDispatch({type: "update-items", items: result})
            }
        }
    )
    const {error: putSubError, loading: putSubLoading, run: putSub} = useRequest(
        {
            url: `${BACKEND_URL}/users/${session && session.user}`,
            method: "put",
            data: {
                sub: subList.selected
            },
            headers: {
                "Authorization": `bearer ${session && session.token}`
            }
        }, {
            manual: true, throttleInterval: 1000,
            onSuccess: (result, params) => {
                pullSub();
                pullVtubers();
            }
        }
    )

    useEffect(() => {
        setError(pullVtubersError || pullSubError || putSubError);
    }, [pullVtubersError, pullSubError, putSubError]);
    useEffect(() => {
        setLoading(pullVtubersLoading || pullSubLoading || putSubLoading);
    }, [pullVtubersLoading, pullSubLoading, putSubLoading]);

    useEffect(() => {
        if (session && session.token && session.user) {
            pullSub();
            pullVtubers();
        }
    }, [session])

    const dispatch = (action) => {
        switch (action.type) {
            case "pull":
                pullSub();
                pullVtubers();
                break;
            case "put":
                putSub();
                break;
            case "select":
                subListDispatch({type: "select", select: action.select, deselect: action.deselect})
                break;
            default:
                throw new Error();
        }
    }

    return [subList, error, loading, dispatch];
}