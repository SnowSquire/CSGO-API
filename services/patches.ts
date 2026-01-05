import { getImageUrl } from "../constants.js";
import type { ProcessedStickerKit } from "../types.js";
import { getRarityColor } from "../utils/index.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function isPatch(item: ProcessedStickerKit) {
    if (item.patch_material && ["case_skillgroups/patch_legendaryeagle"].includes(item.patch_material)) {
        return false;
    }

    return !(item.patch_material === undefined);
}

function getDescription(item: ProcessedStickerKit, languageResource: LanguageResource) {
    let msg = $t("CSGO_Tool_Patch_Desc", false, languageResource);
    const desc = $t(item.description_string, false, languageResource);
    if (desc && desc.length > 0) {
        msg = `${msg}<br><br>${desc}`;
    }
    return msg;
}

function parseItem(
    item: ProcessedStickerKit,
    state: { cdnImages: State["cdnImages"] },
    languageResource: LanguageResource
) {
    const { cdnImages } = state;
    const image =
        cdnImages[`econ/patches/${item.patch_material}`] ??
        getImageUrl(`econ/patches/${item.patch_material}`);

    return {
        id: `patch-${item.object_id}`,
        name: `${$t("csgo_tool_patch", false, languageResource)} | ${$t(item.item_name!, false, languageResource)}`,
        description: getDescription(item, languageResource),
        def_index: item.object_id,
        rarity: {
            id: `rarity_${item.item_rarity}`,
            name: $t(`rarity_${item.item_rarity}`, false, languageResource),
            color: getRarityColor(`rarity_${item.item_rarity}`),
        },
        market_hash_name: `${$t("csgo_tool_patch", true, languageResource)} | ${$t(item.item_name!, true, languageResource)}`,
        image,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            image_inventory: `econ/patches/${item.patch_material}`,
        },
    };
}

export function getPatches(
    state: {
        stickerKits: State["stickerKits"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { stickerKits } = state;

    const patches = stickerKits.filter(isPatch).map(item => parseItem(item, state, languageResource));

    return patches;
}
