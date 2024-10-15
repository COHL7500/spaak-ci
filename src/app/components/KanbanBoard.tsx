'use client';

import React, {CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Card from './Card';
import { ColumnTitle } from '../types';
import {noScrollbarStyle} from "../styles/GlobalStyles";
import debounce from 'lodash.debounce';

interface KanbanBoardProps<T> {
    items: T[];
    groupBy: keyof T;
}

interface ColumnProps<T> {
    group: ColumnTitle;
    items: T[];
    visibleCount: number;
    loadMoreItems: (group: ColumnTitle) => void;
    renderItem: (item: T) => React.ReactNode;
    scrollPositionRef: React.MutableRefObject<number>;
}

const BoardStyle: CSSProperties = {
    display: 'flex',
    gap: '2rem',
    padding: '1rem',
    overflowX: 'auto',
    height: '100vh',
};

const ColumnStyle: CSSProperties = {
    border: '1px solid #ccc',
    padding: '1rem',
    minWidth: '350px',
    width: '30vw',
    height: '100%',
    overflowY: 'auto',
    borderStyle: 'hidden',
    borderRadius: 'var(--border-radius)',
    backgroundColor: '#121111',
    position: 'relative',
    ...noScrollbarStyle
};

const ColumnTitleStyle: CSSProperties = {
    position: 'sticky',
    top: '0',
    left: '0',
    right: '0',
    height: '2.5rem',
    backgroundColor: '#121111',
    color: '#fff',
    textAlign: 'left',
    padding: '0.5rem 0.5rem',
    lineHeight: '1.25rem',
    zIndex: 1,
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
}

const ColumnInnerStyle: CSSProperties = {
    overflowY: 'scroll',
    height: 'calc(100% - 2rem)',
    paddingTop: '1rem',
    ...noScrollbarStyle,
}

const KanbanBoard = <T,>({ items, groupBy }: KanbanBoardProps<T>) => {
    const [groups, setGroups] = useState<Record<ColumnTitle, T[]>>({} as Record<ColumnTitle, T[]>);
    const [visibleItems, setVisibleItems] = useState<Record<ColumnTitle, number>>({} as Record<ColumnTitle, number>);
    const scrollPositions = useRef<Record<ColumnTitle, number>>({} as Record<ColumnTitle, number>);

    useEffect(() => {
        const groupedItems = items.reduce((acc, item) => {
            const key = item[groupBy] as ColumnTitle;
            acc[key] = [...(acc[key] || []), item];
            return acc;
        }, {} as Record<ColumnTitle, T[]>);

        setGroups(groupedItems);
        setVisibleItems(
            Object.keys(groupedItems).reduce((acc, key) => {
            acc[key as ColumnTitle] = 10;
            return acc;
        }, {} as Record<ColumnTitle, number>));
    }, [items, groupBy]);

    const loadMoreItems = useCallback(
        debounce((group: ColumnTitle) => {
        setVisibleItems((prev) => ({
            ...prev,
            [group]: prev[group] + 10,
        }));
    }, 200),
    []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>, group: ColumnTitle) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        scrollPositions.current[group] = scrollTop;
        if (scrollTop + clientHeight >= scrollHeight) {
            loadMoreItems(group);
        }

    }, [loadMoreItems]);

    const getColumnTitle = (group: ColumnTitle) => `Status ${group}`;

    // TODO: Add an interface for the item (DONT USE ANY)
    const renderItem = (item: T) => (
        <Card key={(item as any).id} title={(item as any).titleCard
            ?? (item as any).title} desc={(item as any).desc} />
    );

    const Column = React.memo(({ group, items, visibleCount, renderItem }: ColumnProps<T>) => {
        const visibleItemsList = items.slice(0, visibleCount);
        const columnRef = useRef<HTMLDivElement | null>(null);

        useLayoutEffect(() => {
            if (columnRef.current) {
                columnRef.current.scrollTop = scrollPositions.current[group];
            }
        }, []);

        return (
            <div style={ColumnStyle}>
                <h4 style={ColumnTitleStyle}>{getColumnTitle(group)}</h4>
                    <div
                        style={ColumnInnerStyle}
                        onScroll={(e) => handleScroll(e, group)}
                        ref={columnRef}
                    >
                        {visibleItemsList.map((item) => renderItem(item))}
                    </div>
            </div>
        );
    });

    const groupKeys: ColumnTitle[] = Object.keys(groups) as ColumnTitle[];

    return (
        <div style={BoardStyle}>
            {groupKeys.map((group) => (
                <Column
                    key={group}
                    group={group}
                    items={groups[group]}
                    visibleCount={visibleItems[group] || 0}
                    loadMoreItems={loadMoreItems}
                    scrollPositionRef={{ current: scrollPositions.current[group] || 0 }}
                    renderItem={renderItem}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;