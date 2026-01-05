import { getImageUrl } from "../constants.js";
import type { ProcessedItem } from "../types.js";
import type { State } from "./main.js";
import { getRarityColor } from "../utils/index.js";
import { $t, type LanguageResource } from "./translations.js";

type ItemSetType = State["itemSets"][number];

const isCollection = (item: ItemSetType): boolean => item.is_collection !== undefined;

function isSelfOpeningCollection(item: ProcessedItem): boolean {
    if (item.item_name === undefined) return false;

    if (!item.item_name.startsWith("#CSGO_crate")) {
        return false;
    }

    if (item.item_name.includes("#CSGO_crate_tool_stattrak_swap")) {
        return false;
    }

    if (item.prefab?.includes("weapon_case_key")) {
        return false;
    }

    if (item.item_type === "self_opening_purchase") {
        if (item.prefab.includes("graffiti")) {
            return true;
        }
    }

    return false;
}

function parseItem(
    item: ItemSetType,
    state: {
        skinsByCollections: State["skinsByCollections"];
        cratesByCollections: State["cratesByCollections"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { skinsByCollections, cratesByCollections, cdnImages } = state;

    const fileName = `${item.name.replace("#CSGO_", "")}`;
    const image = cdnImages[`econ/set_icons/${fileName}`] ?? getImageUrl(`econ/set_icons/${fileName}`);

    return {
        id: `collection-${item.name.replace("#CSGO_", "").replace(/_/g, "-")}`,
        name: item.name_force
            ? $t(item.name_force, false, languageResource)
            : $t(item.name, false, languageResource),
        crates: (cratesByCollections?.[item.name.replace("#CSGO_", "")] ?? []).map((i: any) => ({
            ...i,
            name: $t(i.name, false, languageResource),
        })),
        contains: (skinsByCollections?.[item.name.replace("#CSGO_", "")] ?? []).map((i: any) => ({
            ...i,
            name:
                i.name instanceof Object
                    ? `${$t(i.name.weapon, false, languageResource)} | ${$t(i.name.pattern, false, languageResource)}`
                    : $t(i.name, false, languageResource),
            rarity: {
                id: i.rarity,
                name: $t(i.rarity, false, languageResource),
                color: getRarityColor(i.rarity),
            },
        })),
        image,

        original: {
            name: item.name,
            image_inventory: `econ/set_icons/${fileName}`,
        },
    };
}

function parseItemSelfOpening(
    item: ProcessedItem,
    state: {
        skinsByCollections: State["skinsByCollections"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { skinsByCollections, cdnImages } = state;

    const image =
        cdnImages[item.image_inventory!.toLowerCase()] ?? getImageUrl(item.image_inventory!.toLowerCase());

    return {
        id: `collection-${item.object_id}`,
        name: $t(item.item_name!, false, languageResource),
        crates: [],
        contains: (skinsByCollections?.[item.name] ?? []).map((i: any) => ({
            ...i,
            name: $t(i.name, false, languageResource),
            rarity: {
                id: i.rarity,
                name: $t(i.rarity, false, languageResource),
                color: getRarityColor(i.rarity),
            },
        })),
        image,

        original: {
            name: item.name,
            item_name: item.item_name,
            image_inventory: item.image_inventory!.toLowerCase(),
        },
    };
}

export function getCollections(
    state: {
        items: State["items"];
        itemSets: State["itemSets"];
        skinsByCollections: State["skinsByCollections"];
        cratesByCollections: State["cratesByCollections"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { items, itemSets } = state;

    const collections = [
        ...itemSets.filter(isCollection).map((item: any) => parseItem(item, state, languageResource)),
        ...Object.values(items)
            .filter(isSelfOpeningCollection)
            .map((item: any) => parseItemSelfOpening(item, state, languageResource)),
    ].filter(collection => collection.name);

    return collections;
}
