import {CSSProperties} from "react";
import {noScrollbarStyle} from "../GlobalStyles";

export const BoardWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    margin: '2rem',
    gap: '1rem',
    padding: '1rem',
    height: '100vh',
    backgroundColor: '#000000',
    borderRadius: 'var(--border-radius)',
};

export const BoardTitleStyle: CSSProperties = {
    margin: "1rem",
    textAlign: 'start',
    marginBottom: '0 1rem 1rem 0',
};

export const BoardStyle: CSSProperties = {
    display: 'flex',
    gap: '2rem',
    overflowX: 'auto',
    height: 'calc(100% - 2rem)',
};

export const ColumnStyle: CSSProperties = {
    border: '1px solid #ccc',
    padding: '1rem',
    minWidth: '350px',
    width: '30vw',
    height: '100%',
    overflowY: 'auto',
    borderStyle: 'hidden',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--column-color)',
    position: 'relative',
    ...noScrollbarStyle,
};

export const ColumnTitleStyle: CSSProperties = {
    position: 'sticky',
    top: '0',
    left: '0',
    right: '0',
    height: '2.5rem',
    backgroundColor: 'var(--column-color)',
    textAlign: 'left',
    padding: '0.5rem 0.5rem',
    lineHeight: '1.25rem',
    zIndex: 1,
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
};

export const ColumnInnerStyle: CSSProperties = {
    overflowY: 'scroll',
    height: 'calc(100% - 2rem)',
    paddingTop: '1rem',
    ...noScrollbarStyle,
};