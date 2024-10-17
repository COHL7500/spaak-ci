'use client';

import React, { CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Card from './Card';
import { ColumnTitle, KanbanItem } from '../types';
import { noScrollbarStyle } from "../styles/GlobalStyles";
import debounce from 'lodash.debounce';

interface KanbanBoardProps {
    items: KanbanItem[];
    groupBy: keyof KanbanItem;
    boardTitle: string;
}

interface ColumnProps {
    group: ColumnTitle;
    items: KanbanItem[];
    visibleCount: number;
    loadMoreItems: (group: ColumnTitle) => void;
    renderItem: (item: KanbanItem) => React.ReactNode;
    scrollPositionRef: React.MutableRefObject<number>;
}

const BoardWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    margin: '2rem',
    gap: '1rem',
    padding: '1rem',
    height: '100vh',
    backgroundColor: '#000000',
    borderRadius: 'var(--border-radius)',
};

const BoardTitleStyle: CSSProperties = {
    margin: "1rem",
    textAlign: 'start',
    marginBottom: '0 1rem 1rem 0',
};

const BoardStyle: CSSProperties = {
    display: 'flex',
    gap: '2rem',
    overflowX: 'auto',
    height: 'calc(100% - 2rem)',
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
    backgroundColor: '#222222',
    position: 'relative',
    ...noScrollbarStyle,
};

const ColumnTitleStyle: CSSProperties = {
    position: 'sticky',
    top: '0',
    left: '0',
    right: '0',
    height: '2.5rem',
    backgroundColor: '#222222',
    color: '#fff',
    textAlign: 'left',
    padding: '0.5rem 0.5rem',
    lineHeight: '1.25rem',
    zIndex: 1,
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
};

const ColumnInnerStyle: CSSProperties = {
    overflowY: 'scroll',
    height: 'calc(100% - 2rem)',
    paddingTop: '1rem',
    ...noScrollbarStyle,
};

const KanbanBoard = ({ items, groupBy, boardTitle }: KanbanBoardProps) => {
    const [groups, setGroups] = useState<Record<ColumnTitle, KanbanItem[]>>({} as Record<ColumnTitle, KanbanItem[]>);
    const [visibleItems, setVisibleItems] = useState<Record<ColumnTitle, number>>({} as Record<ColumnTitle, number>);
    const scrollPositions = useRef<Record<ColumnTitle, number>>({} as Record<ColumnTitle, number>);

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

    const getColumnTitle = (group: ColumnTitle) => `Status ${group}`;

    const renderItem = (item: KanbanItem) => (
        <Card title={item.title} desc={item.desc} />
    );

    const Column = React.memo(({ group, items, visibleCount, renderItem }: ColumnProps) => {
        const visibleItemsList = items.slice(0, visibleCount);
        const columnRef = useRef<HTMLDivElement | null>(null);

        useLayoutEffect(() => {
            if (columnRef.current) {
                columnRef.current.scrollTop = scrollPositions.current[group];
            }
        }, []);

        return (
            <div style={ColumnStyle} key={group}>
                <h4 style={ColumnTitleStyle}>{getColumnTitle(group)}</h4>
                <div
                    style={ColumnInnerStyle}
                    onScroll={(e) => handleScroll(e, group)}
                    ref={columnRef}
                >
                    {visibleItemsList.map((item) => (
                        <div key={item.id}>{renderItem(item)}</div>
                    ) ) }
                </div>
            </div>
        );
    });


    const groupKeys: ColumnTitle[] = Object.keys(groups) as ColumnTitle[];

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
                        scrollPositionRef={{ current: scrollPositions.current[group] || 0 }}
                        renderItem={renderItem}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
