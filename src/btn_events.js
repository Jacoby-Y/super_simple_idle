let menu_out = false;
let pres_menu_out = false;
let debounce = false;

main_btn.onclick = ()=>{
    if (debounce) return; debounce = true; setTimeout(() => {  debounce = false;  }, 100);
    data.css.money = "inline-block"
    const money_add = data.settings.per_click.display(data.per_click);
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
    const menu_width = menu_wrapper.clientWidth;
    if (menu_out) menu_wrapper.style.left = `-${menu_width+4}px`;
    else menu_wrapper.style.left = "0";
    
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
    const cost = data.per_click_cost - (data.per_click_cost*(data.prest3_total/100))
    if (data.money < cost) return;
    data.css.per_click_info = "block";
    data.css.per_sec_upg_btn = "block";

    data.money -= cost;
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
    const cost = data.per_sec_cost - (data.per_sec_cost*(data.prest4_total/100))
    if (data.money >= cost) {
        data.money -= cost;
        data.per_sec = data.per_sec_num;
        let new_cost = data.per_sec_cost + (15*(data.per_sec_lvl+1));
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
        if (data.unlocked_idle_mult) data.css.prestige_btn = "block";
        if (data.css.prestige_btn == "block" && data.tip_index == 7) {
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
        if (data.unlocked_click_mult) data.css.prestige_btn = "block";
        if (data.css.prestige_btn == "block" && data.tip_index == 7) {
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
    const points = calc_points();
    data.calc_points = points;
}
pres_menu_btn.onclick = ()=>{
    const menu_width = pres_menu[0].clientWidth;
    const move = menu_width+6;
    if (!pres_menu_out) {
        github_link.css("right", `${move+github_link[0].clientWidth-22}px`);
        pres_menu.css("right", "0px");
    }
    else {
        github_link.css("right", `10px`);
        pres_menu.css("right", `-${move}px`);
    }
    pres_menu_out = !pres_menu_out;
    
}

// Extra Prestige Bonus
prest_upgrades[0].onclick = ()=>{
    if (data.prestige_points >= data.prest1_cost) {
        data.prestige_points -= data.prest1_cost;
        data.prest1_cost += 1;
        data.prest1_total += 1;
        data.prestige_lvl = data.prestige_lvl;
    }
}
// Starting Money
prest_upgrades[1].onclick = ()=>{
    if (data.prestige_points >= data.prest2_cost) {
        data.prestige_points -= data.prest2_cost;
        data.prest2_total += 10;
    }
}
// Cheaper Per Click
prest_upgrades[2].onclick = ()=>{
    if (data.prestige_points >= data.prest3_cost && data.prest3_total <= 50) {
        data.prestige_points -= data.prest3_cost;
        data.prest3_cost = Math.round(data.prest3_cost * 1.2);
        data.prest3_total += 1;
        data.per_click_cost = data.per_click_cost;
    }
}
// Cheaper Per Sec
prest_upgrades[3].onclick = ()=>{
    if (data.prestige_points >= data.prest4_cost && data.prest4_total <= 50) {
        data.prestige_points -= data.prest4_cost;
        data.prest4_cost = Math.round(data.prest4_cost * 1.2);
        data.prest4_total += 1;
        data.per_sec_cost = data.per_sec_cost;
    }
}