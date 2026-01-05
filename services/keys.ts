import { getImageUrl } from "../constants.js";
import type { ProcessedItem } from "../types.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function isKey(item: ProcessedItem) {
    if (item.item_name === undefined) {
        return false;
    }

    if (item.item_name.includes("contestwinner")) {
        return false;
    }

    if (item.item_name.includes("storepromo_key")) {
        return false;
    }

    if (!item?.prefab?.includes("weapon_case_key")) {
        return false;
    }

    return true;
}

function parseItem(
    item: ProcessedItem | any,
    state: { items: State["items"]; cdnImages: State["cdnImages"] },
    languageResource: LanguageResource
) {
    const { items, cdnImages } = state;

    const marketable = [
        "#CSGO_Tool_WeaponCase_Key",
        "#CSGO_esports_crate_key_1",
        "#CSGO_sticker_crate_key_1",
        "#CSGO_community_crate_key_1",
        "#CSGO_community_crate_key_2",
        "#CSGO_sticker_crate_key_community01",
        "#CSGO_community_crate_key_3",
        "#CSGO_community_crate_key_4",
        "#CSGO_community_crate_key_5",
        "#CSGO_community_crate_key_6",
        "#CSGO_community_crate_key_7",
        "#CSGO_community_crate_key_8",
        "#CSGO_community_crate_key_9",
        "#CSGO_crate_community_10_key",
        "#CSGO_crate_key_community_11",
        "#CSGO_crate_key_community_12",
        "#CSGO_crate_key_community_13",
        "#CSGO_crate_key_gamma_2",
        "#CSGO_crate_key_community_15",
        "#CSGO_crate_key_community_16",
        "#CSGO_crate_key_community_17",
        "#CSGO_crate_key_community_18",
        "#CSGO_crate_key_community_19",
        "#CSGO_crate_key_community_20",
        "#CSGO_crate_key_community_21",
        "#CSGO_crate_key_community_22",
        "#CSGO_crate_key_community_24",
    ];

    const image =
        cdnImages[item.image_inventory!.toLowerCase()] ?? getImageUrl(item.image_inventory!.toLowerCase());
    const crates = Object.values(items)
        .filter(
            (crate: any) =>
                ["sticker_capsule", "weapon_case"].includes(crate.prefab) &&
                crate?.tool?.restriction === (item as any)?.tool?.restriction
        )
        .map((crate: any) => ({
            id: `crate-${crate.object_id}`,
            name: $t(crate.item_name, false, languageResource),
            image:
                cdnImages[crate.image_inventory.toLowerCase()] ??
                getImageUrl(crate.image_inventory.toLowerCase()),
        }));

    return {
        id: `key-${item.object_id}`,
        name: $t(item.item_name!, false, languageResource),
        description:
            $t(item.item_description, false, languageResource) ??
            $t(item.item_description_prefab, false, languageResource),
        def_index: item.object_id,
        crates,
        market_hash_name: marketable.includes(item.item_name!)
            ? $t(item.item_name!, true, languageResource)
            : null,
        marketable: marketable.includes(item.item_name!),
        image,

        // Return original attributes from item_game.json
        original: {
            item_name: item.item_name,
            image_inventory: item.image_inventory!.toLowerCase(),
        },
    };
}

export function getKeys(
    state: {
        items: State["items"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { items } = state;

    const seen: any = {};
    const keys = [
        // Hardcoded generic valve key that I can't find in `items`.
        {
            object_id: "generic_valve_key",
            item_name: "#CSGO_Tool_WeaponCase_Key",
            item_description: "#CSGO_Tool_WeaponCase_Key_Desc",
            image_inventory: "econ/tools/weapon_case_key",
            tool: {
                restriction: "generic_valve_key",
            },
        } as any,
        ...Object.values(items).filter(isKey),
    ]
        .map(item => parseItem(item, state, languageResource))
        .filter(({ name, image }) => {
            // Filter repeted keys
            if (seen[image]) {
                return false;
            }
            seen[image] = true;
            return name;
        });

    return keys;
}
