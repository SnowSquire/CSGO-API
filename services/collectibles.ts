import { getImageUrl } from "../constants.js";
import type { CustomTranslation, ProcessedItem } from "../types.js";
import { getCollectibleRarity, getRarityColor } from "../utils/index.js";

import type { State } from "./main.js";
import { $t, $tc, type LanguageResource } from "./translations.js";

function isCollectible(item: ProcessedItem) {
    if (item.item_name === undefined) return false;

    if (item.item_name.startsWith("#CSGO_Collectible")) {
        return true;
    }

    if (item.item_name.startsWith("#CSGO_TournamentJournal")) {
        return true;
    }

    if (item.item_name.startsWith("#CSGO_TournamentPass") || item.item_name.startsWith("#CSGO_Ticket_")) {
        return true;
    }

    return false;
}

function getType(collectible: ProcessedItem) {
    if (collectible.image_inventory?.includes("service_medal")) {
        return "Service Medal";
    }

    if (collectible.item_name?.startsWith("#CSGO_Collectible_Map")) {
        return "Map Contributor Coin";
    }

    if (collectible.item_name?.startsWith("#CSGO_TournamentJournal")) {
        return "Pick'Em Coin";
    }

    if (collectible.item_name?.startsWith("#CSGO_Collectible_Pin")) {
        return "Pin";
    }

    if (
        collectible.item_name?.startsWith("#CSGO_TournamentPass") &&
        collectible.item_name?.endsWith("_charge")
    ) {
        return "Souvenir Token";
    }

    if (collectible.item_name?.startsWith("#CSGO_TournamentPass")) {
        return "Tournament Pass";
    }

    if (collectible.item_name?.startsWith("#CSGO_Ticket_")) {
        return "Operation Pass";
    }

    if (collectible.item_name?.startsWith("#CSGO_Collectible_CommunitySeason")) {
        if (collectible?.prefab === "valve season_tiers") {
            return "Stars for Operation";
        }

        return "Operation Coin";
    }

    if (collectible?.attributes?.["tournament event id"] !== undefined) {
        if (collectible.item_name?.includes("PickEm")) {
            return "Old Pick'Em Trophy";
        }

        if (collectible.item_name?.includes("Fantasy")) {
            return "Fantasy Trophy";
        }

        return "Tournament Finalist Trophy";
    }

    if (collectible.prefab === "premier_season_coin") {
        return "Premier Season Coin";
    }

    return null;
}

function getMarketHashName(item: ProcessedItem, languageResource: LanguageResource) {
    const isAttendance = item.prefab === "attendance_pin";
    const isCannotTrade = item.attributes?.["cannot trade"];

    if (isCannotTrade) {
        return null;
    }
    if (
        ["Pin", "Souvenir Token", "Tournament Pass", "Operation Pass"].includes(getType(item) as string) &&
        !isAttendance
    ) {
        return $t(item.item_name!, true, languageResource);
    }

    return null;
}

function parseItem(
    item: ProcessedItem,
    state: { cdnImages: State["cdnImages"] },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { cdnImages } = state;
    const isAttendance = item.prefab === "attendance_pin";
    const rarity = item.item_rarity ? `rarity_${item.item_rarity}` : getCollectibleRarity(item.prefab);

    if (!item.item_name || rarity === null || !item.image_inventory) {
        throw Error(`Item is missing fields`);
    }

    const image = cdnImages[item.image_inventory] ?? getImageUrl(item.image_inventory);
    return {
        id: `collectible-${item.object_id}`,
        name: isAttendance
            ? $tc(
                  "collectible_genuine",
                  {
                      genuine: $t("genuine", false, languageResource)!,
                      item_name: $t(item.item_name, false, languageResource)!,
                  },
                  language
              )
            : $t(item.item_name, false, languageResource),
        description: item.item_description
            ? $t(item.item_description, false, languageResource)
            : item.item_description_prefab
              ? $t(item.item_description_prefab, false, languageResource)
              : null,
        def_index: item.object_id,
        rarity: {
            id: rarity,
            name: $t(rarity, false, languageResource),
            color: getRarityColor(rarity),
        },
        type: getType(item),
        genuine: isAttendance,
        premier_season: item.attributes?.["premier season"],
        market_hash_name: getMarketHashName(item, languageResource),
        image,

        // Return original attributes from item_game.json
        original: {
            item_name: item.item_name,
            image_inventory: item.image_inventory,
        },
    };
}

export function getCollectibles(
    state: { items: State["items"]; cdnImages: State["cdnImages"] },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { items } = state;

    const collectibles = Object.values(items)
        .filter(isCollectible)
        .map(item => parseItem(item, state, languageResource, language))
        .filter(collectible => collectible.name);

    return collectibles;
}
