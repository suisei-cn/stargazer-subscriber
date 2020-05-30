import React from "react";
import {Stack} from "@fluentui/react/lib/Stack"
import {DefaultPalette, FontSizes} from "@fluentui/react/lib/Styling"
import {Label} from "@fluentui/react/lib/Label"
import {Icon} from "@fluentui/react/lib/Icon"

const stackStyles = {
    root: {
        background: DefaultPalette.themePrimary
    }
}

const titleStyles = {
    root: {
        fontsize: FontSizes.large,
        color: DefaultPalette.white,
        margin: "10px"
    }
}

const iconStyles = {
    root: {
        fontsize: FontSizes.large,
        color: DefaultPalette.white,
        margin: "10px",
        padding: "5px"
    }
}

export const AppBar = (prop) => {
    return (
        <Stack horizontal styles={stackStyles}>
            <Icon iconName={prop.icon} styles={iconStyles}/>
            <Label styles={titleStyles}>{prop.title}</Label>
        </Stack>
    )
}