/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/extrastats/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc Tracks additional game data in variables of your choosing
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.0
 * ----------------------------------------------------------------------------
 * Compatibility: Only tested with my CGMZ plugins.
 * Made for RPG Maker MZ 1.0.0
 * ----------------------------------------------------------------------------
 * Description: Tracks additional game data such as gold spent at shops,
 * damage taken, items used, and many more. This data is stored in variables
 * so it is easy to access in events. Turn tracking on/off any time.
 * ----------------------------------------------------------------------------
 * Documentation:
 * 
 * Stats Tracked:
 * Gold spent at shops
 * Gold earned at shops
 * Items bought from shops
 * Items sold to shops
 * Damage taken
 * Damage dealt
 * Items used
 * Gold looted from battle
 *
 * These stats are also always stored in CGMZ data separate from the in-game
 * variables. To access these values, use the following javascript in any
 * "script" command (script, command variables->script, etc):
 *
 * $cgmz.getExtraStats("itemsBought")
 * $cgmz.getExtraStats("itemsSold")
 * $cgmz.getExtraStats("itemsUsed")
 * $cgmz.getExtraStats("goldSpent")
 * $cgmz.getExtraStats("goldProfit")
 * $cgmz.getExtraStats("goldLooted")
 * $cgmz.getExtraStats("damageDealt")
 * $cgmz.getExtraStats("damageTaken")
 *
 * This can help track these stats without needing to dedicate in-game
 * variables to them as you can always look them up on the fly.
 *
 * This plugin supports the following plugin commands:
 * Initialize: This command will re-initialize all CGMZ Extra Stats data
 *             when set to true. No effect when set to false. Does not
 *             affect in-game variables, only internal CGMZ data.
 *
 * Tracking: This command will turn all tracking ON or OFF. Tracking is
 *           ON by default. When tracking is OFF, both in-game variables
 *           and internal CGMZ extra stat data is not tracked.
 *
 * @command Initialize
 * @text Initialize
 * @desc Re-initializes CGMZ extra stat data. Only call this if you know what you are doing.
 * Will reset all CGMZ extra stat data as if you started a new game.
 *
 * @arg reset
 * @type boolean
 * @text Reset
 * @desc Resets the cgmz extra stats data if true. No functionality for false.
 * @default true
 *
 * @command Tracking
 * @text Tracking
 * @desc Turns tracking of extra stats on/off
 *
 * @arg track
 * @type boolean
 * @text Track
 * @desc Turns tracking for all extra stats on/off.
 * @default true
 *
 * @param Variable Options
 *
 * @param Items Bought
 * @parent Variable Options
 * @type variable
 * @desc Variable to store items bought from shop count
 * @default 0
 *
 * @param Items Sold
 * @parent Variable Options
 * @type variable
 * @desc Variable to store items sold from shop count
 * @default 0
 *
 * @param Gold Profit
 * @parent Variable Options
 * @type variable
 * @desc Variable to store gold gained from shop sales
 * @default 0
 *
 * @param Gold Spent
 * @parent Variable Options
 * @type variable
 * @desc Variable to store gold lost from shop buy
 * @default 0
 *
 * @param Items Used
 * @parent Variable Options
 * @type variable
 * @desc Variable to store items used from menu or from battle
 * @default 0
 *
 * @param Gold Looted
 * @parent Variable Options
 * @type variable
 * @desc Variable to store gold looted from battle
 * @default 0
 *
 * @param Damage Taken
 * @parent Variable Options
 * @type variable
 * @desc Variable to store damage taken
 * @default 0
 *
 * @param Damage Dealt
 * @parent Variable Options
 * @type variable
 * @desc Variable to store damage dealt
 * @default 0
