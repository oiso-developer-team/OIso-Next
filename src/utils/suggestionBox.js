import {
    Button,
} from "@fluentui/react-components";
import { History16Regular, ArrowUpRight16Regular } from "@fluentui/react-icons";
import { addSearchTermToHistory } from './searchHistory';

function SingleSuggestion(type, text) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginTop: '-1px', width: '100%', textAlign: 'left' }}>
            <Button
                shape="square"
                style={{ alignItems: 'left', justifyContent: 'left', width: '100%' }}
                size="large"
                icon={type === "history" ? <History16Regular /> : <ArrowUpRight16Regular />}
                onClick={() => {
                    addSearchTermToHistory(text);
                    window.location.href = `/search?q=${text}`;
                    console.log("DEBUG: Suggestion clicked")
                }}
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
