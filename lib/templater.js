let data = new Proxy({}, {
    set(target, name, value, receiver) {
        if (value instanceof Gui == false && (data[name] == undefined || data[name] instanceof Gui == false)) {
            return Reflect.set(target, name, value, receiver);
        } 
        
        let before = data[name];

        if (before instanceof Gui && value instanceof Gui) {
            before.value = value;
        }       
        else if (before instanceof Gui && value instanceof Gui == false) {
            before.value = value;
        } else if (before == undefined && value instanceof Gui) {
            before = value;
            if (name=="money") console.log("init");
        }

        update(name, before);

        return Reflect.set(target, name, before, receiver);
    }
});

class Gui {
    constructor(value, from_json = false) {
        if (from_json) {
            let obj = JSON.parse(value);
            this.type = obj.type;
            this.value = obj.value;
        } else {
            this.type = typeof value;
            this.value = value;
        }
        this.display = val=>`${val}`;
        this.callback = (ev, val)=>{}
        return this;
    }
    toString() {
        return this.display(this.value);
    }
    round(place) {
        if (this.type != "number") {
            console.error("Type must be 'number' to round");
            return;
        }
        const power = Math.pow(10,parseInt(place));
        // this.display = val => (typeof val == "number") ? Math.round(val*power)/power : `${val}`;
        this.display = (val)=>{
            if (typeof val === "number") return Math.round(val*power)/power
            else return `${val}`;
        }
    }
    number_style(style) {
        if (this.type != "number") {
            console.error("Type must be 'number' to set number style");
            return;
        }
        if (typeof style != "string") {
            console.error(`style must be of type string!`);
            return;
        }
        
        if (style == "sci")       {this.display = (val)=>{ Number.parseFloat(val).toExponential() }}
        else if (style == "def")  {this.display = (val)=>{ val }}
        else if (style == "fmt")  {this.display = (val)=>{ return Number(val).toLocaleString("en-US") }}
        else {console.error(`style must be: def, sci, fmt\nYour arg: ${style}`);}
    }
}

const update = (k, v)=>{
    for (const elem of document.body.getElementsByTagName("*")) {
        if (!elem.hasAttribute("templ")) continue;
        
        let txt = elem.innerText;
        if (elem.hasAttribute("content")) {
            txt = elem.getAttribute("content");
        } else {
            elem.setAttribute("content", elem.innerText);
        }

        if (!txt.includes("{{") || !txt.includes("}}")) continue;
        let subStr = txt.substring( txt.lastIndexOf("{{") + 2, txt.lastIndexOf("}}") ).trim();
        if (subStr != k) continue;

        
        elem.innerText = elem.getAttribute("content").replace(`{{${subStr}}}`, v.display(v.value));
        
        if (typeof v.callback == "function") v.callback("update", v);
    }
}

const local = {
    store() {
        localStorage.setItem("data", JSON.stringify(data));
    },
    load() {
        let store = localStorage.getItem("data");
        if (store == null) {
            console.error("localStorage has no 'data' key. Set it with 'local_store' function");
            return;
        } 
        let get = JSON.parse(store);
    
        let res = {};
    
        for (const key in get) {
            if (Object.hasOwnProperty.call(get, key)) {
                const val = get[key];
                if (val.type != undefined && val.value != undefined) {
                    res[key] = new Gui(val.value);
                } else {
                    res[key] = val;
                }
            }
        }
        const loaded = new Proxy(res, {
            set(target, name, value, receiver) {
                if (value instanceof Gui == false && (data[name] == undefined || data[name] instanceof Gui == false)) {
                    return Reflect.set(target, name, value, receiver);
                } 
                
                let before = data[name];
                
                        
                if (before instanceof Gui && value instanceof Gui == false) {
                    before.value = value;
                } else if (before == undefined && value instanceof Gui) {
                    before = value;
                }
        
                update(name, before);
        
                return Reflect.set(target, name, before, receiver);
            }
        });
        for (const key in loaded) {
            if (Object.hasOwnProperty.call(get, key)) {
                loaded[key] = loaded[key];
            }
        }
        return loaded;
    },
    can_load() {
        const get = localStorage.getItem("data");
        return get != null
    }
}