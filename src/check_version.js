const latest = "v0.3";
const version = localStorage.getItem("version");
if (version == null || version != latest) {
    localStorage.removeItem("data");
    localStorage.setItem("version", latest);
    if (localStorage.getItem("version") == latest) location.reload();
    else console.warn("Are you blocking this site from storing data to your localStorage? Because, it can't work right unless you allow it to store some data.");
} else {
    console.log(`Looks like you're up to date!\nVersion: ${latest}`);
}