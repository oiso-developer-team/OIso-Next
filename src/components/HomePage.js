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
    webDarkTheme,
} from "@fluentui/react-components";
import { MicRegular, Camera24Regular, Search24Regular } from "@fluentui/react-icons";
import { ThemeContext } from '../App';
import { addSearchTermToHistory, getSearchHistory } from '../utils/searchHistory';
import { SuggestionGroup } from '../utils/suggestionBox';

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

export default function HomePage() {
    const styles = useStyles();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchBoxOnFocus, setSearchBoxOnFocus] = React.useState(false);
    const [suggestionBoxOnFocus, setSuggestionBoxOnFocus] = React.useState(false);
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
            <div style={{ backgroundImage: "url('/assets/image/cover.webp')", backgroundSize: "cover", filter: theme === webDarkTheme ? 'brightness(0.95)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', transform: 'translateY(-10%)' }} className={styles.container}>
                    <Display font="numeric" weight="bold" style={{
                        background: '-webkit-linear-gradient(120deg, #db8bff 30%, #81deff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        DevSo.Fun
                    </Display>
                    <div style={{ width: '30%', minWidth: '350px', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', zIndex: 2 }}>
                        <Input
                            placeholder="有问题尽管问我…"
                            size="large"
                            style={{
                                width: '100%',
                                background: theme === webDarkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px',
                                color: 'black',
                                fontWeight: 'bold',
                                transition: 'opacity 0.3s',
                                opacity: (searchBoxOnFocus || suggestionBoxOnFocus) ? 0.95 : 0.8,
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
                            display: (searchBoxOnFocus || suggestionBoxOnFocus) ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: '100%',
                            textAlign: 'left',
                        }}
                            onMouseEnter={() => setSuggestionBoxOnFocus(true)}
                            onMouseLeave={() => setSuggestionBoxOnFocus(false)}
                        >
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
                        <Button style={{ fontWeight: 'normal', background: theme === webDarkTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }} size="medium">开发搜</Button>
                        <div style={{ width: '15px' }} />
                        <Button style={{ fontWeight: 'normal', background: theme === webDarkTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }} size="medium">手气不错</Button>
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
}
