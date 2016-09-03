import { ready } from "./utils"

function findGitlabAnchors(d, url) {
    let as = d.querySelectorAll("a[href^='" + url + "']");
    let exp = new RegExp(url + ".+/.+/merge_requests/\\d+");
    return Array.prototype.filter.call(as, e => {
        return exp.test(e.href);
    });
}

function addStatusBadge(d, glabA, badge) {
    glabA.appendChild(badge);
}

function generateBadge(d, status) {
    let b = d.createElement("span");
    b.textContent = status.state;
    b.className = "_gitlab_status " + status.state.toLowerCase();
    return b;
}

function fetchMRStatus(url) {
    return callBackgroundMethod("fetchStatus", url);
}

function addStyleForStatus(d) {
    let style = d.createElement("style");
    style.textContent = `._gitlab_status {
    display: inline-block;
    font-size: 0.87em;
    font-weight: bold;
    color: #ffffff;
    margin: 0 0.3em;
    padding: 0 0.3em;
    border-radius: 3px;
    }
    ._gitlab_status.open {
    background-color: #38ae67;
    }
    ._gitlab_status.merged {
    background-color: #2d9fd8;
    }
    ._gitlab_status.closed {
    background-color: #d22852;
    }`;
    d.body.appendChild(style);
}


function callBackgroundMethod(method) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            method: method,
            args: Array.prototype.slice.call(arguments, 1)
        }, result => {
            if (result.success) {
                resolve(result.data);
            } else {
                reject(result.reason);
            }
        });
    });
}


ready(document).then(_ => {
    addStyleForStatus(document);
});

Promise.all([ready(document), callBackgroundMethod("loadGitlabUrl")]).then(values => {
    let [a, url] = values;
    Array.prototype.map.call(
        findGitlabAnchors(document, url),
        elem => {
            let mrUrl = elem.href;
            fetchMRStatus(mrUrl).then(status => {
                let badge = generateBadge(document, status);
                addStatusBadge(document, elem, badge);
            }, reason => console.log(reason));
        });
});
