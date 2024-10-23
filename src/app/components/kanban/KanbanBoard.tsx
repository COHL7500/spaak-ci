'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Card from './Card';
import { ColumnTitle, KanbanItem } from '../../types';
import { BoardStyle, BoardTitleStyle, BoardWrapperStyle } from '../../styles/kanban/styles';
import debounce from 'lodash.debounce';
import Column from './Column';

interface KanbanBoardProps {
    items: KanbanItem[];
    groupBy?: keyof KanbanItem; // You could just say kanbanItem.columnId, but this is more flexible if you added more "groupable" properties.
    boardTitle: string;
}

const KanbanBoard = ({ items, groupBy = "columnId", boardTitle }: KanbanBoardProps) => {
    const [groups, setGroups] = useState<Record<ColumnTitle, KanbanItem[]>>({});
    const [visibleItems, setVisibleItems] = useState<Record<ColumnTitle, number>>({});
    const scrollPositions = useRef<Record<ColumnTitle, number>>({});

    useEffect(() => {
        const groupedItems = items.reduce((acc, item) => {
            const key = item[groupBy] as ColumnTitle;
            acc[key] = [...(acc[key] || []), item];
            return acc;
        }, {} as Record<ColumnTitle, KanbanItem[]>);

        setGroups(groupedItems);
        setVisibleItems(
            Object.keys(groupedItems).reduce((acc, key) => {
                acc[key as ColumnTitle] = 10;
                return acc;
            }, {} as Record<ColumnTitle, number>)
        );
    }, [items, groupBy]);

    const loadMoreItems = useCallback(
        debounce((group: ColumnTitle) => {
            setVisibleItems((prev) => ({
                ...prev,
                [group]: prev[group] + 10,
            }));
        }, 200),
        []
    );

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>, group: ColumnTitle) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            scrollPositions.current[group] = scrollTop;
            if (scrollTop + clientHeight >= scrollHeight) {
                loadMoreItems(group);
            }
        },
        [loadMoreItems]
    );

    // could be moved to Column.tsx (or even utils file), but could limit flexibility.
    const getColumnTitle = (group: ColumnTitle, itemCount: number) => `Status ${group} (${itemCount})`;

    // could be utility or benefit from "Strategy" pattern IF more types of cards are added
    const renderItem = (item: KanbanItem) => (
        <Card title={item.title} desc={item.desc} />
    );

    const groupKeys: ColumnTitle[] = Object.keys(groups);

    return (
        <div style={BoardWrapperStyle}>
            <h1 style={BoardTitleStyle}>{boardTitle}</h1>
            <div style={BoardStyle}>
                {groupKeys.map((group) => (
                    <Column
                        key={group}
                        group={group}
                        items={groups[group]}
                        visibleCount={visibleItems[group] || 0}
                        loadMoreItems={loadMoreItems}
                        scrollPositionRef={{current: scrollPositions.current[group] || 0}}
                        renderItem={renderItem}
                        handleScroll={handleScroll}
                        getColumnTitle={getColumnTitle}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
