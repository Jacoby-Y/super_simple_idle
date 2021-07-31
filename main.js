//#region 
const data = templater();
data.new("money", 0);
data.round("money", true);
data.new("per_click_num", 2);
data.new("per_click_cost", 10);
data.new("per_click_lvl", 1);
data.new("per_click", 1);
data.new("tip", "Hey! I'll be here to help you.\nYou can start out by clicking that blue button.");
data.new("tip_index", 1);
data.new("tip_out", true);

data.new("per_sec_num", 1);
data.new("per_sec_cost", 100);
data.new("per_sec_lvl", 0);
data.new("per_sec", 0);

data.new("css_per_click_info", "none");
data.new("css_per_sec_info", "none");
data.new("css_money", "none");
data.new("css_menu_btn", "none");
data.new("css_per_sec_upg", "none");
data.new("css_click_btn", "none");
data.new("css_idle_btn", "none");

data.new("click_mult_lvl", 0);
data.new("idle_mult_lvl", 0);

data.new("css_click_mult", "none");
data.new("css_idle_mult", "none");

data.new("unlocked_click_mult", false);
data.new("unlocked_idle_mult", false);

data.new("css_unlock_click_mult_btn", "none");
data.new("css_unlock_idle_mult_btn", "none");

const main_btn = $("#main-btn")[0];
const menu_btn = $("#menu-btn")[0];
const money_txt = $("#money-txt")[0];
const menu_wrapper = $("#menu-wrapper")[0];
const per_click_upg = $("#per_click")[0];
const per_sec_upg = $("#per_sec")[0];
const per_click_info = $("#per-click-info")[0];
const per_sec_info = $("#per-sec-info")[0];
const tip_wrapper = $("#tip")[0];
const tip_text = $("#tip-txt")[0];
const unlock_click_mult_btn = $("#unlock_click_mult")[0];
const unlock_idle_mult_btn = $("#unlock_idle_mult")[0];
const click_mult_btn = $("#click-mult-btn")[0];
const idle_mult_btn = $("#idle-mult-btn")[0];
//#endregion

tip_text.innerText = data.get("tip");

const style_setters = ()=>{
    money_txt.style.display = data.get("css_money");
    menu_btn.style.display = data.get("css_menu_btn");
    per_click_info.style.display = data.get("css_per_click_info");
    per_sec_info.style.display = data.get("css_per_sec_info");
    per_sec_upg.style.display = data.get("css_per_sec_upg");
    click_mult_btn.style.display = data.get("css_click_mult");
    idle_mult_btn.style.display = data.get("css_idle_mult");
    if (!data.get("unlocked_click_mult"))
        unlock_click_mult_btn.style.display = data.get("css_unlock_click_mult_btn");
    if (!data.get("unlocked_click_mult"))
        unlock_idle_mult_btn.style.display = data.get("css_unlock_idle_mult_btn");
}
const toggle_tip = ()=>{
    let height = tip_wrapper.clientHeight;
    console.log(`height: ${height}`);
    if (data.get("tip_out")) {
        tip_wrapper.style.top = `-${height+5}px`;
    } else {
        tip_text.innerText = data.get("tip");
        tip_wrapper.style.top = `10px`;
        tip_text.text = data.get("tip");
    }
    data.set("tip_out", !data.get("tip_out"));
}

style_setters();

let menu_out = false;

