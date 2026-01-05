import type { CustomTranslation, ProcessedHighlightReel } from "../types.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

function parseItem(
    item: ProcessedHighlightReel,
    state: { cdnImages: State["cdnImages"] },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { cdnImages } = state;
    const [tournament, highlightType] = item.id.split("_");
    const keychainName = $t(`keychain_kc_${tournament}`, false, languageResource);
    const highlightName = $t(`highlightreel_${tournament}_${highlightType}`, false, languageResource);
    const keychainNameRaw = $t(`keychain_kc_${tournament}`, true, languageResource);
    const highlightNameRaw = $t(`highlightreel_${tournament}_${highlightType}`, true, languageResource);

    const getThumbnail = () => {
        // Only Austin 2025 has chinese thumbnail
        if (![24].includes(item.tournament_event_id)) {
            return item.thumbnail;
        }

        return language === "zh-CN" ? item.thumbnail.replace("/ww/", "/cn/") : item.thumbnail;
    };

    return {
        id: `highlight-${item.highlight_reel}`,
        def_index: item.highlight_reel,
        // TODO: translate Souvenir Charm to other languages
        name: `Souvenir Charm | ${keychainName} | ${highlightName}`,
        description: $t(`highlightdesc_${tournament}_${highlightType}`, false, languageResource),
        tournament_event:
            $t(`csgo_watch_cat_tournament_${item.tournament_event_id}`, false, languageResource) ??
            $t(`csgo_tournament_event_location_${item.tournament_event_id}`, false, languageResource) ??
            undefined,
        team0: $t(`csgo_teamid_${item.tournament_event_team0_id}`, false, languageResource),
        team1: $t(`csgo_teamid_${item.tournament_event_team1_id}`, false, languageResource),
        stage: $t(`csgo_tournament_event_stage_${item.tournament_event_stage_id}`, false, languageResource),
        tournament_player: item.tournament_player,
        map: item.tournament_event_map,
        market_hash_name: `Souvenir Charm | ${keychainNameRaw} | ${highlightNameRaw}`,
        image: cdnImages[item.image_inventory] ?? item.image,
        video: language === "zh-CN" ? item.video.replace("_ww_", "_cn_") : item.video,
        // TODO: would be great to have chinese thumbnail as well
        thumbnail: getThumbnail(),
        original: {
            id: item.id,
            image_inventory: item.image_inventory,
        },
    };
}

export function getHighlights(
    state: {
        highlightReels: State["highlightReels"];
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { highlightReels } = state;

    const highlights = highlightReels.map(item => parseItem(item, state, languageResource, language));

    return highlights;
}
