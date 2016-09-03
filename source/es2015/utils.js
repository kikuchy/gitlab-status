function ready(document) {
    return new Promise(resolve => {
        document.addEventListener("DOMContentLoaded", _ => {
            resolve();
        });
    });
}

module.exports = {
    ready: ready
};
