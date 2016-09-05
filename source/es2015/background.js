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
                    state: state
                });
            } else {
                return Promise.reject("Merge Request state is not found.");
            }
        });
}

function loadGitlabUrl() {
    let url = localStorage["url"];
    if (url) {
        return Promise.resolve(url);
    } else {
        return Promise.reject("Gitlab URL is not setted.");
    }
}

let rpc = {
    fetchStatus: fetchStatus,
    loadGitlabUrl: loadGitlabUrl
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let method = rpc[request.method];
    if (method) {
        method.apply(this, request.args).then(status => {
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
