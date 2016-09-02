function fetchStatus(mrUrl) {
    return fetch(mrUrl, {
            method: "GET",
            credentials: 'include'
        }).
        then(res => res.text()).
        then(text => {
            let state = ((/<span class="hidden-xs">\n(Merged|Open|Closed)\n<\/span>/ig).exec(text) || [])[1];
            if (state) {
                return Promise.resolve({
                    state: state,
                    color: "#2d9fd8"    // FIXME
                });
            } else {
                return Promise.reject("Merge Request state is not found.");
            }
        });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method == "fetchStatus") {
        fetchStatus.apply(this, request.args).then(status => {
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
        return true;
    } else {
        sendResponse({
            success: false,
            reason: "no method"
        });
    }
});