*/
var Imported = Imported || {};
Imported.CGMZ_ExtraStats = true;
var CGMZ = CGMZ || {};
CGMZ.Versions = CGMZ.Versions || {};
CGMZ.Versions["Extra Stats"] = "1.0";
CGMZ.ExtraStats = CGMZ.ExtraStats || {};
CGMZ.ExtraStats.parameters = PluginManager.parameters('CGMZ_ExtraStats');
CGMZ.ExtraStats.ItemsBought = Number(CGMZ.ExtraStats.parameters["Items Bought"]) || 0;
CGMZ.ExtraStats.ItemsSold = Number(CGMZ.ExtraStats.parameters["Items Sold"]) || 0;
CGMZ.ExtraStats.GoldProfit = Number(CGMZ.ExtraStats.parameters["Gold Profit"]) || 0;
CGMZ.ExtraStats.GoldSpent = Number(CGMZ.ExtraStats.parameters["Gold Spent"]) || 0;
CGMZ.ExtraStats.ItemsUsed = Number(CGMZ.ExtraStats.parameters["Items Used"]) || 0;
CGMZ.ExtraStats.GoldLooted = Number(CGMZ.ExtraStats.parameters["Gold Looted"]) || 0;
CGMZ.ExtraStats.DamageTaken = Number(CGMZ.ExtraStats.parameters["Damage Taken"]) || 0;
CGMZ.ExtraStats.DamageDealt = Number(CGMZ.ExtraStats.parameters["Damage Dealt"]) || 0;
//=============================================================================
// CGMZ_Temp
//-----------------------------------------------------------------------------
// Add plugin commands for CGMZ Extra Stats
//=============================================================================
//-----------------------------------------------------------------------------
// Register Plugin Commands
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_registerPluginCommands = CGMZ_Temp.prototype.registerPluginCommands;
CGMZ_Temp.prototype.registerPluginCommands = function() {
	alias_CGMZ_ExtraStats_registerPluginCommands.call(this);
	PluginManager.registerCommand("CGMZ_ExtraStats", "Initialize", this.pluginCommandExtraStatsReinitialize);
	PluginManager.registerCommand("CGMZ_ExtraStats", "Tracking", this.pluginCommandExtraStatsTracking);
};
//-----------------------------------------------------------------------------
// Reinitializes the extra stats plugin data
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandExtraStatsReinitialize = function(args) {
	$cgmz.initExtraStatsVars(args.reset === "true");
};
//-----------------------------------------------------------------------------
// Reinitializes the extra stats plugin data
//-----------------------------------------------------------------------------
CGMZ_Temp.prototype.pluginCommandExtraStatsTracking = function(args) {
	$cgmz.setExtraStatsTracking(args.track === "true");
};
//=============================================================================
// CGMZ
//-----------------------------------------------------------------------------
// Add new tracked stats to the save data
// Modifies: createPluginData
//=============================================================================
//-----------------------------------------------------------------------------
// Method used by CGMZ for creating plugin data
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_createPluginData = CGMZ_Core.prototype.createPluginData;
CGMZ_Core.prototype.createPluginData = function() {
	alias_CGMZ_ExtraStats_createPluginData.call(this);
	this.initExtraStatsVars(false);
};
//-----------------------------------------------------------------------------
// Initialize Extra Stats variables
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.initExtraStatsVars = function(reinitialize) {
	if(!this._extraStats || reinitialize) {
		this._extraStatsTracking = true;
		this._extraStats = {
			'itemsBought': 0,
			'itemsSold': 0,
			'goldProfit': 0,
			'goldSpent': 0,
			'itemsUsed': 0,
			'goldLooted': 0,
			'damageTaken': 0,
			'damageDealt': 0
		};
	}
};
//-----------------------------------------------------------------------------
// Getter for whether to track stats or not
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.isTrackingExtraStats = function() {
	return this._extraStatsTracking;
};
//-----------------------------------------------------------------------------
// Setter for whether to track stats or not
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.setExtraStatsTracking = function(tracking) {
	this._extraStatsTracking = tracking;
};
//-----------------------------------------------------------------------------
// Getter for extra stats
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.getExtraStats = function(key) {
	return this._extraStats[key];
};
//-----------------------------------------------------------------------------
// Setter for extra stats.
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.setExtraStats = function(key, num) {
	this._extraStats[key] = num;
};
//-----------------------------------------------------------------------------
// Add method for extra stats
//-----------------------------------------------------------------------------
CGMZ_Core.prototype.addExtraStats = function(key, num) {
	const value = this.getExtraStats(key);
	this.setExtraStats(key, num + value);
};
//=============================================================================
// Scene_Shop
//-----------------------------------------------------------------------------
// Automatic tracking for items bought, sold, and gold gained from sell, lost from buy
// modified functions: doBuy, doSell
//=============================================================================
//-----------------------------------------------------------------------------
// Alias: Track items bought, gold spent on items.
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_SceneShop_doBuy = Scene_Shop.prototype.doBuy;
Scene_Shop.prototype.doBuy = function(number) {
	alias_CGMZ_ExtraStats_SceneShop_doBuy.call(this, number);
	if($cgmz.isTrackingExtraStats()) {
		const oldItemBuyCount = $gameVariables.value(CGMZ.ExtraStats.ItemsBought);
		$gameVariables.setValue(CGMZ.ExtraStats.ItemsBought, oldItemBuyCount + number);
		$cgmz.addExtraStats('itemsBought', number);
		const oldSpentCount = $gameVariables.value(CGMZ.ExtraStats.GoldSpent);
		const amount = number * this.buyingPrice();
		$gameVariables.setValue(CGMZ.ExtraStats.GoldSpent, oldSpentCount + amount);
		$cgmz.addExtraStats("goldSpent", amount);
	}
};
//-----------------------------------------------------------------------------
// Alias: Track items sold, gold gained from sale
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_SceneShop_doSell = Scene_Shop.prototype.doSell;
Scene_Shop.prototype.doSell = function(number) {
	alias_CGMZ_ExtraStats_SceneShop_doSell.call(this, number);
	if($cgmz.isTrackingExtraStats()) {
		const oldItemSellCount = $gameVariables.value(CGMZ.ExtraStats.ItemsSold);
		$gameVariables.setValue(CGMZ.ExtraStats.ItemsSold, oldItemSellCount + number);
		$cgmz.addExtraStats("itemsSold", number);
		const oldProfitCount = $gameVariables.value(CGMZ.ExtraStats.GoldProfit);
		const amount = number * this.sellingPrice();
		$gameVariables.setValue(CGMZ.ExtraStats.GoldProfit, oldProfitCount + amount);
		$cgmz.addExtraStats("goldProfit", amount);
	}
};
//=============================================================================
// Game_Party
//-----------------------------------------------------------------------------
// Automatic tracking for items used
// modified functions: consumeItem
//=============================================================================
//-----------------------------------------------------------------------------
// Alias: Track items used
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_GameParty_consumeItem = Game_Party.prototype.consumeItem;
Game_Party.prototype.consumeItem = function(item) {
	alias_CGMZ_ExtraStats_GameParty_consumeItem.call(this, item);
	if(DataManager.isItem(item) && $cgmz.isTrackingExtraStats()) {
		const oldItemsUsed = $gameVariables.value(CGMZ.ExtraStats.ItemsUsed);
		$gameVariables.setValue(CGMZ.ExtraStats.ItemsUsed, oldItemsUsed + 1);
		$cgmz.addExtraStats("itemsUsed", 1);
	}
};
//=============================================================================
// BattleManager
//-----------------------------------------------------------------------------
// Automatic tracking for gold looted from battle
// modified functions: gainGold
//=============================================================================
//-----------------------------------------------------------------------------
// Alias: Track gold looted
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_BattleManager_gainGold = BattleManager.gainGold;
BattleManager.gainGold = function() {
    alias_CGMZ_ExtraStats_BattleManager_gainGold.call(this);
	if($cgmz.isTrackingExtraStats()) {
		const oldGoldLooted = $gameVariables.value(CGMZ.ExtraStats.GoldLooted);
		$gameVariables.setValue(CGMZ.ExtraStats.GoldLooted, oldGoldLooted + this._rewards.gold);
		$cgmz.addExtraStats("goldLooted", this._rewards.gold);
	}
};
//=============================================================================
// Game_Action
//-----------------------------------------------------------------------------
// Automatic tracking for damage taken/dealt
// modified functions: executeDamage
//=============================================================================
//-----------------------------------------------------------------------------
// Alias: Track damage taken/dealt
//-----------------------------------------------------------------------------
const alias_CGMZ_ExtraStats_GameAction_executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value) {
	alias_CGMZ_ExtraStats_GameAction_executeHpDamage.call(this, target, value);
    if(target.isActor() && value > 0 && $cgmz.isTrackingExtraStats()) {
		const oldDamageTaken = $gameVariables.value(CGMZ.ExtraStats.DamageTaken);
		$gameVariables.setValue(CGMZ.ExtraStats.DamageTaken, oldDamageTaken + value);
		$cgmz.addExtraStats("damageTaken", value);
	}
	else if(target.isEnemy() && value > 0 && $cgmz.isTrackingExtraStats()) {
		const oldDamageDealt = $gameVariables.value(CGMZ.ExtraStats.DamageDealt);
		$gameVariables.setValue(CGMZ.ExtraStats.DamageDealt, oldDamageDealt + value);
		$cgmz.addExtraStats("damageDealt", value);
	}
};