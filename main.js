//#region 
const data = templater();
data.new("money", 0);
    data.round("money", true);
data.new("per_click_num", 2);
data.new("per_click_cost", 10);
data.new("per_click_lvl", 1);
data.new("per_click", 1);
data.new("tip", "Hey, my name is Tippy, and I'm your guide.\nYou can start out by clicking that blue button.");
data.new("tip_index", 1, (ev, k, vari)=>{if (ev=="add") console.log(`tip_index: ${vari.value}`)}); //-! for debugging
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
    data.round_dec("idle_mult_lvl", 1);

data.new("css_click_mult", "none");
data.new("css_idle_mult", "none"); 

data.new("unlocked_click_mult", false);
data.new("unlocked_idle_mult", false);

data.new("css_unlock_click_mult_btn", "none");
data.new("css_unlock_idle_mult_btn", "none");

data.new("css_prestige_btn", "none");
data.new("prestige_cost", 10000);
data.number_style("prestige_cost", "fmt");

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
const prestige_btn = $("#prestige_btn")[0];
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

    //if (!data.get("unlocked_click_mult")) 
    unlock_click_mult_btn.style.display = data.get("css_unlock_click_mult_btn");
    unlock_idle_mult_btn.style.display = data.get("css_unlock_idle_mult_btn");

    //if (!data.get("unlocked_idle_mult")) unlock_idle_mult_btn.style.display = data.get("css_unlock_idle_mult_btn");

    prestige_btn.style.display = data.get("css_prestige_btn");
}
const toggle_tip = (bool="default")=>{
    const height = tip_wrapper.clientHeight;
    const tip_out = data.get("tip_out");
    if (bool != "default") {
        // console.log(`manually changing! tip out?: ${bool}`)
        if (typeof bool != "boolean") return;
        if (!bool) {
            tip_wrapper.style.top = `-${height+5}px`;
        } else {
            tip_text.innerText = data.get("tip");
            tip_wrapper.style.top = `10px`;
            tip_text.text = data.get("tip");
        }
        return;
    }
    // console.log(`height: ${height}`);
    if (tip_out) {
        tip_wrapper.style.top = `-${height+5}px`;
    } else {
        tip_text.innerText = data.get("tip");
        tip_wrapper.style.top = `10px`;
        tip_text.text = data.get("tip");
    }
    data.set("tip_out", !tip_out);
}
const disable_btns = (bool)=>{
    if (typeof bool != "boolean") return;
    
    if (bool)  $("#main-wrapper")[0].style.pointerEvents = "none";
    else  $("#main-wrapper")[0].style.pointerEvents = "auto";
}
style_setters();

let menu_out = false;
let tip_moving = false;

disable_btns(true); 
setTimeout(() => { disable_btns(false); }, 1000);

document.onkeydown = (e)=>{
    if (e.key == " ") {
        data.add("money", 100);
    }
}

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
                    disable_btns(true); setTimeout(() => { disable_btns(false); }, 1000);
                }
            } else if (money >= 30) {
                data.add("tip_index");
                toggle_tip();
            }
            break;
        case 3:
            data.set("tip", "Looks like you unlocked the menu!\nOpen it by clicking the symbol under your money");
            if (money >= 40) {
                if (!data.get("tip_out")) {
                    toggle_tip();
                    data.add("tip_index");
                    disable_btns(true); setTimeout(() => { disable_btns(false); }, 1000);
                }
            }
            break;
        case 7:
            toggle_tip(false);
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
        case 4:
            toggle_tip(false);
            disable_btns(true); 
            const wait_for_transition = setTimeout(() => {
                data.set("tip", "Here you can upgrade your clicking or idling abilities!\nGo ahead, spend some money!");
                toggle_tip(true);
                data.add("tip_index");
                setTimeout(() => { disable_btns(false); }, 1000);
            }, 1000);
            break;
        case 5:
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
        case 5:
            toggle_tip(false);
            disable_btns(true); 
            // console.log("toggled false");
            const wait_for_transition = setTimeout(() => {
                data.set("tip", "Now, you can see how much money you're getting per click\n(on the main button)");
                toggle_tip(true);
                // console.log("toggled true");
                data.add("tip_index");
                setTimeout(() => { disable_btns(false); }, 1000);
            }, 1010);
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
    if (!bought) return;
    switch (data.get("tip_index")) {
        case 6:
            toggle_tip(false);
            disable_btns(true); 
            data.set("tip", "Now you can unlock multipliers.\nHow much more content is there!?");
            const wait_for_transition = setTimeout(() => {
                toggle_tip(true);
                data.add("tip_index");
                setTimeout(() => { disable_btns(false); }, 1000);
            }, 1010);
            break;
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
        if (data.get("unlocked_idle_mult") == true) {
            data.set("css_prestige_btn", "block");
            disable_btns(true); 
            if (data.get("tip_index")==7) {
                data.set("tip", "Now you can prestige.\nThis lets you restart with a bonus and unlock content!")
                toggle_tip(true);
                data.add("tip_index");
                setTimeout(() => { disable_btns(false); }, 1000);
            }
        }
        data.set("css_unlock_click_mult_btn", "none");
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
        if (data.get("unlocked_click_mult") == true) {
            data.set("css_prestige_btn", "block");
            disable_btns(true); 
            if (data.get("tip_index")==7) {
                data.set("tip", "Now you can prestige.\nThis lets you restart with a bonus and unlock content!")
                toggle_tip(true);
                data.add("tip_index");
                setTimeout(() => { disable_btns(false); }, 1000);
            }
        }
        data.set("css_unlock_idle_mult_btn", "none");
        style_setters();
    }
}
click_mult_btn.onclick = ()=>{ data.add("click_mult_lvl"); }
idle_mult_btn.onclick = ()=>{ data.add("idle_mult_lvl", 0.2); }

prestige_btn.onclick = ()=>{
    const money = data.get("money");
    const cost = data.get("prestige_cost");
    if (money >= cost) {
        data.sub("money", cost);
        window.alert("You win!... Well, kind of.\nThe prestige system hasn't been implemented yet!\nSo, for now, you win!");
    }
}

const idle_loop = setInterval(() => {
    if (data.get("per_sec") <= 0) {
        return;
    }
    const bonus = (data.get("idle_mult_lvl")/100) + 1;
    const idle_add = (data.get("per_sec") / 4) * bonus;
    data.add("money", idle_add);
}, 250);