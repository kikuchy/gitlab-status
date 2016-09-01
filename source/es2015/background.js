function fetchStatus(mrUrl) {
    return fetch(mrUrl).
        then(res => res.text()).
        then(text => {
            // todo: 頑張って正規表現とかでステータス部分探してくる
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == "fetchStatus") {
        fetchStatus.call(this, request.args).then(status => {
            sendResponse({
                success: true,
                data: status
            });
        }, reason => {
            sendResponse({
                success: false,
                reason: reason
            });
        });
    }
});
