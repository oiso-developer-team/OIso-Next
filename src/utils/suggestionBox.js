import React, { useContext } from 'react';
import {
    Button,
    webDarkTheme,
} from "@fluentui/react-components";
import { History16Regular, ArrowUpRight16Regular, Dismiss16Regular } from "@fluentui/react-icons";
import { addSearchTermToHistory, removeSearchTermFromHistory } from './searchHistory';
import { ThemeContext } from '../App';

function SingleSuggestion(type, text) {
    const theme = useContext(ThemeContext);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginTop: '-1px', width: '100%', textAlign: 'left' }}>
            <Button
                shape="square"
                style={{ alignItems: 'left', justifyContent: 'left', width: '100%', background: theme === webDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}
                size="large"
                icon={type === "history" ? <History16Regular /> : <ArrowUpRight16Regular />}
                onClick={(event) => {
                    if (event.target.tagName === 'BUTTON' && event.target.getAttribute('icon') === 'Delete16Regular') {
                        // 点击的是删除按钮
                        removeSearchTermFromHistory(text);
                        // window.location.reload();
                    } else {
                        // 点击的是普通按钮
                        addSearchTermToHistory(text);
                        window.location.href = `/search?q=${text}`;
                    }
                }}
            >
                {type === "history" ? (
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ transform: 'translateY(5px)' }}>{text}</div>
                        <div style={{ flexGrow: 1 }}></div>  {/* 添加这个占位的div */}
                        <Button
                            style={{ zIndex: 1145141919815 }}
                            icon={<Dismiss16Regular />}
                            appearance="transparent"
                            onClick={(event) => {
                                event.stopPropagation();
                                removeSearchTermFromHistory(text);
                                const ele = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                                event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.removeChild(ele);
                                // window.location.reload();
                            }}
                        />
                    </div>
                ) : (
                    <div>{text}</div>
                )}
            </Button>
        </div>
    );
}

export function SuggestionGroup(type, { suggestions }, props) {
    if (!props) {
        props = {};
    }
    return (
        <div style={{ marginTop: '-15px', width: '40%', minWidth: '350px', textAlign: 'left' }} {...props}>
            {suggestions.map((suggestion, index) => (
                SingleSuggestion(type, suggestion)
            ))}
        </div>
    );
}
