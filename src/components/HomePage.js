// HomePage.js
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import {
    FluentProvider,
    makeStyles,
    shorthands,
    Button,
    Input,
    Display,
} from "@fluentui/react-components";
import { MicRegular, Camera24Regular, Search24Regular, History16Regular, ArrowUpRight16Regular } from "@fluentui/react-icons";
import { ThemeContext } from '../App';

const SearchButton = (props) => {
    return (
        <Button
            {...props}
            appearance="transparent"
            icon={<Search24Regular />}
            size="small"
        />
    );
};

const MicButton = (props) => {
    return (
        <Button
            {...props}
            appearance="transparent"
            icon={<MicRegular />}
            size="small"
        />
    );
};

const CamButton = (props) => {
    return (
        <Button
            {...props}
            appearance="transparent"
            icon={<Camera24Regular />}
            size="small"
        />
    );
};

const useStyles = makeStyles({
    container: {
        ...shorthands.gap("16px"),
        display: "flex",
        flexDirection: "column",
        alignItems: "baseline",
    },
});

export function SingleSuggestion(type, text) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginTop: '-1px', width: '100%', textAlign: 'left' }}>
            <Button
                shape="square"
                style={{ alignItems: 'left', justifyContent: 'left', width: '100%' }}
                size="large"
                icon={type === "history" ? <History16Regular /> : <ArrowUpRight16Regular />}
            >
                {text}
            </Button>
        </div>
    );
}

export function SuggestionGroup(type, { suggestions }) {
    return (
        <div style={{ marginTop: '-15px', width: '40%', minWidth: '300px', animation: 'fadeIn 0.3s', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'left' }}>
            {suggestions.map((suggestion, index) => (
                SingleSuggestion(type, suggestion)
            ))}
        </div>
    );
}

// 当用户进行搜索时，将搜索词添加到localStorage中
function addSearchTermToHistory(searchTerm) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    } else {
        searchHistory = [];
    }
    searchHistory.push(searchTerm);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// 从localStorage中读取搜索历史
function getSearchHistory() {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
        return searchHistory.reverse();
    } else {
        return [];
    }
}

export default function HomePage() {
    const styles = useStyles();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchBoxOnFocus, setSearchBoxOnFocus] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState([]); // [ { type: "history", suggestions: ["test1", "test2", "test3"] } ]
    const theme = useContext(ThemeContext);

    useEffect(() => {
        if (searchTerm) {
            // Fetch search suggestions from the server
            // and update the state with the suggestions
            const url = `${process.env.REACT_APP_API_ENDPOINT}/suggestion?q=${searchTerm}`;
            axios.get(url)
                .then(response => {
                    console.log(response.data);
                    setSuggestions(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [searchTerm]);

    const handleSearch = () => {
        if (!searchTerm) return;
        addSearchTermToHistory(searchTerm);
        const searchUrl = '/search?q=' + encodeURIComponent(searchTerm);
        window.location.href = searchUrl;
    };

    return (
        <FluentProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', transform: 'translateY(-10%)' }} className={styles.container}>
                <Display font="numeric" weight="bold" style={{
                    background: '-webkit-linear-gradient(120deg, #db8bff 30%, #81deff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    DevSo.Fun
                </Display>
                <div style={{ width: '30%', minWidth: '300px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', zIndex: 2 }}>
                    <Input
                        placeholder="有问题尽管问我…"
                        size="large"
                        style={{
                            width: '100%',
                        }}
                        contentBefore={<SearchButton aria-label="Search" onClick={handleSearch} />}
                        contentAfter={[
                            <MicButton aria-label="Enter by voice" />,
                            <div style={{ width: '15px' }} />,
                            <CamButton aria-label="Enter by keyboard" />
                        ]}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        value={searchTerm}
                        onFocus={e => {
                            e.target.parentElement.parentElement.style.width = '40%';
                            setSearchBoxOnFocus(true);
                        }}
                        onBlur={e => {
                            e.target.parentElement.parentElement.style.width = '30%';
                            setSearchBoxOnFocus(false);
                        }}
                    />
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        zIndex: 1,
                        display: searchBoxOnFocus ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: '100%',
                        animation: searchBoxOnFocus ? 'fadeIn 0.3s' : 'none',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'left',
                    }}>
                        {
                            (searchTerm) ? (
                                SuggestionGroup("suggestion", { suggestions: suggestions })
                             ) : (
                                SuggestionGroup("history", { suggestions: getSearchHistory() })
                            )
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }} className={styles.wrapper}>
                    <Button style={{ fontWeight: 'normal' }} size="medium">开发搜</Button>
                    <div style={{ width: '15px' }} />
                    <Button style={{ fontWeight: 'normal' }} size="medium">手气不错</Button>
                </div>
            </div>
        </FluentProvider>
    );
}
