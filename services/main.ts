import { regex, type } from "arktype";
import axios from "axios";
import sha1 from "sha1";
import { getImageUrl, IMAGES_INVENTORY_URL, ITEMS_GAME_URL } from "../constants";
import {
    type CollectionInfo,
    type CrateInfo,
    type ItemStringThingy,
    ItemsGame,
    type ProcessedHighlightReel,
    type ProcessedItem,
    type ProcessedKeychainDefinition,
    type ProcessedMusicDefinition,
    type ProcessedPaintKit,
    type ProcessedPrefab,
    type ProcessedProPlayer,
    type ProcessedProTeam,
    type ProcessedStickerKit,
    type SkinItem,
} from "../types.js";
import {
    filterUniqueByAttribute,
    getDopplerPhase,
    getGraffitiVariations,
    getPlayerNameOfHighlight,
    isExclusive,
    isNotWeapon,
    knives,
} from "../utils/index";
import { rareSpecial } from "../utils/rareSpecial";

// Type for the complete state
export type State = {
    itemsGame: ItemsGame;
    itemSets: Array<ItemsGame["item_sets"][string]>;
    stickerKits: Array<ProcessedStickerKit>;
    stickerKitsObj: Record<string, ProcessedStickerKit>;
    players: Record<string, string>;
    keychainDefinitions: Array<ProcessedKeychainDefinition>;
    keychainDefinitionsObj: Record<string, ProcessedKeychainDefinition>;
    items: Record<string, ProcessedItem>;
    prefabs: Record<string, ProcessedPrefab>;
    paintKits: Record<string, ProcessedPaintKit>;
    musicDefinitions: Array<ProcessedMusicDefinition>;
    musicDefinitionsObj: Record<string, ProcessedMusicDefinition>;
    clientLootLists: ItemsGame["client_loot_lists"];
    revolvingLootLists: ItemsGame["revolving_loot_lists"];
    rarities: Record<string, { rarity: string }>;
    skinsByCrates: Record<string, SkinItem[]>;
    cratesBySkins: Record<string, CrateInfo[]>;
    skinsByCollections: Record<string, SkinItem[]>;
    cratesByCollections: Record<string, CrateInfo[]>;
    collectionsBySkins: Record<string, CollectionInfo[]>;
    collectionsByStickers: Record<string, CollectionInfo[]>;
    souvenirSkins: Record<string, boolean>;
    stattTrakSkins: Record<string, boolean>;
    highlightReels: Array<ProcessedHighlightReel>;
    proTeams: Record<string, ProcessedProTeam>;
    proPlayers: Record<string, ProcessedProPlayer>;
    cdnImages: Record<string, string>;
};

// Context object passed to functions that need multiple state properties
type GetItemFromKeyContext = {
    items: Record<string, ProcessedItem>;
    itemsGame: ItemsGame;
    rarities: Record<string, { rarity: string }>;
    paintKits: Record<string, ProcessedPaintKit>;
    stickerKitsObj: Record<string, ProcessedStickerKit>;
    musicDefinitionsObj: Record<string, ProcessedMusicDefinition>;
    keychainDefinitionsObj: Record<string, ProcessedKeychainDefinition>;
    cdnImages: Record<string, string>;
};

export async function loadItemsGame(): Promise<ItemsGame> {
    const response = await fetch(ITEMS_GAME_URL);
    const data = await response.json();
    const typedData = type({ items_game: ItemsGame })(data);
    if (typedData instanceof type.errors) {
        throw Error(typedData.summary);
    }
    const itemsGame = typedData.items_game;

    // Some collections are not in the item_sets object. So I just add them in this way.
    // Some examples:
    // Sugarface 2 Sticker Collection
    // Missing Link Community Charm Collection
    // Dr Boom Charm Collection
    // Character Craft Sticker Pack
    // Elemental Craft Sticker Pack
    const sets: Record<
        string,
        {
            type: "sticker_pack_" | "keychain_pack_";
            items: Record<ItemStringThingy, 1>;
        }
    > = {};
    Object.entries(itemsGame.client_loot_lists).forEach(([key, value]) => {
        const match = regex("^(sticker_pack_|keychain_pack_)(.+)_(.+)$").exec(key);
        if (match && Object.keys(value)[0]?.includes("[")) {
            const set_name = match[2];
            if (!set_name) return;
            if (!(set_name in sets)) {
                sets[set_name] = {
                    type: match[1] as "sticker_pack_" | "keychain_pack_",
                    items: {} as Record<ItemStringThingy, 1>,
                };
            }
            const setData = sets[set_name];
            if (setData) {
                setData.items = {
                    ...setData.items,
                    ...value,
                };
            }
        }
    });

    Object.entries(sets).forEach(([key, value]) => {
        const keyTranslation = key === "community_2025" ? "community2025" : key;

        itemsGame.item_sets[`set_${key}`] = {
            name: `#CSGO_set_${key}`,
            name_force: `#CSGO_crate_${value.type}${keyTranslation}_capsule`,
            set_description: `#CSGO_crate_${value.type}${keyTranslation}_capsule_desc`,
            is_collection: 1,
            items: value.items,
        };
    });

    // Load weapon icons
    const iconsResponse = await axios.get(
        "https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/refs/heads/main/static/default_generated.json"
    );
    itemsGame.alternate_icons2.weapon_icons = (iconsResponse.data as string[])
        .filter(item => {
            // We have heavy, light and medium
            if (!item.includes("light_png.png")) return false;
            // Chickens
            if (item.includes("pet_hen_1_hen")) return false;
            return true;
        })
        .reduce(
            (acc, item) => {
                acc[sha1(item.replace("_light_png.png", "")).slice(0, 12)] = {
                    icon_path: `econ/default_generated/${item.replace("_png.png", "")}`,
                };
                return acc;
            },
            {} as Record<string, { icon_path: string }>
        );

    return itemsGame;
}

