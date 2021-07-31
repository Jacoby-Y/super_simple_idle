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


console.log(
`I have a hamster named Týr, and he's sooooo cute. He's sleeping right now, as of writing this.
I'm gonna add a tip that talks about my hamster. 
Oh, by the way, you can just click on the tip box to make it go away! I'll have to add a tip for that too`
);