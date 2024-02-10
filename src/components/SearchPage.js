import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    FluentProvider,
    makeStyles,
    shorthands,
    Button,
    Input,
    Title3,
    Subtitle1,
    Tab,
    TabList,
    Skeleton,
    SkeletonItem,
    Divider,
    Link,
    Body1,
    Label,
    Persona,
    Badge,
} from "@fluentui/react-components";
import {
    MicRegular,
    Camera24Regular,
    Search24Regular,
    GlobeFilled,
    GlobeRegular,
    bundleIcon,
    ChevronLeft24Regular,
    ChevronRight24Regular,
    ChevronDoubleLeftRegular,
    ChevronDoubleRightRegular,
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
        marginBottom: '25px',
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

export const LoadingBar = (props) => (
    <Skeleton>
        <SkeletonItem {...props} />
    </Skeleton>
);

export const LoadingBlock = () => (
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

const handlePreviousPage = () => {
    const url = new URL(window.location.href);
    const page = url.searchParams.get('page') || 1;
    const perPage = url.searchParams.get('pageSize') || 10;
    const q = url.searchParams.get('q');
    const newPage = Math.max(1, page - 1);
    const searchUrl = `/search?q=${encodeURIComponent(q)}&page=${newPage}&pageSize=${perPage}`;
    window.location.href = searchUrl;
};

const handleNextPage = () => {
    const url = new URL(window.location.href);
    const page = url.searchParams.get('page') || 1;
    const perPage = url.searchParams.get('pageSize') || 10;
    const q = url.searchParams.get('q');
    const newPage = Math.max(1, page + 1);
    const searchUrl = `/search?q=${encodeURIComponent(q)}&page=${newPage}&pageSize=${perPage}`;
    window.location.href = searchUrl;
};

const handleChangePage = (page) => {
    const url = new URL(window.location.href);
    const perPage = url.searchParams.get('pageSize') || 10;
    const q = url.searchParams.get('q');
    const searchUrl = `/search?q=${encodeURIComponent(q)}&page=${page}&pageSize=${perPage}`;
    window.location.href = searchUrl;
};

export function Pagination() {
    var currentPage = Number(new URL(window.location.href).searchParams.get('page') || 1);
    const totalPages = 10; // 总页数，你可以根据你的数据来设置这个值

    let startPage, endPage;
    if (currentPage <= 3) {
        startPage = 1;
        endPage = 6;
    } else {
        startPage = currentPage - 3;
        endPage = currentPage + 3;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div>
            {pages.map(page => (
                <Button
                    style={{ marginRight: '5px' }}
                    onClick={() => handleChangePage(page)}
                    disabledFocusable={(new URL(window.location.href).searchParams.get('page') || 1) == Number(page)}
                    appearance={((new URL(window.location.href).searchParams.get('page') || 1) == Number(page)) ? "primary" : undefined}
                > {page} </Button>
            ))}
        </div>
    );
}

export const PageSwitcher = () => (
    <div style={{ display: 'flex' }}>
        <Button
            icon={<ChevronDoubleLeftRegular />}
            style={{ marginRight: '5px' }}
            // onClick={handleChangePage(1)}
            disabledFocusable={(new URL(window.location.href).searchParams.get('page') || 1) === 1}
        />
        <Button
            icon={<ChevronLeft24Regular />}
            style={{ marginRight: '5px' }}
            onClick={handlePreviousPage}
            disabledFocusable={(new URL(window.location.href).searchParams.get('page') || 1) === 1}
        />
        <Pagination />
        <Button icon={<ChevronRight24Regular />} style={{ marginLeft: '5px' }} onClick={handleNextPage} />
        <Button icon={<ChevronDoubleRightRegular />} style={{ marginLeft: '5px' }} onClick={handleNextPage} />
    </div>
);

const SearchPage = () => {
    const styles = useStyles();
    const theme = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loadStart, setLoadStart] = useState(0.0);
    const [timeSpent, setTimeSpent] = useState(0.0);
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
                setLoadStart(new Date().getTime());
                console.log("timer start", loadStart);
                const url = new URL(window.location.href);
                const page = url.searchParams.get('page') || 1;
                const perPage = url.searchParams.get('pageSize') || 10;
                const response = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/search?q=${searchTerm}&page=${page}&pageSize=${perPage}`);
                setSearchResults(response.data);
                setTimeSpent(new Date().getTime() - loadStart);
                console.log("timer end", new Date().getTime() - loadStart);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
            }
        };

        fetchResults();
    });

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
            ) : (
                (searchResults.map((result, index) => (
                    <div key={index} className={styles.resultItem} style={{
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                        <Persona
                            name={`${new URL(result.link).hostname.split('.').slice(-2)[0]}.${new URL(result.link).hostname.split('.').slice(-1)[0]}`}
                            secondaryText={`${result.link}`}
                            presence={{ status: "available", size: "small" }}
                            avatar={{
                                image: {
                                    src: `https://api.iowen.cn/favicon/${new URL(result.link).host}.png`,
                                },
                                shape: "square",
                                size: 24,
                                style: { transform: 'translateY(5px)', borderRadius: '20%' }
                            }}
                            size="small"
                        />
                        <br />
                        <Link href={result.link} target="_blank" rel="noreferrer" style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>
                            <Subtitle1 style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>{result.title}</Subtitle1>
                        </Link>
                        <br />
                        <Badge appearance="outline" size="small" color="informative" style={{ marginRight: '5px' }}>网页</Badge>
                        <Body1 weight="medium">{result.content + "…"}</Body1>
                    </div>
                )))
            )}
        </div>
    ));

    return (
        <FluentProvider theme={theme}>
            <div className={styles.container}>
                <div className={styles.searchContainer} style={{ width: '50%', transform: 'translateX(-48%)', marginTop: '15px' }}>
                    <Title3
                        font="numeric"
                        weight="bold"
                        style={{
                            background: '-webkit-linear-gradient(120deg, #db8bff 30%, #81deff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            cursor: 'pointer' // 添加按钮状态的鼠标样式
                        }}
                        onClick={() => {
                            window.location.href = '/'; // 点击跳转到主页
                        }}
                    >
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
                        <Label>
                            {`约 ${searchResults.length} 条结果，耗时 ${(timeSpent / 1e12).toFixed(2)} 秒。`}
                        </Label>
                    </div>
                    <div style={{ height: '10px' }}></div>
                    <div style={{ textAlign: "left" }}>
                        {selectedValue === "general" && <General />}
                    </div>
                    <Divider />
                    <div style={{ height: '10px' }}></div>
                    <PageSwitcher />
                    <div style={{ height: '10px' }}></div>
                </div>
            </div>
        </FluentProvider>
    );
};

export default SearchPage;