function loadItemSets(itemsGame: ItemsGame): Array<ItemsGame["item_sets"][string]> {
    return Object.values(itemsGame.item_sets);
}

function loadStickerKits(itemsGame: ItemsGame): {
    stickerKits: Array<ProcessedStickerKit>;
    stickerKitsObj: Record<string, ProcessedStickerKit>;
    players: Record<string, string>;
} {
    const stickerKits = Object.entries(itemsGame.sticker_kits).map(([key, item]) => {
        const processedItem = { ...item };
        if (processedItem.name === "comm01_howling_dawn") {
            processedItem.item_rarity = "contraband";
        }

        return {
            ...processedItem,
            object_id: key,
        };
    });

    const stickerKitsObj = Object.fromEntries(stickerKits.map(item => [item.name, item]));

    // Load also players
    const players = Object.entries(itemsGame.pro_players).reduce(
        (acc, [id, player]) => {
            acc[id] = player.name.toString();
            return acc;
        },
        {} as Record<string, string>
    );

    return { stickerKits, stickerKitsObj, players };
}

export function loadKeychainDefinitions(itemsGame: ItemsGame): {
    keychainDefinitions: Array<ProcessedKeychainDefinition>;
    keychainDefinitionsObj: Record<string, ProcessedKeychainDefinition>;
} {
    const keychainDefinitions = Object.entries(itemsGame.keychain_definitions).map(([key, item]) => ({
        ...item,
        object_id: key,
    }));

    const keychainDefinitionsObj = Object.fromEntries(keychainDefinitions.map(item => [item.name, item]));

    return { keychainDefinitions, keychainDefinitionsObj };
}

export function loadPrefabs(itemsGame: ItemsGame): Record<string, ProcessedPrefab> {
    return Object.entries(itemsGame.prefabs).reduce(
        (acc, [key, value]) => {
            const innerPrefab = value.prefab ? itemsGame.prefabs[value.prefab] : undefined;

            acc[key] = {
                item_name: value.item_name ?? innerPrefab?.item_name,
                item_description: value.item_description ?? innerPrefab?.item_description,
                first_sale_date: value.first_sale_date ?? innerPrefab?.first_sale_date ?? null,
                prefab: value.prefab ?? innerPrefab?.prefab,
                used_by_classes: value.used_by_classes,
            };
            return acc;
        },
        {} as Record<string, ProcessedPrefab>
    );
}

export function loadItems(
    itemsGame: ItemsGame,
    prefabs: Record<string, ProcessedPrefab>
): Record<string, ProcessedItem> {
    return Object.entries(itemsGame.items).reduce(
        (acc, [key, value]) => {
            const prefab = value.prefab ? prefabs[value.prefab] : undefined;
            acc[value.name] = {
                ...value,
                object_id: key,
                item_name: value.item_name,
                item_description: value.item_description,
                item_name_prefab: prefab?.item_name,
                item_description_prefab: prefab?.item_description,
                used_by_classes: value.used_by_classes ?? prefab?.used_by_classes,
            };
            return acc;
        },
        {} as Record<string, ProcessedItem>
    );
}

export function loadPaintKits(itemsGame: ItemsGame): Record<string, ProcessedPaintKit> {
    return Object.entries(itemsGame.paint_kits).reduce(
        (acc, [key, item]) => {
            if (item.description_tag !== undefined) {
                acc[item.name.toLowerCase()] = {
                    description_tag: item.description_tag,
                    wear_remap_min: item.wear_remap_min ?? 0.06,
                    wear_remap_max: item.wear_remap_max ?? 0.8,
                    paint_index: key,
                    style_id: item.style ?? 0,
                    style_name: `SFUI_ItemInfo_FinishStyle_${item.style ?? 0}`,
                    legacy_model: !!item.use_legacy_model,
                };
            }
            return acc;
        },
        {} as Record<string, ProcessedPaintKit>
    );
}

export function loadMusicDefinitions(itemsGame: ItemsGame): {
    musicDefinitions: Array<ProcessedMusicDefinition>;
    musicDefinitionsObj: Record<string, ProcessedMusicDefinition>;
} {
    const musicDefinitions = Object.entries(itemsGame.music_definitions).map(([key, item]) => ({
        ...item,
        object_id: key,
        loc_name: item.loc_name,
        loc_description: item.loc_description,
        coupon_name: `coupon_${item.name}`,
    }));

    const musicDefinitionsObj = Object.fromEntries(musicDefinitions.map(item => [item.name, item]));

    return { musicDefinitions, musicDefinitionsObj };
}

