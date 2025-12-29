import { configure } from "arktype/config";

configure({ onUndeclaredKey: "reject" });

import { regex, type } from "arktype";
import { number } from "arktype/internal/keywords/number.ts";
export type ItemStringThingy = typeof ItemStringThingy.infer;
const ItemStringThingy = regex("^[.*].*$");
const hexColor = regex("^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$");
const numToBoolean = type("1 | 0");
export type ItemsGame = typeof ItemsGame.infer;
const RarityDefinition = type({
    value: "number.integer",
    loc_key: "string",
    loc_key_weapon: "string",
    loc_key_character: "string",
    color: "string",
    "weight?": "number.integer",
    "drop_sound?": "string",
});
const QualityDefinition = type({
    value: "number.integer",
    weight: "number.integer",
    hexColor: hexColor,
});
const ColorDefinition = type({
    color_name: "string",
    hex_color: hexColor,
});
const GraffitiTintDefinition = type({
    id: "number.integer",
    hex_color: hexColor,
});
const ItemDefinition = type({
    name: "string",
    prefab: "string",
    "item_quality?": "string",
    "baseitem?": "number.integer",
    "flexible_loadout_slot?": "string",
    "flexible_loadout_default?": "number.integer",
    "item_shares_equip_slot?": "number.integer",
});
const AttributeDefinition = type({
    name: "string",
    attribute_class: "string",
    description_format: "string",
    "description_string?": "string",
    "hidden?": numToBoolean,
    effect_type: "'positive' | 'neutral' | 'negative'",
    "stored_as_integer?": type("'float_floor_to_integer' | 'bytestring'").or(numToBoolean),
});
const StickerKitDefinition = type({
    name: "string",
    item_name: "string",
    description_string: "string",
    "sticker_material?": "string",
    "tournament_event_id?": "number.integer",
});
const PaintKitDefinition = type({
    name: "string",
    "item_name?": "string",
    "description_string?": "string",
    "description_tag?": "string",
    "wear_gradient?": "string",
    "wear_default?": "0 <= number <= 1",
    "wear_remap_min?": "0 <= number <= 1",
    "wear_remap_max?": "0 <= number <= 1",
    "seed?": "number.integer",
    "style?": "number.integer",
});

const ClientLootList = type({
    "match_highlight_reel_keychain?": "string",
    "contains_stickers_representing_organizations?": "number.integer",
}).merge(type.Record(ItemStringThingy, "1"));

const HighlightReelDefinition = type({
    id: "string",
    "tournament event id": "number.integer",
    "tournament event stage id": "number.integer",
    map: "string",
    "tournament event team0 id": "number.integer",
    "tournament event team1 id": "number.integer",
});
const ItemSetDefinition = type({
    name: "string",
    "name_force?": "string",
    set_description: "string",
    is_collection: numToBoolean,
    items: type.Record(ItemStringThingy, "1"),
    "unusuals?": {
        unique: "string",
    },
});

export const ItemsGame = type({
    game_info: {
        first_valid_class: "number.integer >= 0",
        last_valid_class: "number.integer >= 0",
        first_valid_item_slot: "number.integer >= 0",
        last_valid_item_slot: "number.integer >= 0",
        num_item_presets: "number.integer >= 0",
        max_num_stickers: "number.integer >= 0",
        max_num_patches: "number.integer >= 0",
    },
    rarities: type.Record("string", RarityDefinition),
    qualities: type.Record("string", QualityDefinition),
    colors: type.Record("string", ColorDefinition),
    graffiti_tints: type.Record("string", GraffitiTintDefinition),
    player_loadout_slots: type.Record("string.integer", "string"),
    alternate_icons2: type({ casket_icons: type.Record("string.integer", { icon_path: "string" }) }),
    prefabs: "unknown",
    items: type.Record("string.integer", ItemDefinition),
    attributes: type.Record("string.integer", AttributeDefinition),
    sticker_kits: type.Record("string.integer", StickerKitDefinition),
    paint_kits: type.Record("string.integer", PaintKitDefinition),
    paint_kits_rarity: type.Record(
        "string",
        "'common' | 'uncommon' | 'rare' | 'mythical' | 'legendary' | 'ancient' | 'immortal'"
    ),
    item_sets: type.Record("string", ItemSetDefinition),
    client_loot_lists: type.Record("string", ClientLootList),
    revolving_loot_lists: "unknown",
    quest_reward_loot_lists: "unknown",
    item_levels: "unknown",
    kill_eater_score_types: "unknown",
    music_definitions: "unknown",
    quest_definitions: "unknown",
    recurring_mission_periods: "unknown",
    campaign_definitions: "unknown",
    skirmish_modes: "unknown",
    skirmish_rank_info: "unknown",
    recipes: "unknown",
    seasonaloperations: "unknown",
    pro_event_results: "unknown",
    pro_players: "unknown",
    pro_teams: "unknown",
    items_game_live: "unknown",
    keychain_definitions: "unknown",
    highlight_reels: type.Record("string.integer", HighlightReelDefinition),
});
