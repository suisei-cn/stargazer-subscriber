import React from "react";
import {CommandBar} from "@fluentui/react/lib/CommandBar"
import {useWindowSize} from "../hooks/useWindowSize";
import {useLocation} from "react-router-dom";
import {Callout} from '@fluentui/react/lib/Callout'
import {FontSizes, FontWeights, mergeStyleSets} from '@fluentui/react/lib/Styling'
import {useBoolean} from "@uifabric/react-hooks"
import {Text} from '@fluentui/react/lib/Text'

const styles = mergeStyleSets({
    buttonArea: {
        verticalAlign: 'top',
        display: 'inline-block',
        textAlign: 'center',
        margin: '0 100px',
        minWidth: 130,
        height: 32,
    },
    callout: {
        maxWidth: 300,
    },
    header: {
        padding: '18px 24px 12px',
    },
    title: {
        margin: 0,
        fontWeight: FontWeights.semilight,
        fontSize: FontSizes.xLarge
    },
    inner: {
        height: '100%',
        padding: '0 24px 20px',
    },
    actions: {
        position: 'relative',
        marginTop: 20,
        width: '100%',
        whiteSpace: 'nowrap',
    },
    subtext: {
        margin: 0,
        fontWeight: FontWeights.semilight,
        fontSize: FontSizes.small
    },
    infoBtn: {}
});
export const CmdBar = (prop) => {
    const windowSize = useWindowSize();
    const location = useLocation();
    const isSub = location.pathname === "/subscription";
    const [isInfoVisible, {toggle: toggleInfoVisible}] = useBoolean(false);
    const cmdItems =
        [
            ...(windowSize.width < 480 ? [
                {
                    key: "menu",
                    text: "",
                    iconProps: {iconName: "GlobalNavButton"},
                    onClick: prop.toggleNav
                }
            ] : []),
            ...(isSub ? [
                {
                    key: "save",
                    text: "Save",
                    iconProps: {
                        iconName: "Save"
                    },
                    disabled: !prop.changed,
                    onClick: prop.save
                }, {
                    key: "discard",
                    text: "Discard",
                    iconProps: {
                        iconName: "Cancel"
                    },
                    disabled: !prop.changed,
                    onClick: prop.pull
                }
            ] : [])
        ]
    const farItems = [
        {
            key: 'info',
            text: 'Info',
            iconOnly: true,
            iconProps: {iconName: 'Info'},
            className: "infoBtn",
            onClick: toggleInfoVisible,
        }
    ]
    return (
        <>
            <CommandBar items={cmdItems} farItems={farItems}/>
            {isInfoVisible && (
                <Callout
                    className={styles.callout}
                    role="alertdialog"
                    gapSpace={0}
                    target=".infoBtn"
                    onDismiss={toggleInfoVisible}
                    setInitialFocus
                >
                    <div className={styles.header}>
                        <Text className={styles.title}>
                            PyStargazer
                        </Text>
                    </div>
                    <div className={styles.inner}>
                        <Text className={styles.subtext}>
                            A flexible vtuber tracker. It's now capable of monitoring Youtube live status, new tweets,
                            and bilibili dynamic.
                        </Text>
                    </div>
                </Callout>
            )}
        </>
    )
}