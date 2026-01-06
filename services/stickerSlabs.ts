import { getImageUrl } from "../constants.js";
import type { ProcessedStickerKit } from "../types.js";
import { getRarityColor } from "../utils/index.js";
import specialNotes from "../utils/specialNotes.json" with { type: "json" };

import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

// Extended type for sticker slabs with additional tournament properties
type StickerKitWithTournament = ProcessedStickerKit & {
    tournament_player_id?: number;
    tournament_team_id?: number;
};

function isSticker(item: ProcessedStickerKit): boolean {
    if (item.sticker_material === undefined) {
        return false;
    }

    // https://github.com/ByMykel/CSGO-API/issues/208
    // Theses team roles stickers are not avaliable in the game, so we don't need to parse them
    if (
        item.sticker_material.startsWith("team_roles_capsule") &&
        item.sticker_material.endsWith("_foil") &&
        item.sticker_material !== "team_roles_capsule/pro_foil"
    ) {
        return false;
    }

    // https://github.com/ByMykel/CSGO-API/issues/209
    // These stickers are not avaliable in the game, so we don't need to parse them
    // Sticker | 3DMAX | DreamHack 2014
    // Sticker | dAT team | DreamHack 2014
    // Sticker | London Conspiracy | DreamHack 2014
    // Sticker | mousesports | DreamHack 2014
    if (["232", "234", "235", "236"].includes(item.object_id)) {
        return false;
    }

    if (!item.item_name.toLowerCase().includes("stickerkit_")) {
        return false;
    }

    if (item.name.includes("graffiti")) {
        return false;
    }

    if (item.name.includes("spray_")) {
        return false;
    }

    return true;
}

function getDescription(languageResource: LanguageResource): string {
    return `${$t("keychain_kc_sticker_display_case_desc", false, languageResource) || ""}<br><br>${$t("csgo_tool_keychain_desc", false, languageResource) || ""}`;
}

function getType(item: StickerKitWithTournament): string {
    if (item.tournament_player_id) {
        return "Autograph";
    }

    if (item.tournament_team_id) {
        return "Team";
    }

    if (item.tournament_event_id) {
        return "Event";
    }

    return "Other";
}

function getEffect(item: { item_name: string | null }, languageResource: LanguageResource): string {
    const itemName = $t(item.item_name ?? "", true, languageResource) || "";
    if (itemName.includes("(Holo)") || itemName.includes("(Holo, ")) {
        return "Holo";
    }

    if (itemName.includes("(Foil)")) {
        return "Foil";
    }

    if (itemName.includes("(Lenticular)")) {
        return "Lenticular";
    }

    if (itemName.includes("(Glitter)") || itemName.includes("(Glitter, ")) {
        return "Glitter";
    }

    if (itemName.includes("(Gold)") || itemName.includes("(Gold, ")) {
        return "Gold";
    }

    if (itemName.includes("(Embroidered)") || itemName.includes("(Embroidered, ")) {
        return "Embroidered";
    }

    return "Other";
}

function getMarketHashName(
    item: StickerKitWithTournament,
    languageResource: LanguageResource
): string | null {
    // 1 - DreamHack 2013
    if (item.tournament_event_id === 1) {
        return null;
    }

    // 3 - Katowice 2014
    if (item.tournament_event_id === 3) {
        if (
            (getType(item) === "Event" && item.sticker_material?.includes("gold_foil")) ||
            (getEffect(item, languageResource) === "Foil" && getType(item) === "Team")
        ) {
            return null;
        }
    }

    // 4 - Cologne 2014
    if (item.tournament_event_id === 4) {
        if (getEffect(item, languageResource) === "Foil" || item.sticker_material === "cologne2014/esl_c") {
            return null;
        }
    }

    // 5 - DreamHack 2014,
    // 6 - Katowice 2015,
    // 7 - Cologne 2015,
    // 8 - Cluj-Napoca 2015
    // 9 - Columbus 2016
    // 10 - Cologne 2016
    // 11 - Atlanta 2017
    // 12 - Krakow 2017
    // 13 - Boston 2018
    // 14 - London 2018
    // 15 - Katowice 2019
    // 16 - Berlin 2019
    if (
        item.tournament_event_id &&
        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(item.tournament_event_id)
    ) {
        if (item.item_rarity === "legendary" && getEffect(item, languageResource) === "Gold") {
            return null;
        }
    }

    if (
        item.sticker_material?.startsWith("tournament_assets/") ||
        item.sticker_material?.startsWith("danger_zone/")
    ) {
        return null;
    }

    return `${$t("keychain_kc_sticker_display_case", true, languageResource)} | ${$t(item.item_name, true, languageResource)}`;
}

