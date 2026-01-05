import { configure } from "arktype/config";

configure({ onUndeclaredKey: "reject" });

import { regex, type } from "arktype";

export type ItemStringThingy = typeof ItemStringThingy.infer;
const ItemStringThingy = regex("^[.*].*$");
const hexColor = regex("^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$");
const numToBoolean = type("1 | 0");
export type ItemsGame = typeof ItemsGame.infer;
const RarityDefinition = type({
    "+": "reject",
    value: "number.integer",
    loc_key: "string",
    loc_key_weapon: "string",
    loc_key_character: "string",
    color: "string",
    "weight?": "number.integer",
    "drop_sound?": "string",
    "next_rarity?": "string",
});
const QualityDefinition = type({
    "+": "reject",
    value: "number.integer",
    weight: "number.integer",
    hexColor: hexColor,
});
const ColorDefinition = type({
    "+": "reject",
    color_name: "string",
    hex_color: hexColor,
});
const GraffitiTintDefinition = type({
    "+": "reject",
    id: "number.integer",
    hex_color: hexColor,
});

const PaintMaterialDefinition = type("unknown");
const ItemDefinition = type({
    "+": "reject",
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
    "will_produce_stattrak?": numToBoolean,
    "image_inventory^volatile?": "string",
    "model_ag2?": "string",
    "stickers?": "string",
    "inventory_image_data?": {
        "+": "reject",
        "pose_sequence?": "string",
        "camera_angles?": "string", // 3 floats separated by spaces
        "camera_offset?": "string", // 3 floats separated by spaces
        "spot_light_key?": {
            "+": "reject",
            position: "string", // 3 floats separated by spaces
            color: "string", // 3 floats separated by spaces
            lookat: "string", // 3 floats separated by spaces
            inner_cone: "number",
            outer_cone: "number",
        },
        "point_light_accent?": {
            "+": "reject",
            position: "string", // 3 floats separated by spaces
            color: "string", // 3 floats separated by spaces
        },
    },
    "legacy_character?": numToBoolean,
    "tool?": {
        "+": "reject",
        "restriction?": "string",
        "type?": "string",
        "use_string?": "string",
        "usage?": type("string").or(type("unknown")),
        "usage_capabilities?": type.Record("string", numToBoolean),
    },
    "vo_prefix?": "string",
    "default_defeat?": "string",
    "default_cheer?": "string",
    "map_name?": "string",
    "model_world?": "string",
    "min_ilevel?": "number.integer",
    "max_ilevel?": "number.integer",
    "capabilities?": type.Record("string", numToBoolean),
    "item_type_name?": "string",
    "inv_container_and_tools?": "string",
    "inv_graphic_art?": "string",
    "flexible_loadout_category?": "string",
    "flexible_loadout_group?": "string",
    "item_gear_slot?": "string",
    "item_gear_slot_position?": "0 | 1 | 2| 3 | 4",
    "paint_data?": type.Record("string", PaintMaterialDefinition),
    "icon_default_image?": "string",
    "item_class?": "string",
    "anim_class?": "string",
    "used_by_classes?": type.Record("string", "string | number"),
    "attributes?": type.Record(
        "string",
        type("string | number").or(
            type({
                "+": "reject",
                "attribute_class?": "string",
                "value?": "string | number",
            })
        )
    ),
    "tags?": type.Record(
        "string",
        type({
            "+": "reject",
            "tag_value?": "string",
            "tag_text?": "string",
            "tag_group?": "string",
            "tag_group_text?": "string",
        })
    ),
    "associated_items?": type.Record("string", "string | number"),
});
const AttributeDefinition = type({
    "+": "reject",
    name: "string",
    attribute_class: "string",
    description_format: "string",
    "description_string?": "string",
    "hidden?": numToBoolean,
    effect_type: "'positive' | 'neutral' | 'negative'",
    "stored_as_integer?": type("'float_floor_to_integer' | 'bytestring'").or(numToBoolean),
    "attribute_type?": "string",
    "score?": "number.integer",
    "group?": "string",
});
const StickerKitDefinition = type({
    "+": "reject",
    name: "string",
    item_name: "string",
    description_string: "string",
    "sticker_material?": "string",
    "patch_material?": "string",
    "tournament_event_id?": "number.integer",
    "tournament_team_id?": "number.integer",
    "tournament_player_id?": "number.integer",
    "item_rarity?": "string",
});
const PaintKitDefinition = type({
    "+": "reject",
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
    "composite_material_path?": "string",
    "view_model_exponent_override_size?": "number",
    "same_name_family_aggregate?": "string",
    "vmt_path?": "string",
    "vmt_overrides?": type("unknown"),
});

const MusicDefinition = type({
    "+": "reject",
    name: "string",
    loc_name: "string",
    loc_description: "string",
    image_inventory: "string",
    "pedestal_display_model?": "string",
    "image_tooltip?": "string",
});

const KeychainDefinition = type({
    "+": "reject",
    name: "string",
    loc_name: "string",
    "loc_description?": "string",
    image_inventory: "string",
    "item_rarity?": "string",
    "is commodity?": "number.integer",
    "pedestal_display_model?": "string",
    "display_seed?": "number.integer",
    "keychain_material?": "string",
    "item_quality?": "string",
    "tags?": type.Record(
        "string",
        type({
            "+": "reject",
            "tag_value?": "string",
            "tag_text?": "string",
            "tag_group?": "string",
            "tag_group_text?": "string",
        })
    ),
});

