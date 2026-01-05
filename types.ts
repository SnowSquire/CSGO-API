import { configure } from "arktype/config";

configure({ onUndeclaredKey: "reject" });

import { regex, type } from "arktype";

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
    "item_name?": "string",
    "item_description?": "string",
    "item_rarity?": "string",
    "image_inventory?": "string",
    "model_player?": "string",
    "first_sale_date?": "string",
    "loot_list_name?": "string",
    "loot_list_rare_item_name?": "string",
    "loot_list_rare_item_footer?": "string",
    "image_unusual_item?": "string",
    "item_type?": "string",
    "used_by_classes?": type.Record("string", "string | number"),
    "attributes?": type.Record(
        "string",
        type("string | number").or(
            type({
                "attribute_class?": "string",
                "value?": "string | number",
            })
        )
    ),
    "tags?": type.Record(
        "string",
        type({
            "tag_value?": "string",
        })
    ),
    "associated_items?": type.Record("string", "string | number"),
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
    "patch_material?": "string",
    "tournament_event_id?": "number.integer",
    "item_rarity?": "string",
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
    "use_legacy_model?": "0 | 1",
});

const MusicDefinition = type({
    name: "string",
    loc_name: "string",
    loc_description: "string",
    image_inventory: "string",
});

const KeychainDefinition = type({
    name: "string",
    loc_name: "string",
    "loc_description?": "string",
    image_inventory: "string",
    "item_rarity?": "string",
    "is commodity?": "number.integer",
});

const PrefabDefinition = type({
    "item_name?": "string",
    "item_description?": "string",
    "first_sale_date?": "string | null",
    "prefab?": "string",
    "used_by_classes?": type.Record("string", "string | number"),
});

const ProTeamDefinition = type({
    tag: "string",
    "geo?": "string",
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
const StageDefinition = type({
    clutch_kills: "number.integer",
    pistol_kills: "number.integer",
    opening_kills: "number.integer",
    sniper_kills: "number.integer",
    KDR: "number",
    enemy_kills: "number.integer",
    deaths: "number.integer",
    matches_played: "number.integer",
});
const EventDefinition = type({
    team: "number.integer",
    "clutch_kills?": "number.integer",
    "pistol_kills?": "number.integer",
    "opening_kills?": "number.integer",
    "sniper_kills?": "number.integer",
    "KDR?": "number",
    "enemy_kills?": "number.integer",
    "deaths?": "number.integer",
    "matches_played?": "number.integer",
    "stage0?": StageDefinition,
    "stage1?": StageDefinition,
});
const ProPlayerDefinition = type({
    name: type("string | number").pipe(val => val.toString()),
    code: type("string | number").pipe(val => val.toString()),
    dob: "string",
    geo: "string",
    events: type.Record("string.integer", EventDefinition),
});

const WeaponIconDefinition = type({
    icon_path: "string",
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
    alternate_icons2: type({
        casket_icons: type.Record("string.integer", { icon_path: "string" }),
        "weapon_icons?": type.Record("string", WeaponIconDefinition),
    }),
    prefabs: type.Record("string", PrefabDefinition),
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
    revolving_loot_lists: type.Record("string.integer", "string"),
    quest_reward_loot_lists: "unknown",
    item_levels: "unknown",
    kill_eater_score_types: "unknown",
    music_definitions: type.Record("string.integer", MusicDefinition),
    quest_definitions: "unknown",
    recurring_mission_periods: "unknown",
    campaign_definitions: "unknown",
    skirmish_modes: "unknown",
    skirmish_rank_info: "unknown",
    recipes: "unknown",
    seasonaloperations: "unknown",
    pro_event_results: "unknown",
    pro_players: type.Record("string.integer", ProPlayerDefinition),
    pro_teams: type.Record("string.integer", ProTeamDefinition),
    items_game_live: "unknown",
    keychain_definitions: type.Record("string.integer", KeychainDefinition),
    highlight_reels: type.Record("string.integer", HighlightReelDefinition),
});

// Types for processed/computed state properties
export type ProcessedItem = {
    object_id: string;
    name: string;
    prefab: string;
    item_name?: string;
    item_description?: string;
    item_rarity?: string;
    item_name_prefab?: string;
    item_description_prefab?: string;
    image_inventory?: string;
    model_player?: string;
    first_sale_date?: string;
    loot_list_name?: string;
    loot_list_rare_item_name?: string;
    loot_list_rare_item_footer?: string;
    image_unusual_item?: string;
    item_type?: string;
    used_by_classes?: Record<string, string | number>;
    attributes?: Record<string, string | number | { attribute_class?: string; value?: string | number }>;
    tags?: Record<string, { tag_value?: string }>;
    associated_items?: Record<string, string | number>;
};

export type ProcessedPrefab = {
    item_name?: string;
    item_description?: string;
    first_sale_date?: string | null;
    prefab?: string;
    used_by_classes?: Record<string, string | number>;
};

export type ProcessedPaintKit = {
    description_tag: string;
    wear_remap_min: number;
    wear_remap_max: number;
    paint_index: string;
    style_id: number;
    style_name: string;
    legacy_model: boolean;
};

export type ProcessedStickerKit = ItemsGame["sticker_kits"][string] & {
    object_id: string;
};

export type ProcessedMusicDefinition = ItemsGame["music_definitions"][string] & {
    object_id: string;
    coupon_name: string;
};

export type ProcessedKeychainDefinition = ItemsGame["keychain_definitions"][string] & {
    object_id: string;
};

export type SkinItem = {
    id: string;
    name: string | { tKey?: string; weapon: string; pattern?: string };
    rarity: string;
    paint_index?: string | null;
    phase?: string | null;
    image: string;
};

export type CrateInfo = {
    id: string;
    name: string;
    image: string;
};

export type CollectionInfo = {
    id: string;
    name: string;
    image: string;
};

export type ProcessedHighlightReel = {
    id: string;
    highlight_reel: string;
    tournament_event_id: number;
    tournament_event_team0_id: number;
    tournament_event_team1_id: number;
    tournament_event_stage_id: number;
    tournament_event_map: string;
    tournament_player: string | null;
    image: string;
    image_inventory: string;
    video: string;
    thumbnail: string;
};

export type ProcessedProTeam = {
    id: number;
    tag: string;
    geo: string;
};

export type ProcessedProPlayer = {
    id: number;
    name: string;
    code: string;
    dob: string;
    geo: string;
};

import customTranslations from "./utils/translations.json" with { type: "json" };
export type CustomTranslation = keyof typeof customTranslations;