function parseItem(item: StickerKitWithTournament, state: State, languageResource: LanguageResource) {
    const { cratesBySkins, proTeams, proPlayers, collectionsByStickers, cdnImages } = state;

    const stickerMaterial = item.sticker_material || "";
    const image =
        cdnImages[`econ/stickers/${stickerMaterial.toLowerCase()}_1355_37`] ??
        getImageUrl(`econ/stickers/${stickerMaterial.toLowerCase()}_1355_37`);

    // items_game.txt is named as dignitas but in translation as teamdignitas.
    if (item.item_name === "#StickerKit_dhw2014_dignitas_gold") {
        item.item_name = "#StickerKit_dhw2014_teamdignitas_gold";
    }

    return {
        id: `sticker_slab-${item.object_id}`,
        name: `${$t("keychain_kc_sticker_display_case", false, languageResource)} | ${$t(item.item_name, false, languageResource)}`,
        description: getDescription(languageResource),
        def_index: item.object_id,
        rarity: item.item_rarity
            ? {
                  id: `rarity_${item.item_rarity}`,
                  name: $t(`rarity_${item.item_rarity}`, false, languageResource),
                  color: getRarityColor(`rarity_${item.item_rarity}`),
              }
            : {
                  id: "rarity_default",
                  name: $t("rarity_default", false, languageResource),
                  color: getRarityColor("rarity_default"),
              },
        special_notes: specialNotes?.[`sticker-${item.object_id}` as keyof typeof specialNotes],
        crates:
            cratesBySkins?.[`sticker-${item.object_id}` as keyof typeof cratesBySkins]?.map(i => ({
                ...i,
                name: $t(i.name, false, languageResource),
            })) ?? [],
        collections:
            collectionsByStickers?.[`sticker-${item.object_id}` as keyof typeof collectionsByStickers]?.map(
                i => ({
                    ...i,
                    name: $t(i.name, false, languageResource),
                })
            ) ?? [],
        type: getType(item),
        market_hash_name: getMarketHashName(item, languageResource),
        effect: getEffect(item, languageResource),
        tournament: item.tournament_event_id
            ? {
                  id: item.tournament_event_id,
                  name: $t(
                      `csgo_tournament_event_nameshort_${item.tournament_event_id}`,
                      false,
                      languageResource
                  ),
              }
            : undefined,
        team:
            item.tournament_team_id && proTeams[item.tournament_team_id]
                ? {
                      ...proTeams[item.tournament_team_id],
                      name: $t(`csgo_teamid_${item.tournament_team_id}`, false, languageResource),
                  }
                : undefined,
        player: item.tournament_player_id ? proPlayers[item.tournament_player_id] : undefined,
        image,

        // Return original attributes from item_game.json
        original: {
            name: item.name,
            image_inventory: `econ/stickers/${stickerMaterial.toLowerCase()}_1355_37`,
        },
    };
}

export function getStickerSlabs(state: State, languageResource: LanguageResource) {
    const stickers = state.stickerKits
        .filter(isSticker)
        .map(item => parseItem(item, state, languageResource));

    return stickers;
}