const PrefabDefinition = type({
    "+": "reject",
    "name?": "string",
    "item_name?": "string",
    "item_description?": "string",
    "first_sale_date?": "string | null",
    "prefab?": "string",
    "used_by_classes?": type.Record("string", "string | number"),
    "inv_graphic_art?": "string",
    "item_slot2?": "string",
    "item_sub_position2?": "string",
    "tool?": {
        "+": "reject",
        "type?": "string",
        "usage_capabilities?": type.Record("string", numToBoolean),
        "use_string?": "string",
    },
    "tags?": type.Record(
        "string",
        type({
            "+": "reject",
            "tag_value?": "string",
            "tag_text?": "string",
            "tag_group?": "string",
            "tag_group_text?": "string",
        })
    ),
    "attributes?": type.Record(
        "string",
        type({
            "+": "reject",
            "force_gc_to_generate?": numToBoolean,
            value: "number",
            attribute_class: "string",
            "use_custom_logic?": "string",
        })
            .or("number")
            .or("string")
    ),
    "drop_sound?": "string",
    "mouse_pressed_sound?": "string",
    "inventory_image_section?": "string",
    "inv_container_and_tools?": "string",
    "min_ilevel?": "number.integer",
    "max_ilevel?": "number.integer",
    "image_inventory?": "string",
    "image_inventory_size_w?": "number.integer",
    "image_inventory_size_h?": "number.integer",
    "image_unusual_item?": "string",
    "loot_list_rare_item_name?": "string",
    "loot_list_rare_item_footer?": "string",
    "item_rarity?": "string",
    "item_quality?": "string",
    "item_class?": "string",
    "item_type?": "string",
    "item_type_name?": "string",
    "icon_default_image?": "string",
    "capabilities?": type.Record("string", numToBoolean),
    "flexible_loadout_category?": "string",
    "flexible_loadout_group?": "string",
    "flexible_loadout_slot?": "string",
    "legacy_character?": numToBoolean,
    "inventory_image_data?": "unknown",
    "inv_group_equipment?": "string",
    "model_ag2?": "string",
    "model_world?": "string",
    "model_player?": "string",
    "anim_class?": "string",
    "craft_class?": "string",
    "craft_material_type?": "string",
    "inv_display_slot?": "string",
    "taxonomy?": type("string").or(type("unknown")),
    "armory_desc?": "string",
    "associated_item?": type("string | number"),
    "paint_data?": type.Record("string", PaintMaterialDefinition),
    "visuals?": {
        "+": "reject",
        "weapon_type?": "string",
        "player_animation_extension?": "string",
        "grenade_smoke_color?": "string",
        "primary_ammo?": "string",
        "secondary_ammo?": "string",
        "sound_single_shot?": "string",
        "sound_single_shot_accurate?": "string",
        "sound_empty?": "string",
        "sound_burst?": "string",
        "sound_special1?": "string",
        "sound_special2?": "string",
        "sound_special3?": "string",
        "sound_nearlyempty?": "string",
        "sound_reload?": "string",
        "muzzle_flash_effect_1st_person?": "string",
        "muzzle_flash_effect_3rd_person?": "string",
        "muzzle_flash_effect_1st_person_alt?": "string",
        "muzzle_flash_effect_3rd_person_alt?": "string",
        "heat_effect?": "string",
        "eject_brass_effect?": "string",
        "tracer_effect?": "string",
        "addon_location?": "string",
        "player_bodygroups?": type.Record("string", "number.integer"),
    },
    "item_gear_slot?": "string",
    "item_gear_slot_position?": type("number.integer"),
    "zoom_in_sound?": "string",
    "zoom_out_sound?": "string",
    "keychains?": type("unknown"),
    "stickers?": type("unknown"),
});

const ProTeamDefinition = type({
    "+": "reject",
    tag: "string",
    "geo?": "string",
});

const ClientLootList = type({
    "+": "reject",
    "match_highlight_reel_keychain?": "string",
    "contains_stickers_representing_organizations?": "number.integer",
}).merge(type.Record(ItemStringThingy, "1"));

const HighlightReelDefinition = type({
    "+": "reject",
    id: "string",
    "tournament event id": "number.integer",
    "tournament event stage id": "number.integer",
    map: "string",
    "tournament event team0 id": "number.integer",
    "tournament event team1 id": "number.integer",
});
const ItemSetDefinition = type({
    "+": "reject",
    name: "string",
    "name_force?": "string",
    set_description: "string",
    is_collection: numToBoolean,
    items: type.Record(ItemStringThingy, "1"),
    "unusuals?": {
        "+": "reject",
        "unique?": "string",
        "strange?": "string",
    },
    "is_hidden_set?": numToBoolean,
});
const StageDefinition = type({
    "+": "reject",
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
    "+": "reject",
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
    "stage2?": StageDefinition,
    "stage3?": StageDefinition,
    "stage4?": StageDefinition,
    "stage5?": StageDefinition,
    "stage6?": StageDefinition,
});
const ProPlayerDefinition = type({
    "+": "reject",
    name: type("string | number").pipe(val => val.toString()),
    code: type("string | number").pipe(val => val.toString()),
    dob: "string",
    geo: "string",
    events: type.Record("string.integer", EventDefinition),
});

const WeaponIconDefinition = type({
    "+": "reject",
    icon_path: "string",
});

export const ItemsGame = type({
    "+": "reject",
    game_info: {
        "+": "reject",
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
        "+": "reject",
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
export type ProcessedItem = typeof ItemDefinition.infer & {
    object_id: string;
    item_name: string | undefined;
    item_description: string | undefined;
    item_name_prefab: string | undefined;
    item_description_prefab: string | undefined;
    used_by_classes: Record<string, string | number> | undefined;
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
