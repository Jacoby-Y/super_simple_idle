const tips = [
    // 0
    "None",
    // 1
    "Hello, and welcome to my game!\nYou can start out by clicking that blue button.",
    // 2
    "The more you progress the game, the more content shows itself",
    // 3
    "Looks like you unlocked the menu!\nOpen it by clicking the symbol under your money",
    // 4
    "Here you can upgrade your clicking or idling abilities!\nGo ahead, spend some money!",
    // 5
    "Now, you can see how much money you're getting per click\n(on the main button)",
    // 6
    "Now you can unlock multipliers.\nHow much more content is there!?",
    // 7
    "Now you can prestige.\nThis lets you restart with a bonus and unlock content!",

];

//#region DOM Objects
const main_wrapper = $("#main-wrapper")[0];
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
const poppups = $(".poppup");
const prestige_poppup = $(".poppup").eq(0);
const offline_poppup = $(".poppup").eq(1);
//#endregion

data.settings = {
    money: {round: 0},
    prestige_lvl: {display(val){
        if (val > 0) {
            return `Prestige bonus: +${val * 50}%`
        }
        return '';
    }},
    click_mult_lvl: {round: 1},
    idle_mult_lvl: {round: 1},
    prestige_cost: {display(val){return Number(val).toLocaleString("en-US")}},
    css: {skip: true},
}
if (local.can_load()) {
    local.load(data);

    const ellapsed = Math.round(Date.now()/1000) - data.offline_date;
    if (ellapsed > 5 && data.per_sec > 0) {
        // const bonus = data.idle_mult_lvl + 1;
        // const idle_add = (data.per_sec * bonus);
        // const total = ellapsed * idle_add;
        const total = data.settings.per_sec.display(data.per_sec);
        data.offline = total * ellapsed;
        data.money += data.offline;
        offline_poppup.css("display", "block");

        console.log(`ellapsed: ${ellapsed}, money made: ${total}`);
    }
}
else {
    console.log("init");
    data.money = 0;

    data.per_click_num = 2;
    data.per_click_cost = 10;
    data.per_click_lvl = 1;
    data.per_click = 1;
    
    data.per_sec_num = 1;
    data.per_sec_cost = 100;
    data.per_sec_lvl = 0;
    data.per_sec = 0;

    data.tip = tips[1];
    data.tip_index = 1;
    data.tip_out = true;

    data.css = {
        per_click_info: "none",
        per_sec_info: "none",
        money: "none",
        menu_btn: "none",
        per_sec_upg_btn: "none",
        click_mult_btn: "none",
        idle_mult_btn: "none",
        unlock_click_mult_btn: "none",
        unlock_idle_mult_btn: "none",
        prestige_btn: "none"
    }

    data.click_mult_lvl = 0;
    data.idle_mult_lvl = 0;

    data.unlocked_click_mult = false;
    data.unlocked_idle_mult = false;

    data.prestige_cost = 10000;
    data.prestige_lvl = 0;

    data.offline = 0;
    data.offline_date = Math.round(Date.now()/1000);
}

data.settings = {
    per_click: {display(val) {
        const bonus = (data.click_mult_lvl/100) + 1;
        const money_add = (val * bonus) * (data.prestige_lvl * 0.5 + 1);
        console.log(`(display) money_add: ${money_add}`);
        return money_add;
    }},
    per_sec: {display(val) {
        const bonus = data.idle_mult_lvl + 1;
        const idle_add = ((val * (data.prestige_lvl * 0.5 + 1)) * bonus);
        return idle_add;
    }},
    ...data.settings
}
local.update_gui(data, data);

console.log(
`I have a hamster named Týr, and he's sooooo cute. He's sleeping right now, as of writing this.
I'm gonna add a tip that talks about my hamster. 
Oh, by the way, you can just click on the tip box to make it go away! I'll have to add a tip for that too`
);