export function loadRarities(
    clientLootLists: ItemsGame["client_loot_lists"]
): Record<string, { rarity: string }> {
    const hardCoded: Record<string, { rarity: string }> = {
        "[cu_m4a1_howling]weapon_m4a1": {
            rarity: "contraband",
        },
        "[cu_retribution]weapon_elite": {
            rarity: "rare",
        },
        "[cu_mac10_decay]weapon_mac10": {
            rarity: "mythical",
        },
        "[cu_p90_scorpius]weapon_p90": {
            rarity: "rare",
        },
        "[hy_labrat_mp5]weapon_mp5sd": {
            rarity: "mythical",
        },
        "[cu_xray_p250]weapon_p250": {
            rarity: "mythical",
        },
        "[cu_usp_spitfire]weapon_usp_silencer": {
            rarity: "legendary",
        },
        "[am_nitrogen]weapon_cz75a": {
            rarity: "rare",
        },
    };

    const rarities = new Set(["common", "uncommon", "rare", "mythical", "legendary", "ancient"]);

    return Object.entries(clientLootLists).reduce(
        (acc, [name, keys]) => {
            const rarity = name.split("_").pop();

            if (rarity && rarities.has(rarity)) {
                for (const key in keys) {
                    if (key.includes("[")) {
                        acc[key.toLowerCase()] = { rarity };
                    }
                }
            }

            return acc;
        },
        { ...hardCoded }
    );
}

export function loadSkinsByCrates(
    clientLootLists: ItemsGame["client_loot_lists"],
    revolvingLootLists: ItemsGame["revolving_loot_lists"],
    getItemFromKeyFn: (key: string) => SkinItem | SkinItem[] | null | undefined
): Record<string, SkinItem[]> {
    function extractItems(
        key: string,
        lootLists: ItemsGame["client_loot_lists"]
    ): Record<string, number | string> {
        const currentObject = lootLists[key];
        if (!currentObject) return {};
        let items: Record<string, number | string> = {};

        for (const subKey in currentObject) {
            // If the key contains "[", it's an item
            if (subKey.includes("[")) {
                const val = currentObject[subKey as keyof typeof currentObject];
                if (val !== undefined) {
                    items[subKey] = val;
                }
            }
            // If the key contains 'Commodity Pin', it's a Pin
            if (subKey.includes("Commodity Pin")) {
                const val = currentObject[subKey as keyof typeof currentObject];
                if (val !== undefined) {
                    items[subKey] = val;
                }
            }

            // Otherwise, we'll recursively merge the items from the referenced object
            items = { ...items, ...extractItems(subKey, lootLists) };
        }

        return items;
    }

    function extractRareItems(key: string, lootLists: ItemsGame["client_loot_lists"]): string[] {
        const currentObject = lootLists[key];
        if (!currentObject) return [];

        for (const subKey in currentObject) {
            const rareItem = rareSpecial[subKey as keyof typeof rareSpecial];
            if (rareItem) {
                return Object.keys(rareItem);
            }
        }

        return [];
    }

    const result: Record<string, SkinItem[]> = {};

    // Process revolving loot lists
    for (const item of Object.values(revolvingLootLists)) {
        if (item === "crate_dhw13_promo") {
            // Source: https://counterstrike.fandom.com/wiki/DreamHack_2013_Souvenir_Package
            const sets = ["set_dust_2", "set_safehouse", "set_italy", "set_lake", "set_train", "set_mirage"];
            const items = sets.flatMap(set =>
                Object.keys(extractItems(set, clientLootLists))
                    .flatMap(getItemFromKeyFn)
                    .filter((i): i is SkinItem => i != null)
            );
            const revolverItem = getItemFromKeyFn("[sp_tape]weapon_revolver");
            if (revolverItem && !Array.isArray(revolverItem)) {
                items.push(revolverItem);
            }
            result[item] = items;
            continue;
        }

        if (item === "crate_ems14_promo") {
            // I assume the drops are the same as "DreamHack 2013" but the "R8 Revolver | Bone Mask"
            const sets = ["set_dust_2", "set_safehouse", "set_italy", "set_lake", "set_train", "set_mirage"];
            result[item] = sets.flatMap(set =>
                Object.keys(extractItems(set, clientLootLists))
                    .flatMap(getItemFromKeyFn)
                    .filter((i): i is SkinItem => i != null)
            );
            continue;
        }

        const extractedItems = Object.keys(extractItems(item, clientLootLists))
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null);

        if (item.includes("_stattrak_") && item.includes("musickit")) {
            result[item] = extractedItems.map(skinItem => {
                console.assert(typeof skinItem !== "string", "Expected skinItem to be an object");
                return {
                    ...skinItem,
                    id: `${skinItem.id}_st`,
                    name: typeof skinItem.name === "string" ? `${skinItem.name}_stattrak` : skinItem.name,
                };
            });
        } else {
            result[item] = extractedItems;
        }
    }

    // To avoid the loop down below
    const xrayItem = getItemFromKeyFn("[cu_xray_p250]weapon_p250");
    result.set_xraymachine = xrayItem && !Array.isArray(xrayItem) ? [xrayItem] : [];

    // Rare special
    for (const item of Object.values(revolvingLootLists)) {
        result[`rare--${item}`] = extractRareItems(item, clientLootLists)
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null);
    }

    return result;
}

