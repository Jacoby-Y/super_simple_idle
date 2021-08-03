
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

if (local.can_load()) {
    data = local.load();
    data.money.round(0);
    data.per_click_display.round(2);
    data.per_sec_display.round(3);
    data.click_mult_lvl.round(1);
    data.idle_mult_lvl.round(1);
    data.prestige_cost.number_style("fmt");
}
else {
    data.money = new Gui(0); data.money.round(0);

    data.per_click_num = new Gui(2);
    data.per_click_cost = new Gui(10);
    data.per_click_lvl = 1;
    data.per_click = 1;
    data.per_click_display = new Gui(1); data.per_click_display.round(2);

    data.per_sec_num = new Gui(1);
    data.per_sec_cost = new Gui(100);
    data.per_sec_lvl = 0;
    data.per_sec = 0;
    data.per_sec_display = new Gui(0); data.per_sec_display.round(3);

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

    data.click_mult_lvl = new Gui(0);
        data.click_mult_lvl.round(1);
    data.idle_mult_lvl = new Gui(0);
        data.idle_mult_lvl.round(1);

    data.unlocked_click_mult = false;
    data.unlocked_idle_mult = false;

    data.prestige_cost = new Gui(10000);
        data.prestige_cost.number_style("fmt");
    data.prestige_lvl = 0;
}

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
//#endregion

console.log(
`I have a hamster named Týr, and he's sooooo cute. He's sleeping right now, as of writing this.
I'm gonna add a tip that talks about my hamster. 
Oh, by the way, you can just click on the tip box to make it go away! I'll have to add a tip for that too`
);