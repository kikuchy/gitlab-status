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
    b.className = "_gitlab_status";
    b.style =  `display: inline-block;
                background-color: ${status.color};
                font-size: 0.87em;
                font-weight: bold;
                color: #ffffff;
                margin: 0 0.3em;
                padding: 0 0.3em;
                border-radius: 3px`;
    return b;
}

function fetchMRStatus(url) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            method: "fetchStatus",
            args: [url]
        }, result => {
            if (result.success) {
                resolve(result.data);
            } else {
                reject(result.reason);
            }
        });
    });
}

function ready(document) {
    return new Promise(resolve => {
        document.addEventListener("DOMContentLoaded", _ => {
            resolve();
        });
    });
}

let url = "https://gitlab.com/";

ready(document).then(_ => {
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
