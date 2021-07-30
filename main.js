const data = templater();
data.new("money", 0);
data.round("money", true);
data.new("per_click_num", 2);
data.new("per_click_cost", 10);
data.new("per_click_lvl", 1);
data.new("per_click", 1);

data.new("per_sec_num", 1);
data.new("per_sec_cost", 100);
data.new("per_sec_lvl", 0);
data.new("per_sec", 0);

data.new("css_per_click_info", "none");
data.new("css_per_sec_info", "none");
data.new("css_money", "none");
data.new("css_menu_btn", "none");

const main_btn = $("#main-btn")[0];
const menu_btn = $("#menu-btn")[0];
const money_txt = $("#money-txt")[0];
const menu_wrapper = $("#menu-wrapper")[0];
const per_click_upg = $("#per_click")[0];
const per_sec_upg = $("#per_sec")[0];
const per_click_info = $("#per-click-info")[0]
const per_sec_info = $("#per-sec-info")[0]

const style_setters = ()=>{
    money_txt.style.display = data.get("css_money");
    menu_btn.style.display = data.get("css_menu_btn");
    per_click_info.style.display = data.get("css_per_click_info");
    per_sec_info.style.display = data.get("css_per_sec_info");
}

style_setters();

let menu_out = false;

main_btn.onclick = ()=>{
    money_txt.style.display = "inline-block"
    data.add2("money", "per_click");
    const money = data.get("money");

    if (money > 20) {
        data.set("css_menu_btn", "block");
    }
    if (money > 0) {
        data.set("css_money", "block");
    } 
    style_setters();
}
menu_btn.onclick = ()=>{
    let menu_width = menu_wrapper.clientWidth;
    if (menu_out) {
        menu_wrapper.style.left = `-${menu_width+4}px`;
    } else {
        menu_wrapper.style.left = "0";
    }
    menu_out = !menu_out;
}
per_click_upg.onclick = ()=>{
    data.set("css_per_click_info", "block");
    if (data.get("money") >= data.get("per_click_cost")) {
        data.sub2("money", "per_click_cost");
        data.set2("per_click", "per_click_num");
        let new_cost = data.get("per_click_cost") + (10*data.get("per_click_lvl"));
        data.set("per_click_cost", new_cost);
        data.add("per_click_num", 1);
        data.add("per_click_lvl", 1);
    }
    style_setters();
}
per_sec_upg.onclick = ()=>{
    data.set("css_per_sec_info", "block");
    if (data.get("money") >= data.get("per_sec_cost")) {
        data.sub2("money", "per_sec_cost");
        data.set2("per_sec", "per_sec_num");
        let new_cost = data.get("per_sec_cost") + (15*data.get("per_sec_lvl"));
        data.set("per_sec_cost", new_cost);
        data.add("per_sec_num", 1);
        data.add("per_sec_lvl", 1);
    }
    style_setters();
}

const idle_loop = setInterval(() => {
    if (data.get("per_sec") <= 0) {
        return;
    }
    let idle_add = data.get("per_sec") / 4;
    data.add("money", idle_add);
}, 250);