// Helper to extract attribute value from ProcessedItem.attributes
function getAttributeValue(
    attr: string | number | { attribute_class?: string; value?: string | number } | undefined
): string | number | undefined {
    if (attr === undefined) return undefined;
    if (typeof attr === "string" || typeof attr === "number") return attr;
    return attr.value;
}

export function loadCratesBySkins(
    skinsByCrates: Record<string, SkinItem[]>,
    revolvingLootLists: ItemsGame["revolving_loot_lists"],
    items: Record<string, ProcessedItem>,
    cdnImages: Record<string, string>
): Record<string, CrateInfo[]> {
    const hardCodedCrates: Record<string, { object_id: number; item_name: string; image_inventory: string }> =
        {
            set_xraymachine: {
                object_id: 4668,
                item_name: "#CSGO_set_xraymachine",
                image_inventory: "econ/weapon_cases/crate_xray_p250",
            },
        };

    return Object.entries(skinsByCrates).reduce(
        (acc, [crateKey, itemsList]) => {
            const normalizedCrateKey = crateKey.replace("rare--", "");

            for (const item of itemsList) {
                if (!(item.id in acc)) {
                    acc[item.id] = [];
                }

                const lootList = Object.entries(revolvingLootLists).find(
                    ([, value]) => value === normalizedCrateKey
                );

                const hardCodedCrate = hardCodedCrates[normalizedCrateKey];
                const crateItem =
                    hardCodedCrate ??
                    items[normalizedCrateKey] ??
                    Object.values(items).find(i => {
                        const attrValue = getAttributeValue(i.attributes?.["set supply crate series"]);
                        // Using == for type coercion (comparing string/number)
                        // biome-ignore lint/suspicious/noDoubleEquals: intentional type coercion
                        return attrValue == lootList?.[0];
                    });

                if (crateItem != null) {
                    const imageInventory = crateItem.image_inventory?.toLowerCase();
                    if (!acc[item.id]) {
                        acc[item.id] = [];
                    }
                    acc[item.id]!.push({
                        id: `crate-${crateItem.object_id}`,
                        name: crateItem.item_name ?? "",
                        image: imageInventory
                            ? (cdnImages[imageInventory] ?? getImageUrl(imageInventory))
                            : "",
                    });
                }
            }

            return acc;
        },
        {} as Record<string, CrateInfo[]>
    );
}

export function loadSkinsByCollections(
    itemsGame: ItemsGame,
    getItemFromKeyFn: (key: string) => SkinItem | SkinItem[] | null | undefined
): Record<string, SkinItem[]> {
    const hardcoded: Record<string, SkinItem[]> = {
        selfopeningitem_crate_spray_std2_1: [
            "[spray_std2_applause]spray",
            "[spray_std2_beep]spray",
            "[spray_std2_boom]spray",
            "[spray_std2_brightstar]spray",
            "[spray_std2_brokenheart]spray",
            "[spray_std2_chef_kiss]spray",
            "[spray_std2_chick]spray",
            "[spray_std2_chunkychicken]spray",
            "[spray_std2_goofy]spray",
            "[spray_std2_grimace]spray",
            "[spray_std2_happy_cat]spray",
            "[spray_std2_hop]spray",
            "[spray_std2_kiss]spray",
            "[spray_std2_lightbulb]spray",
            "[spray_std2_little_crown]spray",
            "[spray_std2_omg]spray",
            "[spray_std2_silverbullet]spray",
            "[spray_std2_smirk]spray",
            "[spray_std2_thoughtfull]spray",
        ]
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null),
        selfopeningitem_crate_spray_std2_2: [
            "[spray_std2_1g]spray",
            "[spray_std2_200iq]spray",
            "[spray_std2_bubble_denied]spray",
            "[spray_std2_bubble_question]spray",
            "[spray_std2_choke]spray",
            "[spray_std2_dead_now]spray",
            "[spray_std2_fart]spray",
            "[spray_std2_little_ez]spray",
            "[spray_std2_littlebirds]spray",
            "[spray_std2_nt]spray",
            "[spray_std2_okay]spray",
            "[spray_std2_oops]spray",
            "[spray_std2_puke]spray",
            "[spray_std2_rly]spray",
            "[spray_std2_smarm]spray",
            "[spray_std2_smooch]spray",
            "[spray_std2_uhoh]spray",
        ]
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null),
        selfopeningitem_crate_spray_std3: [
            "[spray_std3_ak47]spray",
            "[spray_std3_aug]spray",
            "[spray_std3_awp]spray",
            "[spray_std3_bizon]spray",
            "[spray_std3_cz]spray",
            "[spray_std3_famas]spray",
            "[spray_std3_galil]spray",
            "[spray_std3_m4a1]spray",
            "[spray_std3_m4a4]spray",
            "[spray_std3_mac10]spray",
            "[spray_std3_mp7]spray",
            "[spray_std3_mp9]spray",
            "[spray_std3_p90]spray",
            "[spray_std3_sg553]spray",
            "[spray_std3_ump]spray",
            "[spray_std3_xm1014]spray",
        ]
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null),
    };

    return Object.entries(itemsGame.item_sets).reduce((acc, [key, value]) => {
        acc[key] = Object.keys(value.items)
            .flatMap(getItemFromKeyFn)
            .filter((i): i is SkinItem => i != null);
        return acc;
    }, hardcoded);
}

