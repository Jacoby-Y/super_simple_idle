class Var {
    constructor(value, callback) {
        this.value = value;
        this.type = typeof value;
        if (this.type == "number") {
            this.round = false;
        }
        this.callback = callback;
    }
    event(ev) {
        if (this.callback != null) {
            this.callback(ev);
        }
    }
}

function templater() {
    let data = {};

    return {
        new(k, v, callback=null) {
            if (typeof callback != "function") {
                callback = null
            }
            data[k] = new Var(v, callback);
            this.update();
        },
        set(k, v){
            if (data[k] == undefined) {
                console.log(`Key not found! Key: ${k}\nConsider using 'new()'`);
                return;
            }
            if (data[k].type != typeof v) {
                console.log(`mismatching types! old type: ${data[k].type}, new type: ${typeof v}\nkey: ${k}, value: ${v}}`);
                return;
            }
            data[k].value = v;
            if (typeof data[k].callback == "function") data[k].callback("set");
        },
        set2(k, k2){
            if (data[k] == undefined) {
                console.log(`Key not found! Key: ${k}\nConsider using 'new()'`);
                return;
            }
            if (data[k2] == undefined) {
                console.log(`Key not found! Key: ${k}\nConsider using 'new()'`);
                return;
            }
            if (data[k].type != data[k2].type) {
                console.log(`mismatching types! key 1: ${data[k].type}, key2: ${data[k2].type}`);
                return;
            }
            data[k].value = data[k2].value;
            if (typeof data[k].callback == "function") data[k].callback("set");
        },
        set_callback(k, callback) {
            if (typeof callback != "function") {
                console.error("callback must be of type 'function'");
                return;
            }
            if (data[k] != undefined) {
                data[k].callback = callback
            } else {
                console.error(`Key not found! key: ${k}`);
            }
        },
        call(k, call_str = "call") {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`);
                return;
            }
            if (data[k].callback == null) {
                console.error(`key: '${k}' has no callback!`);
                return;
            }
            data[k].callback(call_str);
        },
        add(k, amount) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            data[k].value += amount;
            if (typeof data[k].callback == "function") data[k].callback("add");
            this.update();
        },
        /** Add two keys together */
        add2(k, k2) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            if (data[k2].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k2})`);
                return;
            }
            data[k].value += data[k2].value;
            if (typeof data[k].callback == "function") data[k].callback("add");
            this.update();
        },
        sub(k, amount) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            data[k].value -= amount;
            if (typeof data[k].callback == "function") data[k].callback("add");
            this.update();
        },
        sub2(k, k2) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            if (data[k2].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k2})`);
                return;
            }
            data[k].value -= data[k2].value;
            if (typeof data[k].callback == "function") data[k].callback("add");
            this.update();
        },
        round(k, bool=true) {
            if (data[k] == undefined) {
                console.log(`Key not found! key: ${k}`);
                return;
            }
            if (data[k].type != "number") {
                console.log(`Wrong type! Typeof key must 'number'. typeof key: ${data[k].type}`);
                return;
            }
            data[k].round = bool;
        },
        concat(k, template, get = false) {
            if (typeof k != "string" || typeof template != "string") {
                console.error(`key and template arguments must be string`);
                return;
            }
            if (data[k] == undefined) {
                console.error(`key is undefined. key: ${k}}`);
                return;
            }
            if (typeof data[k].callback == "function") data[k].callback("concat");
            if (template.includes("%k")) {
                let concatted = template.replace("%k", data[k].value);
                if (get) {
                    return concatted;
                } 
                data[k].value = concatted;
                this.update();
            }
        },
        get(k) {
            if (data[k] != undefined && typeof data[k].callback == "function") data[k].callback("get");
            return data[k].value;
        },
        get_data() {
            return data;
        },
        update() {
            for (const elem of document.body.getElementsByTagName("*")) {
                // console.log(elem.attributes);
                // console.log("inside update function");
                if (!elem.hasAttribute("templ")) continue;
                // console.log("passed 'templ' test");
                let txt = elem.innerText;
                if (elem.hasAttribute("content")) {
                    txt = elem.getAttribute("content");
                } else {
                    elem.setAttribute("content", elem.innerText);
                }
                // console.log(elem.getAttribute("content"));
                if (txt.includes("{{") && txt.includes("}}")) {
                    let subStr = txt.substring( txt.lastIndexOf("{{") + 2, txt.lastIndexOf("}}") );
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            if (key == subStr.trim()) {
                                // console.log("updating elem with template");
                                // console.log("log key: " + data[key]);
                                let show = data[key].value;
                                if (data[key].type == "number" && data[key].round) {
                                    show = Math.floor(show);
                                }
                                elem.innerText = elem.getAttribute("content").replace(`{{${subStr}}}`, show);
                                // console.log(elem.getAttribute("content").replace(`{{${subStr}}}`, data[key].value));
                                if (typeof data[key].callback == "function") data[key].callback("update");
                            }
                        }
                    }
                    
                }
            }
        }
    }
}