import React, { useContext } from 'react';
import {
    FluentProvider,
    makeStyles,
    shorthands,
    Button,
    Input,
    Title3,
    Tab,
    TabList,
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
        width: '100%',
        // alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        transform: 'translateX(-52%)',
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

const SearchPage = () => {
    const styles = useStyles();
    const theme = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = React.useState('');
    // 将请求参数里的q参数解码后赋值给searchTerm
    React.useEffect(() => {
        const url = new URL(window.location.href);
        const q = url.searchParams.get('q');
        if (q) {
            setSearchTerm(decodeURIComponent(q));
        }
    }, []);
    
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

    // Dummy search results data
    const searchResults = [
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Result 1: Lorem ipsum dolor sit amet",
        "Result 2: Consectetur adipiscing elit",
        "Result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ];

    const General = React.memo(() => (
        <div role="tabpanel" aria-labelledby="General">
            <div>
                <h2>Search Results</h2>
                {searchResults.map((result, index) => (
                    <div key={index} className={styles.resultItem}>
                        {result}
                    </div>
                ))}
                <Button style={{ marginTop: '20px' }} size="medium">Back to Search</Button>
            </div>
        </div>
    ));

    return (
        <FluentProvider theme={theme}>
            <div className={styles.container}>
                <div className={styles.searchContainer} style={{ width: '40%', transform: 'translateX(-72%)', marginTop: '15px' }}>
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
                <div className={styles.root } style={{ width: '40%' }}>
                    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} appearance="subtle">
                        <Tab id="General" icon={<Globe />} value="general">
                            综合
                        </Tab>
                    </TabList>
                    <div className={styles.panels}>
                        {selectedValue === "general" && <General />}
                    </div>
                </div>
            </div>
        </FluentProvider>
    );
};

export default SearchPage;
