import { getImageUrl } from "../constants.js";
import type { ProcessedStickerKit } from "../types.js";
import { getRarityColor } from "../utils/index.js";
import specialNotes from "../utils/specialNotes.json" with { type: "json" };
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function isSticker(item: ProcessedStickerKit) {
    if (item.sticker_material === undefined) {
        return false;
    }

    if (
        item.sticker_material.startsWith("team_roles_capsule") &&
        item.sticker_material.endsWith("_foil") &&
        item.sticker_material !== "team_roles_capsule/pro_foil"
    ) {
        return false;
    }

    if (["232", "234", "235", "236"].includes(item.object_id)) {
        return false;
    }

    if (!item.item_name?.toLowerCase().includes("stickerkit_")) {
        return false;
    }

    if (item.name?.includes("graffiti")) {
        return false;
    }

    if (item.name?.includes("spray_")) {
        return false;
    }

    return true;
}

function getDescription(item: any, languageResource: LanguageResource) {
    const commemoratesText = item.tournament_event_id
        ? `<span style='color:#ffd700;'>${$t(`csgo_event_desc`, false, languageResource)?.replace("%s1", $t(`csgo_tournament_event_name_${item.tournament_event_id}`, false, languageResource) || "") || ""}</span><br/><br/> `
        : "";

    const msg = $t("CSGO_Tool_Sticker_Desc", false, languageResource);
    const desc = $t(item.description_string, false, languageResource);
    if (desc && desc.length > 0 && item.description_string !== `#${desc}`) {
        return `${commemoratesText}${msg}<br><br>${desc}`;
    }
    return `${commemoratesText}${msg}`;
}

function getType(item: any) {
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

function getEffect(item: any, languageResource: LanguageResource) {
    const raw = $t(item.item_name!, true, languageResource);
    if (!raw) return "Other";

    if (raw.includes("(Holo)") || raw.includes("(Holo, ")) {
        return "Holo";
    }

    if (raw.includes("(Foil)")) {
        return "Foil";
    }

    if (raw.includes("(Lenticular)")) {
        return "Lenticular";
    }

    if (raw.includes("(Glitter)") || raw.includes("(Glitter, ")) {
        return "Glitter";
    }

    if (raw.includes("(Gold)") || raw.includes("(Gold, ")) {
        return "Gold";
    }

    if (raw.includes("(Embroidered)") || raw.includes("(Embroidered, ")) {
        return "Embroidered";
    }

    return "Other";
}

function getMarketHashName(item: any, languageResource: LanguageResource) {
    if (item.tournament_event_id === 1) {
        return null;
    }

    if (item.tournament_event_id === 3) {
        if (
            (getType(item) === "Event" && item.sticker_material?.includes("gold_foil")) ||
            (getEffect(item, languageResource) === "Foil" && getType(item) === "Team")
        ) {
            return null;
        }
    }

    if (item.tournament_event_id === 4) {
        if (getEffect(item, languageResource) === "Foil" || item.sticker_material === "cologne2014/esl_c") {
            return null;
        }
    }

    if ([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].includes(item.tournament_event_id)) {
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

    return `${$t("csgo_tool_sticker", true, languageResource)} | ${$t(item.item_name!, true, languageResource)}`;
}

function parseItem(
    item: any,
    state: {
        cratesBySkins: State["cratesBySkins"];
        proTeams: State["proTeams"];
        proPlayers: State["proPlayers"];
        collectionsByStickers: State["collectionsByStickers"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { cratesBySkins, proTeams, proPlayers, collectionsByStickers, cdnImages } = state;

    const image =
        cdnImages[`econ/stickers/${item.sticker_material!.toLowerCase()}`] ??
        getImageUrl(`econ/stickers/${item.sticker_material!.toLowerCase()}`);

    if (item.item_name === "#StickerKit_dhw2014_dignitas_gold") {
        item.item_name = "#StickerKit_dhw2014_teamdignitas_gold";
    }

    return {
        id: `sticker-${item.object_id}`,
        name: `${$t("csgo_tool_sticker", false, languageResource)} | ${$t(item.item_name!, false, languageResource)}`,
        description: getDescription(item, languageResource),
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
            cratesBySkins?.[`sticker-${item.object_id}` as keyof typeof cratesBySkins]?.map((i: any) => ({
                ...i,
                name: $t(i.name, false, languageResource),
            })) ?? [],
        collections:
            collectionsByStickers?.[`sticker-${item.object_id}` as keyof typeof collectionsByStickers]?.map(
                (i: any) => ({
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
        team: proTeams[item.tournament_team_id]
            ? {
                  ...proTeams[item.tournament_team_id],
                  name: $t(`csgo_teamid_${item.tournament_team_id}`, false, languageResource),
              }
            : undefined,
        player: proPlayers[item.tournament_player_id] ?? undefined,
        image,

        original: {
            name: item.name,
            image_inventory: `econ/stickers/${item.sticker_material!.toLowerCase()}`,
        },
    };
}

export function getStickers(
    state: {
        stickerKits: State["stickerKits"];
        cratesBySkins: State["cratesBySkins"];
        proTeams: State["proTeams"];
        proPlayers: State["proPlayers"];
        collectionsByStickers: State["collectionsByStickers"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { stickerKits } = state;

    const stickers = stickerKits
        .filter(isSticker)
        .map((item: any) => parseItem(item, state, languageResource));

    return stickers;
}
