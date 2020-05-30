import React from "react";
import {Nav} from "@fluentui/react/lib/Nav"
import {useHistory, useLocation} from "react-router-dom"

export const NavBar = (prop) => {
    const location = useLocation();
    const history = useHistory();
    const selected = location.pathname.substr(1);
    const onClick = (event, element) => {
        history.push("/" + element.key);
        if (prop.onClick)
            prop.onClick();
    }
    return (
        <Nav groups={prop.navGroups} selectedKey={selected} onLinkClick={onClick}/>
    )
}