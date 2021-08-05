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

style_setters();

let menu_out = false;
let debounce = false;

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

    if (!isNaN(e.key) && e.key != ' ')  data.money += parseInt(e.key) * 100

    switch (e.key) {
        case "c":
            console.clear();
            break;
        case "C":
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

main_btn.onclick = ()=>{
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.css.money = "inline-block"
    const bonus = (data.click_mult_lvl/100) + 1;
    const money_add = (data.per_click * bonus) * (data.prestige_lvl * 0.5 + 1);
    data.money += money_add;
    const money = data.money;

    if (money >= 40) {
        data.css.menu_btn = "block";
    }
    if (money > 0) {
        data.css.money = "block";
    } 

    switch (data.tip_index) {
        case 1:
            toggle_tip();
            data.tip_index++;
            break;
        case 2:
            data.tip = tips[2];
            if (money >= 5 && money < 30) {
                if (!data.tip_out) {
                    toggle_tip();
                    disable_btns(true); setTimeout(() => { disable_btns(false); }, 1000);
                }
            } else if (money >= 30) {
                data.tip_index++;
                toggle_tip();
            }
            break;
        case 3:
            data.tip = tips[3];
            if (money >= 40) {
                if (!data.tip_out) {
                    toggle_tip();
                    data.tip_index++;
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

    if (data.tip_index == 1) {
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

    switch (data.tip_index) {
        case 4:
            toggle_tip(false);
            disable_btns(true); 
            const wait_for_transition = setTimeout(() => {
                data.tip = tips[4];
                toggle_tip(true);
                data.tip_index++;
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
    if (data.money < data.per_click_cost) return;
    data.css.per_click_info = "block";
    data.css.per_sec_upg_btn = "block";

    data.money -= data.per_click_cost;
    data.per_click = data.per_click_num;
    const new_cost = data.per_click_cost + (10*data.per_click_lvl);
    data.per_click_cost = new_cost;
    data.per_click_num++;
    data.per_click_lvl++;
    
    style_setters();

    switch (data.tip_index) {
        case 5:
            toggle_tip(false);
            disable_btns(true); 
            // console.log("toggled false");
            const wait_for_transition = setTimeout(() => {
                data.tip = tips[5];
                toggle_tip(true);
                // console.log("toggled true");
                data.tip_index++;
                setTimeout(() => { disable_btns(false); }, 1000);
            }, 1010);
            break;
        default:
            break;
    }
}
per_sec_upg.onclick = ()=>{
    if (data.money >= data.per_sec_cost) {
        data.money -= data.per_sec_cost;
        data.per_sec = data.per_sec_num;
        let new_cost = data.per_sec_cost + (15*data.per_sec_lvl);
        data.per_sec_cost = new_cost;
        data.per_sec_num++;
        data.per_sec_lvl++;
    }
    if (data.per_sec_lvl === 1) {
        data.css.per_sec_info = "block";
        data.css.unlock_click_mult_btn = "block";
        data.css.unlock_idle_mult_btn = "block";
        style_setters();
    }
    if (data.per_sec!=1) return;
    switch (data.tip_index) {
        case 6:
            toggle_tip(false);
            disable_btns(true); 
            data.tip = tips[6];
            const wait_for_transition = setTimeout(() => {
                toggle_tip(true);
                data.tip_index++;
                setTimeout(() => { disable_btns(false); }, 1000);
            }, 1010);
            break;
    }
}
unlock_click_mult_btn.onclick = ()=>{
    if (data.unlocked_click_mult == true) {
        return;
    }
    const money = data.money;
    if (money >= 2500) {
        data.money -= 2500;
        unlock_click_mult_btn.style = "none";
        data.unlocked_click_mult = true;
        data.css.click_mult_btn = "block";
        if (data.tip_index==7 && data.unlocked_idle_mult) {
            data.css.prestige_btn = "block";
            disable_btns(true); 
            data.tip = tips[7];
            data.tip_index++;
            toggle_tip(true);
            setTimeout(() => { disable_btns(false);}, 1000);
        }
        data.css.unlock_click_mult_btn = "none";
        style_setters();
    }
}
unlock_idle_mult_btn.onclick = ()=>{
    if (data.unlocked_idle_mult == true) {
        return;
    }
    const money = data.money;
    if (money >= 2500) {
        data.money -= 2500;
        unlock_idle_mult_btn.style = "none";
        data.unlocked_idle_mult = true;
        data.css.idle_mult_btn = "block";
        if (data.tip_index==7 && data.unlocked_click_mult) {
            data.css.prestige_btn = "block";
            disable_btns(true); 
            data.tip = tips[7];
            data.tip_index++;
            toggle_tip(true);
            setTimeout(() => { disable_btns(false);}, 1000);
        }
        data.css.unlock_idle_mult_btn = "none";
        style_setters();
    }
}
click_mult_btn.onclick = ()=>{ 
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.click_mult_lvl = data.click_mult_lvl + 1;
    data.per_click = data.per_click;
}
idle_mult_btn.onclick = ()=>{ 
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.idle_mult_lvl += 0.2; 
    data.per_sec = data.per_sec;
}

prestige_btn.onclick = ()=>{
    if (data.money < data.prestige_cost) return;
    prestige_poppup.css("display", "block");
}
const do_prestige = ()=>{
    data.prestige_lvl++;
    data.money = 0;

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
        prestige_btn: "none"
    }

    data.click_mult_lvl = 0;
    data.idle_mult_lvl = 0;

    data.prestige_cost = data.prestige_cost*1.5;

    data.offline = 0;

    data.unlocked_click_mult = false;
    data.unlocked_idle_mult = false;

    local.store();

    location.reload();
}

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
    const bonus = data.idle_mult_lvl + 1;
    const idle_add = ((data.per_sec * (data.prestige_lvl * 0.5 + 1)) * bonus) / 4 ;
    data.money = data.money + idle_add;
}, 250);