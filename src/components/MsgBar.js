import {MessageBar} from "@fluentui/react/lib/MessageBar";
import {Link} from "@fluentui/react/lib/Link";
import React from "react";
import {useBoolean} from "@uifabric/react-hooks";
import {useHistory} from "react-router-dom";

export const MsgBar = (prop) => {
    const [isDismiss, {setTrue: setDismiss}] = useBoolean(false);
    const history = useHistory();
    const showMessage = !isDismiss && prop.notifState.length === 0
    return (
        (showMessage && <MessageBar className={prop.className} onDismiss={setDismiss}>You are not subscribing to any
            notification event now. Don't forget to pick some up in <Link onClick={() => {
                history.push("/notification")
            }}>Menu > Notification</Link>.</MessageBar>))
}
