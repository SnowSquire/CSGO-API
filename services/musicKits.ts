import { getImageUrl } from "../constants.js";
import type { ProcessedMusicDefinition } from "../types.js";
import { getRarityColor, isExclusive } from "../utils/index.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function getDescription(
    item: ProcessedMusicDefinition,
    isStattrak: boolean,
    languageResource: LanguageResource
): string {
    const stattrakText = isStattrak
        ? `<span style='color:#99ccff;'>${$t("attrib_killeater", false, languageResource)}</span><br/><br/><span style='color:#cf6a32;'>${$t("killeaterdescriptionnotice_ocmvps", false, languageResource)}</span><br/><br/>`
        : "";

    return `${stattrakText}${$t("csgo_musickit_desc", false, languageResource)}<br/><br/>${$t(item.loc_description, false, languageResource)}`;
}

function parseItem(
    item: ProcessedMusicDefinition,
    state: { cdnImages: State["cdnImages"] },
    languageResource: LanguageResource
) {
    const { cdnImages } = state;
    const image =
        cdnImages[item.image_inventory!.toLowerCase()] ?? getImageUrl(item.image_inventory!.toLowerCase());
    const exclusive = isExclusive(item.name);
    const valve = ["valve_01", "valve_02", "valve_cs2_01"].includes(item.name);

    // If I'm not mistaken, these are the same based on these pictures:
    // https://counterstrike.fandom.com/wiki/Music_Kit/Valve,_CS_GO
    if (item.name === "valve_02") {
        item.name = "valve_01";
        item.loc_name = "#musickit_valve_csgo_01";
        item.loc_description = "#musickit_valve_csgo_01_desc";
    }

    const kitsOnlyStattrak = [
        "beartooth_02",
        "blitzkids_01",
        "hundredth_01",
        "neckdeep_01",
        "roam_01",
        "twinatlantic_01",
        "skog_03",
    ];

    const kits = [];

    if (!kitsOnlyStattrak.includes(item.name)) {
        const normalMusicKit = {
            id: `music_kit-${item.object_id}`,
            name:
                exclusive || valve
                    ? $t(item.loc_name, false, languageResource)
                    : $t(item.coupon_name!, false, languageResource),
            description: getDescription(item, false, languageResource),
            def_index: item.object_id,
            rarity: {
                id: "rarity_rare",
                name: $t("rarity_rare", false, languageResource),
                color: getRarityColor(`rarity_rare`),
            },
            market_hash_name:
                exclusive || valve
                    ? null
                    : `Music Kit | ${$t(`musickit_${item.name}`, true, languageResource)}`,
            exclusive,
            image,

            // Return original attributes from item_game.json
            original: {
                name: item.name,
                image_inventory: item.image_inventory!.toLowerCase(),
            },
        };

        kits.push(normalMusicKit);
    }

    if ($t(`${item.coupon_name}_stattrak`, false, languageResource)) {
        const stattrakMusicKit = {
            id: `music_kit-${item.object_id}_st`,
            name: $t(`${item.coupon_name}_stattrak`, false, languageResource),
            description: getDescription(item, true, languageResource),
            def_index: item.object_id,
            rarity: {
                id: "rarity_rare",
                name: $t("rarity_rare", false, languageResource),
                color: getRarityColor(`rarity_rare`),
            },
            market_hash_name: exclusive
                ? null
                : `StatTrak™ Music Kit | ${$t(`musickit_${item.name}`, true, languageResource)}`,
            exclusive: false,
            image,

            // Return original attributes from item_game.json
            original: {
                name: item.name,
                image_inventory: item.image_inventory!.toLowerCase(),
            },
        };

        kits.push(stattrakMusicKit);
    }

    return kits;
}

export function getMusicKits(
    state: {
        musicDefinitions: State["musicDefinitions"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
) {
    const { musicDefinitions } = state;

    const musicKits = musicDefinitions
        .map(item => parseItem(item, state, languageResource))
        .reduce((acc, kits) => {
            acc.push(...kits);
            return acc;
        }, []);

    return musicKits;
}