export function loadCratesByCollections(
    skinsByCollections: Record<string, SkinItem[]>,
    cratesBySkins: Record<string, CrateInfo[]>
): Record<string, CrateInfo[]> {
    return Object.entries(skinsByCollections).reduce(
        (acc, [collection, items]) => {
            const itemsId = [...new Set(items.map(({ id }) => id))];
            const crates = itemsId.flatMap(id => cratesBySkins[id] ?? []);

            acc[collection] = filterUniqueByAttribute(crates, "id");

            return acc;
        },
        {} as Record<string, CrateInfo[]>
    );
}

export function loadCollectionsBySkins(
    skinsByCollections: Record<string, SkinItem[]>,
    itemSets: ItemsGame["item_sets"],
    cdnImages: Record<string, string>
): Record<string, CollectionInfo[]> {
    return Object.entries(skinsByCollections).reduce(
        (acc, [crateKey, itemsList]) => {
            const normalizedCrateKey = crateKey.replace("rare--", "");

            for (const item of itemsList) {
                if (!(item.id in acc)) {
                    acc[item.id] = [];
                }

                const crateItem = itemSets[normalizedCrateKey];

                if (crateItem != null) {
                    acc[item.id]!.push({
                        id: `collection-${crateItem.name.replace("#CSGO_", "").replace(/_/g, "-")}`,
                        name: crateItem.name_force ?? crateItem.name,
                        image:
                            cdnImages[`econ/set_icons/${crateItem.name.replace("#CSGO_", "")}`] ??
                            getImageUrl(`econ/set_icons/${crateItem.name.replace("#CSGO_", "")}`),
                    });
                }
            }

            return acc;
        },
        {} as Record<string, CollectionInfo[]>
    );
}

export function loadCollectionsByStickers(
    itemSets: ItemsGame["item_sets"],
    cdnImages: Record<string, string>,
    getItemFromKeyFn: (key: string) => SkinItem | SkinItem[] | null | undefined
): Record<string, CollectionInfo[]> {
    return Object.entries(itemSets)
        .filter(([, value]) => {
            // Only include item sets that have stickers and are collections
            return (
                value.is_collection &&
                Object.keys(value.items).some(
                    itemKey => itemKey.includes("[") && itemKey.includes("]sticker")
                )
            );
        })
        .reduce(
            (acc, [collectionKey, itemSet]) => {
                Object.keys(itemSet.items)
                    .filter(itemKey => itemKey.includes("[") && itemKey.includes("]sticker"))
                    .forEach(itemKey => {
                        const stickerItem = getItemFromKeyFn(itemKey);
                        if (stickerItem && !Array.isArray(stickerItem) && stickerItem.id) {
                            if (!(stickerItem.id in acc)) {
                                acc[stickerItem.id] = [];
                            }

                            const fileName = collectionKey.replace("set_", "");
                            acc[stickerItem.id]!.push({
                                id: `collection-set-${fileName.replace(/_/g, "-")}`,
                                name: itemSet.name_force ?? itemSet.name,
                                image:
                                    cdnImages[`econ/set_icons/set_${fileName}`] ??
                                    getImageUrl(`econ/set_icons/set_${fileName}`),
                            });
                        }
                    });
                return acc;
            },
            {} as Record<string, CollectionInfo[]>
        );
}

export function loadSouvenirSkins(
    items: Record<string, ProcessedItem>,
    revolvingLootLists: ItemsGame["revolving_loot_lists"],
    skinsByCrates: Record<string, SkinItem[]>
): Record<string, boolean> {
    const result = Object.values(items)
        .filter(item => {
            return (
                item.prefab === "weapon_case_souvenirpkg" ||
                item.prefab?.includes("_souvenir_crate_promo_prefab")
            );
        })
        .flatMap(item => {
            const lootListName = item.loot_list_name ?? null;
            const attributeValue = getAttributeValue(item.attributes?.["set supply crate series"]);
            const keyLootList =
                lootListName ??
                (attributeValue != null ? revolvingLootLists[String(attributeValue)] : null) ??
                null;

            return (
                skinsByCrates[item.tags?.ItemSet?.tag_value ?? ""] ??
                (keyLootList ? skinsByCrates[keyLootList] : []) ??
                []
            );
        })
        .reduce(
            (acc, item) => {
                acc[item.id] = true;
                return acc;
            },
            {} as Record<string, boolean>
        );

    result["skin-e73d6e7e9004"] = true; // MP5-SD | Lab Rats

    return result;
}

