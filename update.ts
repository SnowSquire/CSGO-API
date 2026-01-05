import * as fs from "node:fs/promises";
import { get } from "node:http";
import { CSGO_ENGLISH_URL, DEFAULT_LANGUAGE, LANGUAGES_URL } from "./constants.js";
import { getAgents } from "./services/agents.js";
import { getBaseWeapons } from "./services/baseWeapons.js";
import { getCollectibles } from "./services/collectibles.js";
import { getCollections } from "./services/collections.js";
import { getCrates } from "./services/crates.js";
import { getGraffiti } from "./services/graffiti.js";
import { getHighlights } from "./services/highlights.js";
import { getKeychains } from "./services/keychains.js";
import { getKeys } from "./services/keys.js";
import { getManifestId, loadData, state } from "./services/main.js";
import { getMusicKits } from "./services/musicKits.js";
import { getPatches } from "./services/patches.js";
import { getSkins } from "./services/skins.js";
import { getSkinsNotGrouped } from "./services/skinsNotGrouped.js";
import { getStickerSlabs } from "./services/stickerSlabs.js";
import { getStickers } from "./services/stickers.js";
import { getTools } from "./services/tools.js";
import { getTranslations, type LanguageResource } from "./services/translations.js";
import { saveDataJson } from "./utils/saveDataJson.js";

async function main() {
    const args = process.argv.slice(2);
    const isForce = args.includes("--force");

    const [existingManifestId, latestManifestId] = await Promise.all([
        Bun.file("./manifestIdUpdate.txt")
            .text()
            .catch(() => null),
        getManifestId(),
    ]);

    if (isForce) {
        console.log("Force flag detected, generating new data regardless of manifest Ids");
    } else {
        // TODO: Need to check if default_generated.json from counter-strike-image-tracker repo has changed,
        // since we now pull data from there too.
        if (existingManifestId === latestManifestId) {
            console.log("Latest manifest Id matches existing manifest Id, exiting");
            process.exit(0);
        } else {
            console.log("Latest manifest Id does not match existing manifest Id, generating new data.");
        }
    }
    const state = await loadData();
    type LanguageData = { translationByKey: Record<string, string>; translationKeyByIndex: string[] };

    const translationData: Record<
        string, // Languge Id
        LanguageData
    > = {};

    await Promise.all(
        LANGUAGES_URL.map(async language => {
            const data = await getTranslations(language.url);
            translationData[language.language] = {
                translationByKey: data.lowerCaseKeys,
                translationKeyByIndex: data.lowerCaseKeysIdx,
            };
        })
    );

    if (!translationData[DEFAULT_LANGUAGE]) {
        throw Error(
            `Default language ${DEFAULT_LANGUAGE} translations not loaded, please add it to constants.ts`
        );
    }

    for (const language of LANGUAGES_URL) {
        const languageresource: LanguageResource = {
            default: translationData[DEFAULT_LANGUAGE].translationByKey,
            default_idx: translationData[DEFAULT_LANGUAGE].translationKeyByIndex,
            selected: translationData[language.language]!.translationByKey,
            selected_idx: translationData[language.language]!.translationKeyByIndex,
        };
        try {
            const agents = getAgents(state, languageresource);
            const collectibles = getCollectibles(state, languageresource, language.folder);
            // getCollections();
            // getCrates();
            // getGraffiti();
            // getKeys();
            // getMusicKits();
            // getPatches();
            // getSkins();
            // getSkinsNotGrouped();
            // getStickers();
            // getStickerSlabs();
            // getKeychains();
            // getTools();
            // getBaseWeapons();
            // getHighlights();

            Promise.all([
                saveDataJson(`./public/api/${language.folder}/agents.json`, agents),
                saveDataJson(`./public/api/${language.folder}/collectibles.json`, collectibles),
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    await fs.writeFile("./manifestIdUpdate.txt", latestManifestId.toString());
}
if (import.meta.main) {
    main();
}