main_btn.onclick = ()=>{
    money_txt.style.display = "inline-block"
    const bonus = (data.get("click_mult_lvl")/100) + 1;
    const money_add = data.get("per_click") * bonus;
    // console.log(`bonus: ${bonus}, total add: ${money_add}`);
    data.add("money", money_add);
    const money = data.get("money");

    if (money >= 40) {
        data.set("css_menu_btn", "block");
    }
    if (money > 0) {
        data.set("css_money", "block");
    } 

    switch (data.get("tip_index")) {
        case 1:
            toggle_tip();
            data.add("tip_index");
            break;
        case 2:
            data.set("tip", "The more you progress the game, the more content shows itself");
            if (money >= 5 && money < 30) {
                if (!data.get("tip_out")) {
                    toggle_tip();
                }
            } else if (money >= 10) {
                data.add("tip_index");
                toggle_tip();
            }
            break;
        case 3:
            data.set("tip", "Looks like you unlocked the menu!\nOpen it by clicking the symbol under your money");
            if (money >= 40) {
                if (!data.get("tip_out")) {
                    toggle_tip();
                }
            }
            break;
        default:
            break;
    }

    if (data.get("tip_index") == 1) {
        toggle_tip();

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

    switch (data.get("tip_index")) {
        case 3:
            toggle_tip();
            const wait_for_transition = setTimeout(() => {
                data.set("tip", "Here you can upgrade your clicking or idling abilities!\nGo ahead, spend some money!");
                toggle_tip();
                data.add("tip_index");
            }, 1000);
            break;
        case 4:
            toggle_tip();
        default:
            break;
    }
}
per_click_upg.onclick = ()=>{
    data.set("css_per_click_info", "block");
    data.set("css_per_sec_upg", "block");
    if (data.get("money") >= data.get("per_click_cost")) {
        data.sub2("money", "per_click_cost");
        data.set2("per_click", "per_click_num");
        let new_cost = data.get("per_click_cost") + (10*data.get("per_click_lvl"));
        data.set("per_click_cost", new_cost);
        data.add("per_click_num", 1);
        data.add("per_click_lvl", 1);
    }
    style_setters();

    switch (data.get("tip_index")) {
        case 4:
            toggle_tip();
            const wait_for_transition = setTimeout(() => {
                data.set("tip", "Now, you can see how much money you're getting per click\n(on the main button)");
                toggle_tip();
                data.add("tip_index");
            }, 1000);
            break;
        case 5:
            toggle_tip();
            data.add("tip_index");
            break;
        default:
            break;
    }
}
per_sec_upg.onclick = ()=>{
    let bought = false;
    if (data.get("money") >= data.get("per_sec_cost")) {
        data.sub2("money", "per_sec_cost");
        data.set2("per_sec", "per_sec_num");
        let new_cost = data.get("per_sec_cost") + (15*data.get("per_sec_lvl"));
        data.set("per_sec_cost", new_cost);
        data.add("per_sec_num", 1);
        data.add("per_sec_lvl", 1);
        bought = true;
    }
    if (bought) {
        data.set("css_per_sec_info", "block");
        data.set("css_unlock_click_mult_btn", "block");
        data.set("css_unlock_idle_mult_btn", "block");
        style_setters();
    }
}
unlock_click_mult_btn.onclick = ()=>{
    if (data.get("unlocked_click_mult") == true) {
        return;
    }
    const money = data.get("money");
    if (money >= 2500) {
        data.sub("money", 2500);
        unlock_click_mult_btn.style = "none";
        data.set("unlocked_click_mult", true);
        data.set("css_click_mult", "block");
        style_setters();
    }
}
unlock_idle_mult_btn.onclick = ()=>{
    if (data.get("unlocked_idle_mult") == true) {
        return;
    }
    const money = data.get("money");
    if (money >= 2500) {
        data.sub("money", 2500);
        unlock_idle_mult_btn.style = "none";
        data.set("unlocked_idle_mult", true);
        data.set("css_idle_mult", "block");
        style_setters();
    }
}
click_mult_btn.onclick = ()=>{ data.add("click_mult_lvl"); }
idle_mult_btn.onclick = ()=>{ data.add("idle_mult_lvl"); }

const idle_loop = setInterval(() => {
    if (data.get("per_sec") <= 0) {
        return;
    }
    const bonus = (data.get("idle_mult_lvl")/100) + 1;
    const idle_add = (data.get("per_sec") / 4) * bonus;
    data.add("money", idle_add);
}, 250);