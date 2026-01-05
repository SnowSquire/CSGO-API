import { getImageUrl } from "../constants.js";
import type { CustomTranslation, ProcessedItem, ProcessedPrefab } from "../types.js";
import { getRarityColor } from "../utils/index.js";
import specialNotes from "../utils/specialNotes.json" with { type: "json" };
import type { State } from "./main.js";
import { $t, $tc, type LanguageResource } from "./translations.js";

function isCrate(item: ProcessedItem): boolean {
    if (item.item_name === undefined) return false;

    if (
        typeof item?.attributes?.["set supply crate series"] === "object" &&
        item.attributes["set supply crate series"].attribute_class === "supply_crate_series"
    ) {
        return true;
    }

    if (item.item_name.startsWith("#CSGO_storageunit")) {
        return true;
    }

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
        return false;
    }

    return true;
}

function getCrateType(item: ProcessedItem): string | null {
    if (item.prefab === "weapon_case") {
        return "Case";
    }

    if (item.prefab === "weapon_case_souvenirpkg" || item.prefab.includes("souvenir_crate")) {
        return "Souvenir";
    }

    if (item.item_name?.startsWith("#CSGO_storageunit")) {
        return null;
    }

    if (item.prefab.includes("sticker_capsule")) {
        return "Sticker Capsule";
    }

    if (item.prefab === "graffiti_box") {
        return "Graffiti";
    }

    if (item.name.startsWith("crate_pins")) {
        return "Pins";
    }

    if (item.name.startsWith("crate_signature")) {
        return "Autograph Capsule";
    }

    if (item.image_inventory?.includes("patch")) {
        return "Patch Capsule";
    }

    if (item.name.startsWith("crate_musickit")) {
        return "Music Kit Box";
    }

    if (item?.tags?.StickerCapsule !== undefined) {
        return "Sticker Capsule";
    }

    return null;
}

function getFirstSaleDate(item: ProcessedItem, prefabs: Record<string, ProcessedPrefab>) {
    if (item.first_sale_date !== undefined) {
        return item.first_sale_date;
    }

    if (item.associated_items !== undefined) {
        const id = Object.keys(item.associated_items)[0]!;
        return prefabs[id]?.first_sale_date;
    }

    if (item.prefab !== undefined) {
        return prefabs[item.prefab]?.first_sale_date ?? null;
    }

    return null;
}

function getMarketHashName(item: ProcessedItem, languageResource: LanguageResource) {
    if (["4600", "4614", "4719", "4729", "4779", "4871", "4872", "4783", "4795"].includes(item.object_id)) {
        return null;
    }

    return $t(item.item_name!, true, languageResource)?.replace("Holo/Foil", "Holo-Foil") ?? null;
}

function parseItem(
    item: ProcessedItem,
    prefabs: Record<string, ProcessedPrefab>,
    state: {
        skinsByCrates: State["skinsByCrates"];
        revolvingLootLists: State["revolvingLootLists"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { skinsByCrates, revolvingLootLists, cdnImages } = state;

    const image =
        cdnImages[item.image_inventory!.toLowerCase()] ?? getImageUrl(item.image_inventory!.toLowerCase());
    const lootListName = item?.loot_list_name ?? null;
    const attributeValue = (() => {
        const attr = item.attributes?.["set supply crate series"];
        if (typeof attr === "object" && attr?.value !== undefined) {
            return attr.value;
        }
        return null;
    })();
    const keyLootList =
        lootListName ?? (attributeValue ? revolvingLootLists[String(attributeValue)] : null) ?? null;

    const crate = {
        id: `crate-${item.object_id}`,
        name: $t(item.item_name!, false, languageResource),
        description:
            $t(item.item_description ?? "", false, languageResource) ??
            $t(item.item_description_prefab ?? "", false, languageResource),
        def_index: item.object_id,
        type: getCrateType(item),
        first_sale_date: getFirstSaleDate(item, prefabs),
        rarity: {
            id: "rarity_common",
            name: $t("rarity_common", false, languageResource),
            color: getRarityColor("rarity_common"),
        },
        contains: (
            skinsByCrates?.[item.tags?.ItemSet?.tag_value as string] ??
            skinsByCrates?.[keyLootList as string] ??
            []
        ).map(i => ({
            ...i,
            name:
                i.name instanceof Object
                    ? `${$t(i.name.weapon, false, languageResource)} | ${$t(i.name.pattern!, false, languageResource)}`
                    : $t(i.name, false, languageResource),
            rarity: {
                id: i.rarity,
                name: $t(i.rarity, false, languageResource),
                color: getRarityColor(i.rarity),
            },
        })),
        // double dash is intended here
        contains_rare: (skinsByCrates?.[`rare--${keyLootList}`] ?? []).map(i => {
            if (typeof i.name === "string") {
                throw Error("Expected i.name to be an object");
            }
            const lol = [
                "collectible_genuine",
                "rare_special",
                "rare_special_with_wear",
                "rare_special_with_wear_stattrak",
                "rare_special_vanilla",
                "rare_special_vanilla_stattrak",
                "skin",
                "skin_stattrak",
                "skin_souvenir",
            ];
            const key = i.name.tKey ?? JSON.stringify(i.name);
            if (!lol.includes(key)) {
                throw Error(`Invalid rare item rarity '${key}' in crate '${item.item_name}': ${key}`);
            }
            return {
                ...i,
                name: $tc(
                    key as Parameters<typeof $tc>[0],
                    {
                        item_name: $t(i.name.weapon ?? "", false, languageResource) ?? "",
                        pattern: $t(i.name.pattern ?? "", false, languageResource) ?? "",
                    },
                    language
                ),
                rarity: {
                    id: i.rarity,
                    name: $t(i.rarity, false, languageResource),
                    color: getRarityColor(i.rarity),
                },
            };
        }),
        special_notes: specialNotes?.[`crate-${item.object_id}` as keyof typeof specialNotes],
        market_hash_name: getMarketHashName(item, languageResource),
        rental: Boolean(item.attributes?.["can open for rental"]),
        image,
        model_player: item.model_player ?? null,
        loot_list: item.loot_list_rare_item_name
            ? {
                  name: $t(item.loot_list_rare_item_name, false, languageResource),
                  footer: $t(item.loot_list_rare_item_footer ?? "", false, languageResource),
                  image: item.image_unusual_item
                      ? getImageUrl(item.image_unusual_item)
                      : getImageUrl("econ/weapon_cases/default_rare_item"),
              }
            : null,

        original: {
            item_name: item.item_name!,
            image_inventory: item.image_inventory!.toLowerCase(),
        },
    };

    if ($t(`${item.item_name}^highlight`, false, languageResource)) {
        return [
            crate,
            {
                ...crate,
                id: `crate-${item.object_id}_highlight`,
                name: $t(`${item.item_name}^highlight`, false, languageResource),
                rarity: {
                    id: "rarity_common_highlight",
                    name: `${$t("highlight", false, languageResource)} ${$t("rarity_common", false, languageResource)}`,
                    color: "#ffd7aa",
                },
                type: "Souvenir Highlight",
                market_hash_name: $t(`${item.item_name}^highlight`, true, languageResource),
            },
        ];
    }

    return crate;
}

export function getCrates(
    state: {
        items: State["items"];
        prefabs: State["prefabs"];
        skinsByCrates: State["skinsByCrates"];
        revolvingLootLists: State["revolvingLootLists"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { items, prefabs } = state;

    const crates = Object.values(items)
        .filter(isCrate)
        .flatMap(item => parseItem(item, prefabs, state, languageResource, language))
        .filter(crate => crate.name);

    return crates;
}
