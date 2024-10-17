'use client';

import React, {useEffect, useRef} from 'react';
import { ColumnTitle, KanbanItem } from '../../types';
import { ColumnInnerStyle, ColumnStyle, ColumnTitleStyle } from '../../styles/kanban/styles';

/*
handleScroll, visibleCount, loadMoreItems could be optional, but absence/presence would need to be checked
... so let's keep it simple for now and require them
Though a facade pattern (aka KanbanUtils.ts) for utility functions could make it more maintainable and readable
(Based on the project decsription, it seemed overkill)
 */
interface ColumnProps {
    group: ColumnTitle;
    items: KanbanItem[];
    visibleCount: number;
    loadMoreItems: (group: ColumnTitle) => void;
    renderItem: (item: KanbanItem) => React.ReactNode;
    scrollPositionRef: React.MutableRefObject<number>;
    handleScroll: (e: React.UIEvent<HTMLDivElement>, group: ColumnTitle) => void;
    getColumnTitle: (group: ColumnTitle, itemCount: number) => string;
}

const Column = ({ group, items, visibleCount, renderItem, scrollPositionRef, handleScroll, getColumnTitle }: ColumnProps) => {
    const visibleItemsList = items.slice(0, visibleCount);
    // keep track of the scroll position for each column (as it may change during re-renders)
    const columnRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (columnRef.current) {
            columnRef.current.scrollTop = scrollPositionRef.current;
        }
    }, []);

    return (
        <div style={ColumnStyle} key={group}>
            <h4 style={ColumnTitleStyle}>
                {getColumnTitle(group, items.length)}
            </h4>
            <div
                style={ColumnInnerStyle}
                onScroll={(e) => handleScroll(e, group)}
                ref={columnRef}
            >
                {visibleItemsList.map((item) => (
                    <div key={item.id}>{renderItem(item)}</div>
                ))}
            </div>
        </div>
    );
};

export default Column;
