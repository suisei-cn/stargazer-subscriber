import React from "react";
import {Label} from '@fluentui/react/lib/Label'
import {Toggle} from '@fluentui/react/lib/Toggle'
import {FontSizes, FontWeights, mergeStyleSets} from '@fluentui/react/lib/Styling'

const styles = mergeStyleSets({
    title: {
        fontSize: FontSizes.xxLarge,
        fontWeight: FontWeights.regular
    },
    subTitle: {
        fontSize: FontSizes.xLarge,
        fontWeight: FontWeights.semilight
    }
})

const labelStyle = {
    label: {
        fontWeight: FontWeights.semilight
    }
}

const optGroups = [
    {
        "title": "Bilibili",
        "children": [
            {key: "bili_plain_dyn", label: "Notify me when a vtuber sends a dynamic"},
            {key: "bili_rt_dyn", label: "Notify me when a vtuber forwards a dynamic"},
            {key: "bili_img_dyn", label: "Notify me when a vtuber sends an image (useful for tracking translation)"},
            {key: "bili_video", label: "Notify me when a vtuber uploads a new video"},
        ]
    }, {
        "title": "Twitter",
        "children": [
            {key: "t_tweet", label: "Notify me when a vtuber tweets"},
            {key: "t_rt", label: "Notify me when a vtuber retweets"}
        ]
    }, {
        "title": "Youtube",
        "children": [
            {key: "ytb_live", label: "Notify me when a vtuber goes live"},
            {key: "ytb_sched", label: "Notify me when a broadcast is scheduled"},
            {key: "ytb_reminder", label: "Remind 30 minutes earlier before the live"},
            {key: "ytb_video", label: "Notify me when a vtuber posts a new video"}
        ]
    }
]

export const NotificationManage = (prop) => {
    const toggleOpt = (key) => {
        prop.dispatch({type: "toggle", data: key});
    }
    const parseOpts = (opts) => {
        return opts.slice().map((opt) => {
            return <Toggle checked={prop.optState.includes(opt.key)} styles={labelStyle} label={opt.label}
                           onChange={() => {
                               toggleOpt(opt.key)
                           }}/>
        })
    }
    const parseGroups = (groups) => {
        return groups.slice().map((group) => {
            return (
                <>
                    <Label className={styles.subTitle}>{group.title}</Label>
                    {parseOpts(group.children)}
                </>
            )
        })
    }

    return (
        <>
            <Label className={styles.title}>Notification</Label>
            {parseGroups(optGroups)}
        </>
    )
}