function set(target, key, value, receiver) { 
    if (key == "settings") return Reflect.set(target, key, value, receiver);
    if (data.settings == undefined) {
        console.warn("Settings must be defined first!");
        return;
    }
    
    const keys = Object.keys(data.settings); 
    const values = Object.values(data.settings);
    const index = keys.indexOf(key);
    const obj = values[index];
    if (index == undefined || obj == undefined) {
        // not in the settings!
        update(key, value);
        return Reflect.set(target, key, value, receiver);
    }

    if (obj.skip == true) return Reflect.set(target, key, value, receiver);
    if (typeof obj.round == "number") {
        obj.display = (val)=>{
            const pow = Math.pow(10, obj.round);
            return Math.round(val * pow) / pow;
        }
    }
    if (typeof obj.display == "function") {
        update(key, obj.display(value));
        return Reflect.set(target, key, value, receiver);
    }
    update(key, value);
    return Reflect.set(target, key, value, receiver);
}

let data = new Proxy({}, { set: set });

const update = (k, v)=>{
    for (const elem of document.body.getElementsByTagName("*")) {
        if (!elem.hasAttribute("watch")) continue;
        
        let txt = elem.innerText;
        if (elem.hasAttribute("content")) {
            txt = elem.getAttribute("content");
        } else {
            elem.setAttribute("content", elem.innerText);
        }

        if (!txt.includes("{") || !txt.includes("}")) continue;
        let subStr = txt.substring( txt.lastIndexOf("{") + 1, txt.lastIndexOf("}") ).trim();
        if (subStr != k) continue;

        elem.innerText = elem.getAttribute("content").replace(`{${subStr}}`, v);
    }
}
const isInt = (num)=>{
    return num == Math.floor(num);
}

const local = {
    store() {
        let store = {...data};
        store.settings = undefined;
        localStorage.setItem("data", JSON.stringify(store));
    },
    load(data_obj) {
        let stored = JSON.parse(localStorage.getItem("data"));
        if (stored == null) {
            console.warn("localStorage has no 'data' key. Set it with 'local.store' function");
            return;
        } 
        this.update_gui(data_obj, stored);
    },
    can_load() {
        return localStorage.getItem("data") != null;
    },
    update_gui(data_obj, stored) {
        const keys = Object.keys(stored);
        const values = Object.values(stored);
        for (let i = 0; i < keys.length; i++) {
            data_obj[keys[i]] = values[i];
        }
    }
}