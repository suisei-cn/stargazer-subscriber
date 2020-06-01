import React, {useEffect, useRef, useState} from "react";
import {TextField} from '@fluentui/react/lib/TextField'
import {DetailsList, DetailsListLayoutMode, Selection} from '@fluentui/react/lib/DetailsList'
import {ScrollablePane} from '@fluentui/react/lib/ScrollablePane';
import {Sticky, StickyPositionType} from '@fluentui/react/lib/Sticky';
import {mergeStyleSets} from '@fluentui/react/lib/Styling'

const styles = mergeStyleSets({
    detailsList: {
        overflowX: "hidden"
    }
})

const classNames = {
    mainGrid: "ms-Grid",
    row: "ms-Grid-row",
    listCol: "ms-Grid-col ms-sm12",
    searchCol: "ms-Grid-col ms-sm12 ms-md6"
}

const columns = [
    {
        key: "col1",
        name: "Name",
        fieldName: "key"
    }
]

const getKey = (item) => {
    return item.key
};
const dispToEntry = (names) => {
    return names.slice().map((x) => {
        return {key: x}
    });
}

export const FilterList = (prop) => {
    const refProp = useRef();
    const refSuppress = useRef();

    const [displayItems, setDisplayItems] = useState(prop.items);
    const [filter, setFilter] = useState("");

    const [selection, setSelection] = useState(new Selection({
        onSelectionChanged: () => {
            if (refSuppress.current)
                return
            const _all = selection.getItems().map(getKey);
            const _selected = selection.getSelection().map(getKey)
            const _deselected = _all.filter(x => !_selected.includes(x))

            const diff_selected = _selected.filter((x) => !refProp.current.selected.includes(x))
            const diff_deselected = _deselected.filter((x) => refProp.current.selected.includes(x))
            if (diff_deselected.length > 0 || diff_selected.length > 0)
                refProp.current.setSelected({type: "select", select: diff_selected, deselect: diff_deselected});
        }
    }));

    useEffect(() => {
        refSuppress.current = true;
        setDisplayItems(filter ? prop.items.filter(i => i.toLowerCase().indexOf(filter) > -1) : prop.items);
    }, [prop.items, filter]);
    useEffect(() => {
        refSuppress.current = true;
        refProp.current = prop;
        const selected = displayItems.filter(x => prop.selected.includes(x))
        const deselected = displayItems.filter(x => !prop.selected.includes(x))
        selected.forEach((item) => {
            if (!selection.isKeySelected(item))
                selection.setKeySelected(item, true, false);
        });
        deselected.forEach((item) => {
            if (selection.isKeySelected(item))
                selection.setKeySelected(item, false, false);
        });
        refSuppress.current = false;
    }, [displayItems, prop.selected]);

    function onRenderDetailsHeader(props, defaultRender) {
        if (!props) {
            return null;
        }
        return (
            <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                {defaultRender(props)}
            </Sticky>
        );
    };

    return (
        <div className={classNames.mainGrid} dir="ltr">
            <ScrollablePane styles={{contentContainer: {overflowX: 'hidden'}, stickyAbove: {background: 'white'}}}>
                <Sticky stickyPosition={StickyPositionType.Header}>
                    <div className={classNames.row}>
                        <div className={classNames.searchCol}>
                            <TextField placeholder="Search all entries" onChange={(e, text) => {
                                setFilter(text)
                            }} value={filter}/>
                        </div>
                    </div>
                </Sticky>
                <DetailsList
                    className={styles.detailsList}
                    columns={columns}
                    items={dispToEntry(displayItems)}
                    layoutMode={DetailsListLayoutMode.justified}
                    setKey="set"
                    selection={selection}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    onRenderDetailsHeader={onRenderDetailsHeader}
                    checkButtonAriaLabel="Row checkbox"
                    getKey={getKey}
                />
            </ScrollablePane>
        </div>
    )
}