export function loadStattrakSkins(
    itemSets: Array<ItemsGame["item_sets"][string]>,
    items: Record<string, ProcessedItem>
): Record<string, boolean> {
    const crates: Record<string, boolean> = {};

    Object.values(items).forEach(item => {
        const prefab = (item.prefab || "").split(" ");
        if (prefab.includes("weapon_case") || prefab.includes("volatile_pricing")) {
            const name = item.tags?.ItemSet?.tag_value;

            if (name !== undefined) {
                crates[name] = true;
            }
        }
    });

    const result: Record<string, boolean> = {
        "[cu_m4a1_howling]weapon_m4a1": true,
        "[cu_xray_p250]weapon_p250": true,
    };

    const skipCollections = ["#CSGO_set_dust_2_2021"];

    itemSets.forEach(item => {
        if (item.is_collection && !skipCollections.includes(item.name)) {
            Object.keys(item.items).forEach(key => {
                if (crates[item.name.replace("#CSGO_", "")] !== undefined) {
                    result[key.toLocaleLowerCase()] = true;
                }
            });
        }
    });

    return result;
}

export function loadHighlights(
    itemsGame: ItemsGame,
    players: Record<string, string>
): Array<ProcessedHighlightReel> {
    return Object.entries(itemsGame.highlight_reels).map(([id, item]) => {
        const tournamentString = String(item["tournament event id"]).padStart(3, "0");
        const matchString = `${String(item["tournament event team0 id"]).padStart(3, "0")}v${String(item["tournament event team1 id"]).padStart(3, "0")}_${String(item["tournament event stage id"]).padStart(3, "0")}`;

        const video = `https://cdn.steamstatic.com/apps/csgo/videos/highlightreels/${tournamentString}/${matchString}/${tournamentString}_${matchString}_${item.map}_${item.id}_ww_1080p.webm`;

        const playerName = getPlayerNameOfHighlight(item.id, players);

        return {
            id: item.id,
            highlight_reel: id,
            tournament_event_id: item["tournament event id"],
            tournament_event_team0_id: item["tournament event team0 id"],
            tournament_event_team1_id: item["tournament event team1 id"],
            tournament_event_stage_id: item["tournament event stage id"],
            tournament_event_map: item.map,
            tournament_player: typeof playerName === "string" ? playerName : null,
            image: getImageUrl(`econ/keychains/${item.id.split("_")[0]}/kc_${item.id.split("_")[0]}`),
            image_inventory: `econ/keychains/${item.id.split("_")[0]}/kc_${item.id.split("_")[0]}`,
            video: video,
            thumbnail: `https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/refs/heads/main/static/highlightreels/ww/${id}.webp`,
        };
    });
}

export function loadProTeams(itemsGame: ItemsGame): Record<string, ProcessedProTeam> {
    return Object.entries(itemsGame.pro_teams).reduce(
        (acc, [id, item]) => {
            acc[id] = {
                id: parseInt(id, 10),
                tag: item.tag,
                ...(item.geo ? { geo: item.geo } : {}),
            };
            return acc;
        },
        {} as Record<string, ProcessedProTeam>
    );
}

export function loadProPlayers(itemsGame: ItemsGame): Record<string, ProcessedProPlayer> {
    return Object.entries(itemsGame.pro_players).reduce(
        (acc, [id, item]) => {
            acc[id] = {
                id: parseInt(id, 10),
                name: item.name,
                code: item.code,
                dob: item.dob,
                geo: item.geo,
            };
            return acc;
        },
        {} as Record<string, ProcessedProPlayer>
    );
}

export async function loadImagesInventory(): Promise<Record<string, string>> {
    const response = await axios.get(IMAGES_INVENTORY_URL);
    return response.data as Record<string, string>;
}

