import { getImageUrl } from "../constants.js";
import type { ProcessedItem } from "../types.js";
import { getRarityColor } from "../utils/index.js";

import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function isAgent(item: ProcessedItem): boolean {
    return item.prefab === "customplayertradable";
}

function parseItem(
    item: ProcessedItem,
    state: {
        collectionsBySkins: State["collectionsBySkins"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { collectionsBySkins, cdnImages } = state;
    if (!item.item_name || !item.item_description || !item.used_by_classes) {
        throw Error(`Item ${item.name} is missing fields`);
    }
    const image =
        cdnImages[`econ/characters/${item.name.toLocaleLowerCase()}`] ??
        getImageUrl(`econ/characters/${item.name.toLocaleLowerCase()}`);

    return {
        id: `agent-${item.object_id}`,
        name: $t(item.item_name, false, languageResource),
        description: $t(item.item_description, false, languageResource),
        def_index: item.object_id,
        rarity: {
            id: `rarity_${item.item_rarity}_character`,
            name: $t(`rarity_${item.item_rarity}_character`, false, languageResource),
            color: getRarityColor(`rarity_${item.item_rarity}_character`),
        },
        collections: collectionsBySkins?.[`agent-${item.object_id}`]?.map(i => ({
            ...i,
            name: $t(i.name, false, languageResource),
        })),
        team: {
            id: Object.keys(item.used_by_classes)[0],
            name:
                Object.keys(item.used_by_classes)[0] === "counter-terrorists"
                    ? $t("inv_filter_ct", false, languageResource)
                    : $t("inv_filter_t", false, languageResource),
        },
        market_hash_name: $t(item.item_name, true, languageResource),
        image,
        model_player: item.model_player ?? null,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            image_inventory: `econ/characters/${item.name.toLocaleLowerCase()}`,
        },
    };
}

export function getAgents(
    state: {
        items: State["items"];
        collectionsBySkins: State["collectionsBySkins"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const agents = Object.values(state.items)
        .filter(isAgent)
        .map(item => parseItem(item, state, languageResource));

    return agents;
}
