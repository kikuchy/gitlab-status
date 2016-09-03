import { ready } from "./utils"

function restoreGitlabUrl(inp, storage) {
    inp.value = storage["url"];
}

function saveGitlabUrl(inp, storage) {
    storage["url"] = inp.value;
}

ready(document).then(_ => {
    let u = document.querySelector("#url");
    restoreGitlabUrl(u, localStorage);

    let form = document.querySelector("#settings");
    form.addEventListener("submit", e => {
        e.preventDefault();
        saveGitlabUrl(u, localStorage);
    });
});