function getItemFromKey(key: string, ctx: GetItemFromKeyContext): SkinItem | SkinItem[] | null {
    const {
        items,
        itemsGame,
        rarities,
        paintKits,
        stickerKitsObj,
        musicDefinitionsObj,
        keychainDefinitionsObj,
        cdnImages,
    } = ctx;

    if (key.includes("Commodity Pin")) {
        const pin = items[key];
        if (!pin) return null;
        return {
            id: `collectible-${pin.object_id}`,
            name: pin.item_name ?? "",
            rarity: `rarity_${pin.item_rarity}`,
            image: pin.image_inventory
                ? (cdnImages[pin.image_inventory.toLowerCase()] ??
                  getImageUrl(pin.image_inventory.toLowerCase()))
                : "",
        };
    }

    if (key.startsWith("customplayer_")) {
        const agent = items[key];
        if (!agent) return null;
        return {
            id: `agent-${agent.object_id}`,
            name: agent.item_name ?? "",
            rarity: `rarity_${agent.item_rarity}_character`,
            image:
                cdnImages[`econ/characters/${agent.name.toLocaleLowerCase()}`] ??
                getImageUrl(`econ/characters/${agent.name.toLocaleLowerCase()}`),
        };
    }

    const regexPattern = /\[(?<name>.+?)\](?<type>.+)/;
    const match = key.match(regexPattern);
    if (!match?.groups) {
        return null;
    }
    const matchedName = match.groups.name;
    const matchedType = match.groups.type;
    if (!matchedName || !matchedType) {
        return null;
    }
    let name = matchedName;
    const type = matchedType;

    if (name === "cu_bizon_Curse") {
        name = name.toLowerCase();
    }

    if (type === "sticker") {
        const sticker = stickerKitsObj[name];
        if (!sticker) return null;
        return {
            id: `${type}-${sticker.object_id}`,
            name: sticker.item_name,
            rarity: `rarity_${sticker.item_rarity}`,
            image: sticker.sticker_material
                ? (cdnImages[`econ/stickers/${sticker.sticker_material.toLowerCase()}`] ??
                  getImageUrl(`econ/stickers/${sticker.sticker_material.toLowerCase()}`))
                : "",
        };
    }

    if (type === "patch") {
        const patch = stickerKitsObj[name];
        if (!patch) return null;
        return {
            id: `${type}-${patch.object_id}`,
            name: patch.item_name,
            rarity: `rarity_${patch.item_rarity}`,
            image: patch.patch_material
                ? (cdnImages[`econ/patches/${patch.patch_material}`] ??
                  getImageUrl(`econ/patches/${patch.patch_material}`))
                : "",
        };
    }

    if (type === "spray") {
        const graffiti = stickerKitsObj[name];
        if (!graffiti) return null;
        const variations = getGraffitiVariations(name);
        const variationsIndex: number[] =
            variations[0] === 0 ? Array.from({ length: 19 }, (_, index) => index + 1) : variations;

        if (variationsIndex.length > 0) {
            return variationsIndex.map((index: number) => ({
                id: `graffiti-${graffiti.object_id}_${index}`,
                name: graffiti.item_name,
                rarity: `rarity_${graffiti.item_rarity}`,
                image: graffiti.sticker_material
                    ? (cdnImages[`econ/stickers/${graffiti.sticker_material}_${index}`] ??
                      getImageUrl(`econ/stickers/${graffiti.sticker_material}_${index}`))
                    : "",
            }));
        }

        return {
            id: `graffiti-${graffiti.object_id}`,
            name: graffiti.item_name,
            rarity: `rarity_${graffiti.item_rarity}`,
            image: graffiti.sticker_material
                ? (cdnImages[`econ/stickers/${graffiti.sticker_material}`] ??
                  getImageUrl(`econ/stickers/${graffiti.sticker_material}`))
                : "",
        };
    }

    if (type === "musickit") {
        const kit = musicDefinitionsObj[name];
        if (!kit) return null;
        const exclusive = isExclusive(kit.name);
        return {
            id: `music_kit-${kit.object_id}`,
            name: exclusive ? kit.loc_name : kit.coupon_name,
            rarity: "rarity_rare",
            image:
                cdnImages[kit.image_inventory.toLowerCase()] ??
                getImageUrl(kit.image_inventory.toLowerCase()),
        };
    }

    if (type === "keychain") {
        const keychain = keychainDefinitionsObj[name];
        if (!keychain) return null;
        return {
            id: `keychain-${keychain.object_id}`,
            name: keychain.loc_name,
            rarity: `rarity_${keychain.item_rarity}`,
            image:
                cdnImages[keychain.image_inventory.toLowerCase()] ??
                getImageUrl(keychain.image_inventory.toLowerCase()),
        };
    }

    if (
        type.includes("weapon_") ||
        [
            "studded_bloodhound_gloves",
            "slick_gloves",
            "leather_handwraps",
            "motorcycle_gloves",
            "specialist_gloves",
            "sporty_gloves",
            "studded_hydra_gloves",
            "studded_brokenfang_gloves",
        ].includes(type)
    ) {
        let id = "";
        let itemName: string | { tKey?: string; weapon: string; pattern?: string } = "";
        let paint_index: string | null = null;
        let phase: string | null = null;
        let image = "";
        const itemData = items[type];
        const translatedName = !isNotWeapon(type) ? itemData?.item_name_prefab : itemData?.item_name;

        const isKnife = type.includes("weapon_knife") || type.includes("weapon_bayonet");

        const rarityData = rarities[key.toLocaleLowerCase()];
        const rarity = !isNotWeapon(type)
            ? `rarity_${rarityData?.rarity ?? "common"}_weapon`
            : isKnife
              ? // Knives are 'Covert'
                "rarity_ancient_weapon"
              : // Gloves are 'Extraordinary'
                "rarity_ancient";

        // Not the best way to add vanilla knives.
        if (name === "vanilla") {
            const knife = knives.find(k => k.name === type);
            if (!knife) return null;
            id = `skin-vanilla-${type}`;
            itemName = {
                tKey: "rare_special_vanilla",
                weapon: knife.item_name,
            };
            image =
                cdnImages[`econ/weapons/base_weapons/${knife.name}`] ??
                getImageUrl(`econ/weapons/base_weapons/${knife.name}`);
        } else {
            const weaponIcons = itemsGame.alternate_icons2.weapon_icons;
            if (!weaponIcons) {
                console.log("[ERROR] Weapon icons not loaded");
                return null;
            }
            const weaponIconEntry = Object.entries(weaponIcons).find(([, value]) =>
                value.icon_path.includes(`${type}_${name}_light`)
            );

            if (!weaponIconEntry) {
                console.log("[ERROR] Weapon icon not found", type, name);
                return null;
            }

            const paintKit = paintKits[name.toLowerCase()];
            if (!paintKit) {
                console.log("[ERROR] Paint kit not found", name);
                return null;
            }

            id = `skin-${weaponIconEntry[0]}`;
            itemName = {
                ...(isNotWeapon(type) && { tKey: "rare_special" }),
                weapon: (translatedName ?? "").replace("#", ""),
                pattern: paintKit.description_tag.replace("#", ""),
            };
            paint_index = paintKit.paint_index;
            phase = getDopplerPhase(paintKit.paint_index);
            image =
                cdnImages[`${weaponIconEntry[1].icon_path.toLowerCase()}`] ??
                cdnImages[`${weaponIconEntry[1].icon_path.toLowerCase().replace(/_light$/, "_medium")}`] ??
                cdnImages[`${weaponIconEntry[1].icon_path.toLowerCase().replace(/_light$/, "_heavy")}`] ??
                getImageUrl(`${weaponIconEntry[1].icon_path.toLowerCase()}`);
        }

        return {
            id,
            name: itemName,
            rarity,
            paint_index,
            phase,
            image,
        };
    }

    console.error(`Unknown item type: ${type}`);
    return null;
}

