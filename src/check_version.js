const latest = "v0.2.6.1";
const version = localStorage.getItem("version");
if (version == null || version != latest) {
    localStorage.removeItem("data");
    localStorage.setItem("version", latest);
    location.reload();
} else {
    console.log(`Looks like you're up to date!\nVersion: ${latest}`);
}