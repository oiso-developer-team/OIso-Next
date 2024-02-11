// 当用户进行搜索时，将搜索词添加到localStorage中
export function addSearchTermToHistory(searchTerm) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    } else {
        searchHistory = [];
    }
    // Check if the search term already exists in the search history
    if (!searchHistory.includes(searchTerm)) {
        searchHistory.push(searchTerm);
        if(searchHistory.length > 7) {
            searchHistory.shift();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } else {
        // Move the search term to the top of the search history
        searchHistory = searchHistory.filter(term => term !== searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

// 从localStorage中读取搜索历史
export function getSearchHistory() {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
        return searchHistory.reverse();
    } else {
        return [];
    }
}

// 删除某条搜索历史
export function removeSearchTermFromHistory(searchTerm) {
    let searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
        searchHistory = searchHistory.filter(term => term !== searchTerm);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}