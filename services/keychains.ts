import { getImageUrl } from "../constants.js";
import type { ProcessedKeychainDefinition } from "../types.js";
import { getRarityColor } from "../utils/index.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function isKeychain(item: ProcessedKeychainDefinition): boolean {
    if (!item.loc_name?.startsWith("#keychain_")) {
        return false;
    }

    if (item["is commodity"]) {
        return false;
    }

    return true;
}

function getMarketHashName(item: ProcessedKeychainDefinition, languageResource: LanguageResource): string {
    return `${$t("CSGO_Tool_Keychain", true, languageResource)} | ${$t(item.loc_name!, true, languageResource)}`;
}

function parseItem(
    item: ProcessedKeychainDefinition,
    state: {
        collectionsBySkins: State["collectionsBySkins"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { collectionsBySkins, cdnImages } = state;
    const image =
        cdnImages[item.image_inventory!.toLowerCase()] ?? getImageUrl(item.image_inventory!.toLowerCase());

    return {
        id: `keychain-${item.object_id}`,
        name: `${$t("CSGO_Tool_Keychain", false, languageResource)} | ${$t(item.loc_name!, false, languageResource)}`,
        description: $t("csgo_tool_keychain_desc", false, languageResource),
        def_index: item.object_id,
        rarity: {
            id: `rarity_${item.item_rarity}`,
            name: $t(`rarity_${item.item_rarity}`, false, languageResource),
            color: getRarityColor(`rarity_${item.item_rarity}`),
        },
        collections:
            collectionsBySkins[`keychain-${item.object_id}`]?.map(i => ({
                ...i,
                name: $t(i.name, false, languageResource),
            })) ?? [],
        market_hash_name: getMarketHashName(item, languageResource),
        image,

        // Return original attributes from item_game.json
        original: {
            loc_name: item.loc_name,
            image_inventory: item.image_inventory!.toLowerCase(),
        },
    };
}

export function getKeychains(
    state: {
        keychainDefinitions: State["keychainDefinitions"];
        collectionsBySkins: State["collectionsBySkins"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { keychainDefinitions } = state;

    const keychains = keychainDefinitions
        .filter(isKeychain)
        .map(item => parseItem(item, state, languageResource));

    return keychains;
}
