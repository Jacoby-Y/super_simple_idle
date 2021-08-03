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
const do_prestige = ()=>{
    
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

    if (!isNaN(e.key))  data.money += parseInt(e.key) * 100;

    switch (e.key) {
        case "c":
            console.clear();
            break;
        case "C":
            localStorage.clear();
            console.log(localStorage);
            break;
        case "r":
            location.reload();
            break;
        case "l":
            console.log("Loaded data!");
            local.get();
            break;
        case "s":
            console.log("Saved data!");
            local.store();
            break;
        default:
            break;
    }
}

tip_wrapper.onclick = ()=>toggle_tip(false);

main_btn.onclick = ()=>{
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.css.money = "inline-block"
    const bonus = (data.click_mult_lvl/100) + 1;
    const money_add = data.per_click * bonus;
    // console.log(`bonus: ${bonus}, total add: ${money_add}`);
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
    data.css.per_click_info = "block";
    data.css.per_sec_upg_btn = "block";
    if (data.money >= data.per_click_cost) {
        data.money -= data.per_click_cost;
        data.per_click = data.per_click_num.value;
        const new_cost = data.per_click_cost.value + (10*data.per_click_lvl);
        data.per_click_cost = new_cost;
        data.per_click_num++;
        data.per_click_lvl++;
        data.per_click_display++;
    }
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
        data.per_sec = data.per_sec_num.value;
        let new_cost = data.per_sec_cost.value + (15*data.per_sec_lvl);
        data.per_sec_cost = new_cost;
        data.per_sec_num++;
        data.per_sec_lvl++;
        data.per_sec_display++;
    }
    if (data.per_sec_lvl.value === 1) {}
        data.css.per_sec_info = "block";
        data.css.unlock_click_mult_btn = "block";
        data.css.unlock_idle_mult_btn = "block";
        style_setters();
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
        data.css.prestige_btn = "block";
        if (data.tip_index==7) {
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
        data.css.prestige_btn = "block";
        if (data.tip_index==7) {
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
    const bonus = (data.click_mult_lvl.value / 100) + 1;
    const money_add = data.per_click * bonus;
    data.per_click_display = money_add;
}
idle_mult_btn.onclick = ()=>{ 
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.idle_mult_lvl += 0.2; 
    const bonus = (data.idle_mult_lvl / 100) + 1;
    const idle_add = data.per_sec * bonus; //-! remember: only +(per_sec*0.002) per
    // console.log(`idle_add: ${idle_add}`);
    data.per_sec_display = idle_add;
}

prestige_btn.onclick = ()=>{
    if (data.money.value >= data.prestige_cost.value) {
        data.money -= data.prestige_cost.value;
        window.alert("You win!... Well, kind of.\nThe prestige system hasn't been implemented yet!\nSo, for now, you win!");
    }
}

const idle_loop = setInterval(() => {
    if (data.per_sec <= 0) {
        return;
    }
    const bonus = data.idle_mult_lvl.value + 1;
    const idle_add = (data.per_sec * bonus) / 4;
    data.money = data.money.value + idle_add;
}, 250);