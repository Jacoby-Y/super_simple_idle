class Var {
    constructor(value, callback) {
        this.value = value;
        this.type = typeof value;
        if (this.type == "number") {
            this.round = false;
            this.round_place = 0;
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
            if (typeof data[k].callback == "function") data[k].callback("set", k, data[k]);
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
            if (typeof data[k].callback == "function") data[k].callback("set", k, data[k]);
        },
        setf(k, func) {
            if (data[k] == undefined)  console.log(`Key is undefined! key: ${k}`);
            if (typeof func != "function")  console.log("'setf' second arg must be of type 'function'")

            this.set(k, func(data[k].value));
        },
        /** Key: string, Callback: function(ev: String, key: String, Data: Var) */
        set_callback(k, callback) {
            if (typeof callback != "function") {
                console.error("callback must be of type 'function'");
                return;
            }
            if (data[k] != undefined) {
                data[k].callback = callback;
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
            data[k].callback(call_str, k, data[k]);
        },
        add(k, amount=1) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            data[k].value += amount;
            if (typeof data[k].callback == "function") data[k].callback("add", k, data[k]);
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
            if (typeof data[k].callback == "function") data[k].callback("add", k, data[k]);
            this.update();
        },
        sub(k, amount=1) {
            if (data[k] == undefined) {
                console.error(`Can't find key! Key: ${k}`)
            }
            if (data[k].type != "number") {
                console.error(`Can't use add function with non-numbers! Tried key: (${k})`);
                return;
            }
            data[k].value -= amount;
            if (typeof data[k].callback == "function") data[k].callback("sub", k, data[k]);
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
            if (typeof data[k].callback == "function") data[k].callback("sub", k, data[k]);
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
            data[k].round_place = 0;
        },
        round_dec(k, nth=1, bool=true) {
            if (typeof nth != "number" || nth.toString().includes(".")) {
                console.error("round_dec function's second arg (nth) must be an int");
                return;
            }
            if (data[k] == undefined) {
                console.log(`Key not found! key: ${k}`);
                return;
            }
            if (data[k].type != "number") {
                console.log(`Wrong type! Typeof key must 'number'. typeof key: ${data[k].type}`);
                return;
            }
            data[k].round = bool;
            data[k].round_place = nth;
        },
        number_style(k, style) {
            if (data[k] == undefined) {
                console.error(`Key not found! key: ${k}`);
                return;
            }
            if (typeof style != "string") {
                console.error(`style must be of type string!`);
                return;
            }
            
            if (style == "sci")  {data[k].show_val = (val)=>{Number.parseFloat(val).toExponential()};}
            else if (style == "def")  {data[k].show_val = (val)=>{val};}
            else if (style == "fmt") { data[k].show_val = (val)=>{ return Number(val).toLocaleString("en-US"); }; }
            else {console.error(`style must be: def, sci, fmt\nYour arg: ${style}`);}
        },
        set_show_val(k, func) {
            if (data[k] == undefined) {
                console.error(`Key not found! key: ${k}`);
                return;
            }
            if (typeof func != "function") {
                console.error("func arg must be of type 'function'");
                return;
            }
            data[k].show_val = func;
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
            if (typeof data[k].callback == "function") data[k].callback("concat", k, data[k]);
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
            if (data[k] != undefined && typeof data[k].callback == "function") data[k].callback("get", k, data[k]);
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
                if (!txt.includes("{{") || !txt.includes("}}")) continue;
                let subStr = txt.substring( txt.lastIndexOf("{{") + 2, txt.lastIndexOf("}}") );

                for (const key in data) {
                    if (!Object.hasOwnProperty.call(data, key)) continue;
                    if (key != subStr.trim()) continue;
                    // console.log("updating elem with template");
                    // console.log("log key: " + data[key]);
                    
                    let show = data[key].value;
                    if (data[key].type == "number") {
                        const place = data[key].round_place;
                        const power = Math.pow(10, place);
                        if (data[key].round)
                            show = Math.round(show*power)/power;

                        // if (key == "prestige_cost") console.log("we here");

                        if (typeof data[key].show_val == "function") {
                            show = data[key].show_val(show);
                            // console.log(`show (formatted): ${show}`);
                            elem.innerText = elem.getAttribute("content").replace(`{{${subStr}}}`, show);
                        } else {
                            elem.innerText = elem.getAttribute("content").replace(`{{${subStr}}}`, show);
                        }
                    } else {
                        elem.innerText = elem.getAttribute("content").replace(`{{${subStr}}}`, show);
                    }
                    // console.log(elem.getAttribute("content").replace(`{{${subStr}}}`, data[key].value));
                    if (typeof data[key].callback == "function") data[key].callback("update", key, data[key]);
                }
            }
        },
        local_store() {
            localStorage.setItem("data", JSON.stringify(data));
        },
        local_get() {
            let store = localStorage.getItem("data");
            if (store == null) {
                console.error("localStorage has no 'data' key. Set it with 'local_store' function");
                return;
            } 
            data = JSON.parse(store);
            this.update();
        },
        local_can_load() {
            const get = localStorage.getItem("data");
            return get != null
        }
    }
}