import React from "react";
import {TextField} from "@fluentui/react/lib/TextField";
import {mergeStyleSets} from '@fluentui/react/lib/Styling'

const styles = mergeStyleSets({
    debugInfo: {
        width: "70vw"
    }
})

export const getModal = (token, networkError) => {
    if (!token) {
        return {
            visible: true,
            title: "Missing Token",
            value: (<><p>You need to identify yourself to continue.</p>
                <p>Please call the bot command to open this page instead of typing in the url directly.</p></>)
        }
    }
    if (networkError) {
        const resp = networkError.response;
        if (!resp) {
            return {
                visible: true,
                title: "Fatal Error",
                value: (<><p>A fatal error has occurred while fetching data.</p>
                    <p>Please try again later.</p>
                    <p>error={networkError.message}</p></>)
            }
        }
        const status_code = resp.status;
        if (status_code === 401) {
            return {
                visible: true,
                title: "Unauthorized",
                value: (<><p>Your session is invalid.</p>
                    <p>It's likely that your last session has expired.</p>
                    <p>Please call the bot command again to continue.</p></>)
            }
        }
        if (status_code === 403) {
            return {
                visible: true,
                title: "Forbidden",
                value: (<><p>You aren't privileged to proceed this action.</p>
                    <p>Contact webmaster if you believe this is a mistake.</p></>)
            }
        }
        const debug_info = `code=${status_code} ${networkError.response.statusText}\nbody=${networkError.data}`;
        return {
            visible: true,
            title: "Network Error",
            value: (<><p>A general network error has occurred.</p>
                <p>Please try again later.</p><p/>
                <TextField className={styles.debugInfo} multiline disabled rows={4} defaultValue={debug_info}/></>)
        }
    }
    return {visible: false}
}

