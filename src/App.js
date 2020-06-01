import React from 'react';
import "./App.css";
import 'office-ui-fabric-react/dist/css/fabric.css'

import {AnimationStyles, mergeStyleSets} from '@fluentui/react/lib/Styling'
import {useBoolean} from '@uifabric/react-hooks'
import {Panel} from '@fluentui/react/lib/Panel'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {useSession} from 'react-use-session';

import {AuthRoute} from './components/AuthRoute';
import {AppBar} from './components/AppBar';
import {CmdBar} from './components/CmdBar';
import {FilterList} from './components/FilterList';
import {ModalMsg} from './components/ModalMsg';
import {MsgBar} from "./components/MsgBar";
import {NavBar} from './components/NavBar';
import {NotificationManage} from './components/NotificationManage';

import {useNotif} from './hooks/useNotif';
import {useSub} from "./hooks/useSub";
import {getModal} from "./utils/getModal";
import {BASENAME} from "./config";


const styles = mergeStyleSets({
    app: {
        overflowY: "hidden",
        position: "absolute",
        height: "100vh",
        width: "100%",
    },
    cmdbar: {
        borderBottom: "1px solid #ccc"
    },
    fixedNav: {
        borderRight: "1px solid #ccc",
        height: "100%"
    },
    popupPanel: {
        width: "70vw"
    },
    popupNav: {
        paddingTop: "40px"
    },
    content: {
        margin: "10px 0 15px",
        overflowX: "hidden",
    },
    flexboxCol: {
        display: "flex",
        flexDirection: "column",
    },
    flex1: {
        flex: 1,
        position: "relative",
        overflow: "hidden",
    },
    fullHeight: {
        height: "100%"
    },
    overlay: [
        AnimationStyles.fadeOut100
    ],
    spinner: {
        position: "absolute",
        left: "50%",
        top: "30%",
        transform: "translate(-50%, -30%)"
    },
    msgBar: {
        marginTop: "10px"
    }
})

const classNames = {
    mainGrid: `ms-Grid ${styles.flex1}`,
    mainRow: `ms-Grid-row ${styles.fullHeight}`,
    navCol: `ms-Grid-col ms-md2 ms-hiddenSm ${styles.fullHeight}`,
    contentCol: `ms-Grid-col ms-sm12 ms-md10 ${styles.fullHeight} ${styles.flexboxCol}`
}

const navGroups = [
    {
        links: [
            {
                name: "Subscription",
                key: "subscription",
                icon: "UserFollowed",
            }, {
                name: "Notification",
                key: "notification",
                icon: "ReminderTime"
            }, {
                name: "Advance",
                key: "advance",
                icon: "Settings"
            }
        ]
    }
]

function App() {
    const {session, saveJWT} = useSession('stargazer-auth');
    const [isDrawerOpen, {toggle: toggleDrawer}] = useBoolean(false);
    const [notifState, notifError, notifLoading, dispatchNotifState] = useNotif(session);
    const [subState, subError, subLoading, dispatchSubState] = useSub(session);
    const error = subError || notifError
    const loading = subLoading || notifLoading;

    return (
        <BrowserRouter basename={BASENAME}>
            <div className={`${styles.app} ${styles.flexboxCol}`}>
                <Panel className={styles.popupPanel}
                       isOpen={isDrawerOpen} onDismiss={toggleDrawer} hasCloseButton={false}>
                    <div className={styles.popupNav}>
                        <NavBar navGroups={navGroups} onClick={toggleDrawer}/>
                    </div>
                </Panel>
                <AppBar title="Stargazer" icon="Settings"/>
                <div className={styles.cmdbar}>
                    <CmdBar toggleNav={toggleDrawer} changed={subState.changed}
                            pull={() => {
                                dispatchSubState({type: "pull"})
                            }}
                            save={() => {
                                dispatchSubState({type: "put"})
                            }}
                    />
                </div>
                <div className={classNames.mainGrid} dir="ltr">
                    <div className={classNames.mainRow}>
                        <div className={classNames.navCol}>
                            <div className={styles.fixedNav}>
                                <NavBar navGroups={navGroups}/>
                            </div>
                        </div>
                        <div className={classNames.contentCol}>
                            <MsgBar className={styles.msgBar} notifState={notifState}/>
                            <div className={`${styles.content} ${styles.flex1}`}>
                                <Switch>
                                    <Route path="/subscription">
                                        <FilterList items={subState.items} selected={subState.selected}
                                                    setSelected={dispatchSubState}/>
                                    </Route>
                                    <Route path="/notification">
                                        <NotificationManage optState={notifState} dispatch={dispatchNotifState}/>
                                    </Route>
                                    <Route path="/advance">
                                        Advance
                                    </Route>
                                    <Route path="/auth">
                                        <AuthRoute setToken={saveJWT} redirect="/subscription"/>
                                    </Route>
                                    <Route path="/">
                                        <Redirect to="/auth"/>
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
