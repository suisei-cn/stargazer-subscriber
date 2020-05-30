import {Modal} from "@fluentui/react/lib/Modal";
import React from "react";
import {DefaultPalette, FontSizes, FontWeights, mergeStyleSets} from '@fluentui/react/lib/Styling'

const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header:
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${DefaultPalette.orange}`,
            color: DefaultPalette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontSize: FontSizes.xLargePlus,
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
            p: {margin: '14px 0'},
            'p:first-child': {marginTop: 0},
            'p:last-child': {marginBottom: 0},
        },
    },
});
export const ModalMsg = (prop) => {
    return (
        <Modal
            isOpen={prop.msg.visible}
            containerClassName={contentStyles.container}
        >
            <div className={contentStyles.header}>
                <span>{prop.msg.title}</span>
            </div>
            <div className={contentStyles.body}>
                {prop.msg.value}
            </div>
        </Modal>
    )
}
