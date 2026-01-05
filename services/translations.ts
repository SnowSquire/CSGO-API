import { type } from "arktype";
import axios from "axios";
import type { CustomTranslation } from "../types";
import customTranslations from "../utils/translations.json" with { type: "json" };

export type LanguageResource = {
    default: Record<string, string>;
    default_idx: string[];
    selected: Record<string, string>;
    selected_idx: string[];
};

export function $t(key: string, useDefault = false, languageResource: LanguageResource) {
    if (key == null) debugger;
    key = key.replace("#", "").toLowerCase();

    if (useDefault) {
        return languageResource.default[key] ?? null;
    }

    return languageResource.selected[key] ?? languageResource.default[key] ?? null;
}

export function $tTag(key: string, useDefault = false, languageResource: LanguageResource) {
    // Normalize the key: remove '#' prefix and convert to lowercase
    key = key.replace("#", "").toLowerCase();

    // Select which translation set to use (default language or selected language)
    const target = useDefault ? languageResource.default : languageResource.selected;
    const targetIdx = useDefault ? languageResource.default_idx : languageResource.selected_idx;

    // Find the index position of the key in the ordered array
    const search = targetIdx.indexOf(key);

    // If the key was found, search backwards for the parent tag
    if (search !== -1) {
        // Start from the found key and search backwards through the array
        for (let i = search; i >= 0; i--) {
            // Find the first key that does NOT contain "_tag" (this is the parent tag)
            if (!targetIdx[i]!.toLowerCase().includes("_tag")) {
                // Return the value of the parent tag from the translations object
                return target[targetIdx[i]!];
            }
        }
    }

    // Return null if no key is found or no parent tag is found
    return null;
}

export function $tc(
    key: keyof (typeof customTranslations)[keyof typeof customTranslations],
    data: Record<string, string> = {},
    language: CustomTranslation
) {
    const all = customTranslations[language];

    if (!all) {
        throw new Error(`translations for '${language}' not found`);
    }

    const specific = all[key];

    if (!specific) {
        throw new Error(`key '${key}' does not exist in '${language}' translations`);
    }

    const replaced = specific.replace(/\{.*?\}/g, (match: string) => {
        const key = match.replace("{", "").replace("}", "");

        if (!(key in data)) {
            throw new Error(`$tc data key {${key}} not provided`);
        }

        return data[key];
    });

    return replaced;
}

const TranslationData = type({
    lang: {
        Language: "string",
        Tokens: type.Record(
            "string",
            type("string | number").pipe(x => x.toString())
        ),
    },
});

export async function getTranslations(url: string) {
    const res = await axios.get(url);
    const langData = TranslationData.assert(res.data);

    const lowerCaseKeys = Object.fromEntries(
        Object.entries(langData.lang.Tokens).map(([key, val]) => [key.toLowerCase(), val])
    );

    const lowerCaseKeysIdx = [];
    for (const key in lowerCaseKeys) {
        lowerCaseKeysIdx.push(key);
    }

    return { lowerCaseKeys, lowerCaseKeysIdx };
}

// export async function loadTranslations({ language, url, folder }: (typeof LANGUAGES_URL)[number]) {
//     if (wherrrrrrrrrr.default == null) {
//         await getTranslations(CSGO_ENGLISH_URL)
//             .then(data => {
//                 wherrrrrrrrrr.default = data.lowerCaseKeys;
//                 wherrrrrrrrrr.default_idx = data.lowerCaseKeysIdx;
//             })
//             .catch(() => {
//                 throw new Error(`Error loading translations from ${CSGO_ENGLISH_URL}`);
//             });
//     }

//     await getTranslations(url)
//         .then(data => {
//             languageData = { language, folder };
//             wherrrrrrrrrr.selected = data.lowerCaseKeys;
//             wherrrrrrrrrr.selected_idx = data.lowerCaseKeysIdx;
//         })
//         .catch(() => {
//             throw new Error(`Error loading translations from ${url}`);
//         });
// }