export async function getManifestId(): Promise<string> {
    const response = await fetch(
        "https://api.github.com/repos/ByMykel/counter-strike-file-tracker/contents/static/manifestId.txt"
    );
    const data = (await response.json()) as { content: string };
    // Decode base64 content and trim whitespace
    return Uint8Array.fromBase64(data.content).toString().trim();
}

export async function loadData(): Promise<State> {
    // Load async data first
    const [itemsGame, cdnImages] = await Promise.all([loadItemsGame(), loadImagesInventory()]);

    // Load base processed data
    const prefabs = loadPrefabs(itemsGame);
    const items = loadItems(itemsGame, prefabs);
    const itemSets = loadItemSets(itemsGame);
    const { stickerKits, stickerKitsObj, players } = loadStickerKits(itemsGame);
    const { keychainDefinitions, keychainDefinitionsObj } = loadKeychainDefinitions(itemsGame);
    const paintKits = loadPaintKits(itemsGame);
    const { musicDefinitions, musicDefinitionsObj } = loadMusicDefinitions(itemsGame);
    const clientLootLists = itemsGame.client_loot_lists;
    const revolvingLootLists = itemsGame.revolving_loot_lists;
    const rarities = loadRarities(clientLootLists);

    // Create context for getItemFromKey
    const getItemFromKeyCtx: GetItemFromKeyContext = {
        items,
        itemsGame,
        rarities,
        paintKits,
        stickerKitsObj,
        musicDefinitionsObj,
        keychainDefinitionsObj,
        cdnImages,
    };

    // Create bound getItemFromKey function
    const getItemFromKeyFn = (key: string) => getItemFromKey(key, getItemFromKeyCtx);

    // Load derived data that depends on getItemFromKey
    const skinsByCrates = loadSkinsByCrates(clientLootLists, revolvingLootLists, getItemFromKeyFn);
    const cratesBySkins = loadCratesBySkins(skinsByCrates, revolvingLootLists, items, cdnImages);
    const skinsByCollections = loadSkinsByCollections(itemsGame, getItemFromKeyFn);
    const cratesByCollections = loadCratesByCollections(skinsByCollections, cratesBySkins);
    const collectionsBySkins = loadCollectionsBySkins(skinsByCollections, itemsGame.item_sets, cdnImages);
    const collectionsByStickers = loadCollectionsByStickers(itemsGame.item_sets, cdnImages, getItemFromKeyFn);
    const souvenirSkins = loadSouvenirSkins(items, revolvingLootLists, skinsByCrates);
    const stattTrakSkins = loadStattrakSkins(itemSets, items);
    const highlightReels = loadHighlights(itemsGame, players);
    const proTeams = loadProTeams(itemsGame);
    const proPlayers = loadProPlayers(itemsGame);

    // Assign to state
    const state = {
        itemsGame,
        itemSets,
        stickerKits,
        stickerKitsObj,
        players,
        keychainDefinitions,
        keychainDefinitionsObj,
        items,
        prefabs,
        paintKits,
        musicDefinitions,
        musicDefinitionsObj,
        clientLootLists,
        revolvingLootLists,
        rarities,
        skinsByCrates,
        cratesBySkins,
        skinsByCollections,
        cratesByCollections,
        collectionsBySkins,
        collectionsByStickers,
        souvenirSkins,
        stattTrakSkins,
        highlightReels,
        proTeams,
        proPlayers,
        cdnImages,
    };
    return state;
}
