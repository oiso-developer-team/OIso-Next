// HomePage.js
import React, { useContext } from 'react';
import {
    FluentProvider,
    makeStyles,
    shorthands,
    Button,
    Input,
    Display,
} from "@fluentui/react-components";
import { MicRegular, Camera24Regular, Search24Regular } from "@fluentui/react-icons";
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

export default function HomePage() {
    const styles = useStyles();
    const [searchTerm, setSearchTerm] = React.useState('');
    const theme = useContext(ThemeContext);

    const handleSearch = () => {
        // Replace the URL below with your search engine's URL
        if (!searchTerm) return;
        const searchUrl = '/search?q=' + encodeURIComponent(searchTerm);
        window.location.href = searchUrl;
    };

    return (
        <FluentProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', transform: 'translateY(-10%)' }} className={styles.container}>
                <Display font="numeric" weight="bold" style={{
                    background: 'linear-gradient(to right, blue, purple)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    DevSo.Fun
                </Display>
                <div style={{ width: '30%' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }} className={styles.wrapper}>
                    <Button style={{ fontWeight: 'normal' }} size="medium">开发者搜索</Button>
                    <div style={{ width: '15px' }} />
                    <Button style={{ fontWeight: 'normal' }} size="medium">手气不错</Button>
                </div>
            </div>
        </FluentProvider>
    );
}
