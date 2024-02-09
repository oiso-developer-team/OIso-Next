import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    FluentProvider,
    makeStyles,
    shorthands,
    Button,
    Input,
    Title3,
    Tab,
    TabList,
    Skeleton,
    SkeletonItem,
    SkeletonProps,
    Divider,
    Link,
    Body2,
} from "@fluentui/react-components";
import {
    MicRegular,
    Camera24Regular,
    Search24Regular,
    GlobeFilled,
    GlobeRegular,
    AirplaneTakeOffRegular,
    AirplaneTakeOffFilled,
    TimeAndWeatherRegular,
    TimeAndWeatherFilled,
    bundleIcon,
} from "@fluentui/react-icons";
import { ThemeContext } from '../App';

const useStyles = makeStyles({
    container: {
        ...shorthands.gap("16px"),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    resultItem: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px',
        width: '50%',
        textAlign: 'center',
    },
    searchContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginBottom: '20px',
    },
    searchInput: {
        width: '50%',
    },
    root: {
        maxWidth: '83%',
        width: '85%',
        // alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        // rowGap: "20px",
        // paddingLeft: '500px',
    },
});

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

const Globe = bundleIcon(GlobeFilled, GlobeRegular);
const AirplaneTakeOff = bundleIcon(
    AirplaneTakeOffFilled,
    AirplaneTakeOffRegular
);
const TimeAndWeather = bundleIcon(TimeAndWeatherFilled, TimeAndWeatherRegular);

export const LoadingBar = (props) => (
    <Skeleton>
        <SkeletonItem {...props} />
    </Skeleton>
);

export const LoadingBlock = (props) => (
    <>
        <LoadingBar size={28} style={{ width: '25%' }} />
        <div style={{ height: '8px' }}></div>
        <LoadingBar size={16} style={{ width: '60%' }} />
        <div style={{ height: '6px' }}></div>
        <LoadingBar size={16} style={{ width: '60%' }} />
        <div style={{ height: '6px' }}></div>
        <LoadingBar size={16} style={{ width: '60%' }} />
        <div style={{ height: '15px' }}></div>
    </>
);

const SearchPage = () => {
    const styles = useStyles();
    const theme = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    // 将请求参数里的q参数解码后赋值给searchTerm
    React.useEffect(() => {
        const url = new URL(window.location.href);
        const q = url.searchParams.get('q');
        if (q) {
            setSearchTerm(decodeURIComponent(q));
        }
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm) {
                return;
            }
            if (hasSearched) {
                return;
            }
            try {
                setHasSearched(true);
                const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/search?q=${searchTerm}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            }
        };

        fetchResults();
    }, [searchTerm]);

    const [selectedValue, setSelectedValue] =
        React.useState("general");

    const onTabSelect = (event, data) => {
        setSelectedValue(data.value);
    };

    const handleSearch = () => {
        // Replace the URL below with your search engine's URL
        if (!searchTerm) return;
        const searchUrl = '/search?q=' + encodeURIComponent(searchTerm);
        window.location.href = searchUrl;
    };


    const General = React.memo(() => (
        <div style={{ textAlign: "left" }}>
            {searchResults.length === 0 ? (
                <>
                    <div height='5px'></div>
                    <LoadingBlock />
                    <LoadingBlock />
                    <LoadingBlock />
                    <LoadingBlock />
                    <LoadingBlock />
                    <LoadingBlock />
                    <LoadingBlock />
                </>
            ): (
                    searchResults.map((result, index) => (
            <div key={index} className={styles.resultItem} style={{ textAlign: "left" }}>
                <Link href={result.link} target="_blank" rel="noreferrer">
                    <Title3>{result.title}</Title3>
                </Link>
                <br />
                <Body2>{result.content}</Body2>
            </div>
            ))
            )}
        </div>
    ));

    return (
        <FluentProvider theme={theme}>
            <div className={styles.container}>
                <div className={styles.searchContainer} style={{ width: '50%', transform: 'translateX(-48%)', marginTop: '15px' }}>
                    <Title3 font="numeric" weight="bold" style={{
                        background: 'linear-gradient(to right, blue, purple)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        DevSo.Fun
                    </Title3>
                    <div style={{ minWidth: '20px' }} />
                    <Input
                        placeholder="有问题尽管问我…"
                        size="large"
                        style={{ width: '100%' }}
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
                    />
                </div>
                <div className={styles.root}>
                    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} appearance="subtle">
                        <Tab id="General" icon={<Globe />} value="general">
                            综合
                        </Tab>
                    </TabList>
                    <Divider />
                    <div style={{ height: '10px' }}></div>
                    <div style={{ textAlign: "left" }}>
                        {selectedValue === "general" && <General />}
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
};

export default SearchPage;
