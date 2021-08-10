tip_text.innerText = data.tip;

const style_setters = ()=>{
    money_txt.style.display = data.css.money;
    menu_btn.style.display = data.css.menu_btn;
    per_click_info.style.display = data.css.per_click_info;
    per_sec_info.style.display = data.css.per_sec_info;
    per_sec_upg.style.display = data.css.per_sec_upg_btn;
    click_mult_btn.style.display = data.css.click_mult_btn;
    idle_mult_btn.style.display = data.css.idle_mult_btn;

    unlock_click_mult_btn.style.display = data.css.unlock_click_mult_btn;
    unlock_idle_mult_btn.style.display = data.css.unlock_idle_mult_btn;

    prestige_btn.style.display = data.css.prestige_btn;
    pres_menu_btn.style.display = data.css.prestige_menu_btn;
}
const toggle_tip = (bool="default")=>{
    const height = tip_wrapper.clientHeight;
    const tip_out = data.tip_out;
    if (bool != "default") {
        // console.log(`manually changing! tip out?: ${bool}`)
        if (typeof bool != "boolean") return;
        if (!bool) {
            tip_wrapper.style.top = `-${height+5}px`;
        } else {
            tip_text.innerText = data.tip;
            tip_wrapper.style.top = `10px`;
            tip_text.text = data.tip;
        }
        return;
    }
    // console.log(`height: ${height}`);
    if (tip_out) {
        tip_wrapper.style.top = `-${height+5}px`;
    } else {
        tip_text.innerText = data.tip;
        tip_wrapper.style.top = `10px`;
        tip_text.text = data.tip;
    }
    data.tip_out = !data.tip_out;
}
const disable_btns = (bool)=>{
    if (typeof bool != "boolean") return;
    
    if (bool)  $("#main-wrapper")[0].style.pointerEvents = "none";
    else  $("#main-wrapper")[0].style.pointerEvents = "auto";
}
const close_poppup = ()=>{
    poppups.css("display", "none");
}
const do_prestige = ()=>{

    data.prestige_lvl++;
    const points = data.calc_points;
    data.prestige_points += points;
    data.money = data.prest2_total;

    data.per_click_num = 2;
    data.per_click_cost = 10;
    data.per_click_lvl = 1;
    data.per_click = 1;

    data.per_sec_num = 1;
    data.per_sec_cost = 100;
    data.per_sec_lvl = 0;
    data.per_sec = 0;

    data.css = {
        per_click_info: "block",
        per_sec_info: "block",
        money: "block",
        menu_btn: "block",
        per_sec_upg_btn: "block",
        click_mult_btn: "none",
        idle_mult_btn: "none",
        unlock_click_mult_btn: "none",
        unlock_idle_mult_btn: "none",
        prestige_btn: "none",
        prestige_menu_btn: "block",
    }

    data.click_mult_lvl = 0;
    data.idle_mult_lvl = 0;

    data.prestige_cost = data.prestige_cost*1.5;

    data.offline = 0;

    data.unlocked_click_mult = false;
    data.unlocked_idle_mult = false;


    local.store();
    style_setters();
    close_poppup();
    // location.reload(); //-! uncomment
}

style_setters();

disable_btns(true); 
setTimeout(() => { disable_btns(false); }, 1000);

if (local.can_load()) {
    toggle_tip(false);
} else {
    toggle_tip(true);
}

//? Debugging purposes!
document.onkeydown = (e)=>{
    if (e.key == "s") {
        console.log("Saved data!"); 
        local.store();
    }
    if (window.location.hostname != "127.0.0.1") {return;}

    if (!isNaN(e.key) && e.key != ' ')  data.money *= parseInt(e.key)

    switch (e.key) {
        case "c":
            console.clear();
            break;
        case "v":
            localStorage.removeItem("data");
            location.reload();
            break;
        case "r":
            location.reload();
            break;
        case "l":
            console.log("Loaded data!");
            local.get();
            break;
        case "a":
            main_btn.onclick();
            break;
    }
}

tip_wrapper.onclick = ()=>toggle_tip(false);

let errored = false;

let idle_index = 0;
const idle_loop = setInterval(() => {
    if (idle_index == 20) {
        data.offline_date = Math.round(Date.now()/1000);
        local.store();
        idle_index=0;
    }
    idle_index++;
    if (data.per_sec <= 0) {
        return;
    }
    const persec = data.settings.per_sec;
    if (persec != undefined)
        data.money += persec.display(data.per_sec)/4;
    else {
        if (!errored) {
            console.warn("data.settings.per_sec undefined!");
            console.log("data.settings:", data.settings);
        }
        errored = true;
    }
}, 250);