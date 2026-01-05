import { getImageUrl } from "../constants.js";
import type { CustomTranslation } from "../types.js";
import {
    getCategory,
    getDopplerPhase,
    getRarityColor,
    getWeaponName,
    getWears,
    isNotWeapon,
    knives,
    weaponIDMapping,
} from "../utils/index.js";
import specialNotes from "../utils/specialNotes.json" with { type: "json" };

import type { State } from "./main.js";
import { $t, $tc, $tTag, type LanguageResource } from "./translations.js";

function getPatternName(weapon: any, string: any) {
    return string.replace(`${weapon}_`, "").toLowerCase();
}

function isSkin(iconPath: any) {
    if (iconPath.includes("newcs2")) {
        return false;
    }

    const regexSkinId = /econ\/default_generated\/(.*?)_light$/i;

    return regexSkinId.test(iconPath.toLowerCase());
}

function getSkinInfo(iconPath: any) {
    const regexSkinId = /econ\/default_generated\/(.*?)_light$/i;
    const path = iconPath.toLowerCase();
    const skinId = path.match(regexSkinId);

    const weapon = getWeaponName(skinId[1]);
    const pattern = getPatternName(weapon, skinId[1]);

    return [weapon, pattern];
}

function getDescription(desc: any, paintKits: any, pattern: any, languageResource: LanguageResource) {
    const pattern_desc = $t(`#PaintKit_${pattern}`, false, languageResource);
    if (pattern_desc && pattern_desc.length > 0) {
        return `${desc} ${pattern_desc}`;
    }

    const tag = paintKits[pattern]?.description_tag.toLowerCase().replace("_tag", "");
    const tag_desc = $t(tag, false, languageResource);
    if (tag_desc && tag_desc.length > 0) {
        return `${desc} ${tag_desc}`;
    }

    const idx_desc = $tTag(paintKits[pattern]?.description_tag, false, languageResource);
    if (idx_desc && idx_desc.length > 0) {
        return `${desc} ${idx_desc}`;
    }

    return desc;
}

function parseItem(
    item: any,
    items: any,
    state: State,
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { rarities, paintKits, cratesBySkins, souvenirSkins, collectionsBySkins, cdnImages } = state;
    const [weapon, pattern] = getSkinInfo(item.icon_path);
    const dopplerPhase = getDopplerPhase(paintKits[pattern]?.paint_index);
    const image =
        state.cdnImages[`${item.icon_path.toLowerCase()}`] ??
        state.cdnImages[`${item.icon_path.toLowerCase().replace(/_light$/, "_medium")}`] ??
        state.cdnImages[`${item.icon_path.toLowerCase().replace(/_light$/, "_heavy")}`] ??
        getImageUrl(`${item.icon_path.toLowerCase()}`);
    const translatedName = !isNotWeapon(weapon)
        ? $t(items[weapon].item_name_prefab, false, languageResource)
        : $t(items[weapon].item_name, false, languageResource);
    const translatedDescription = !isNotWeapon(weapon)
        ? $t(items[weapon].item_description_prefab, false, languageResource)
        : $t(items[weapon].item_description, false, languageResource);

    const isStatTrak =
        weapon.includes("knife") ||
        weapon.includes("bayonet") ||
        state.stattTrakSkins[`[${pattern}]${weapon}`] !== undefined;

    const isKnife = weapon.includes("weapon_knife") || weapon.includes("weapon_bayonet");

    const rarity = !isNotWeapon(weapon)
        ? rarities[`[${pattern}]${weapon}`]?.rarity
            ? `rarity_${rarities[`[${pattern}]${weapon}`]?.rarity}_weapon`
            : null
        : isKnife
          ? // Knives are 'Covert'
            `rarity_ancient_weapon`
          : // Gloves are 'Extraordinary'
            `rarity_ancient`;

    const team =
        !items[weapon].used_by_classes || Object.keys(items[weapon].used_by_classes).length === 2
            ? "both"
            : Object.keys(items[weapon].used_by_classes)[0];

    return {
        id: `skin-${item.object_id}`,
        name: isNotWeapon(weapon)
            ? $tc(
                  "rare_special",
                  {
                      item_name: translatedName,
                      pattern: $t(paintKits[pattern]?.description_tag, false, languageResource),
                  },
                  language
              )
            : `${translatedName} | ${$t(paintKits[pattern]?.description_tag, false, languageResource)}`,
        description: getDescription(translatedDescription, paintKits, pattern, languageResource),
        weapon: {
            id: weapon,
            weapon_id: weaponIDMapping[weapon],
            name: translatedName,
        },
        category: {
            id: getCategory(weapon),
            name: $t(getCategory(weapon), false, languageResource),
        },
        pattern: {
            id: pattern,
            // Some names are numbers, let's convert them to strings.
            // https://github.com/ByMykel/CSGO-API/issues/158
            name: $t(paintKits[pattern]?.description_tag, false, languageResource)?.toString(),
        },
        min_float: paintKits[pattern]?.wear_remap_min,
        max_float: paintKits[pattern]?.wear_remap_max,
        rarity: {
            id: rarity,
            name: $t(rarity, false, languageResource),
            color: getRarityColor(rarity),
        },
        stattrak: isStatTrak,
        souvenir: souvenirSkins?.[`skin-${item.object_id}`] ?? false,
        paint_index: paintKits[pattern]?.paint_index,
        wears: getWears(paintKits[pattern]?.wear_remap_min, paintKits[pattern]?.wear_remap_max).map(
            wearKey => ({
                id: wearKey,
                name: $t(wearKey, false, languageResource),
            })
        ),
        collections:
            collectionsBySkins?.[`skin-${item.object_id}`]?.map((i: any) => ({
                ...i,
                name: $t(i.name, false, languageResource),
            })) ?? [],
        crates:
            cratesBySkins?.[`skin-${item.object_id}`]?.map((i: any) => ({
                ...i,
                name: $t(i.name, false, languageResource),
            })) ?? [],
        ...(dopplerPhase && { phase: dopplerPhase }),
        special_notes: specialNotes?.[`skin-${item.object_id}`],
        team: {
            id: team,
            name:
                team === "both"
                    ? $t("inv_filter_both_teams", false, languageResource)
                    : team === "counter-terrorists"
                      ? $t("inv_filter_ct", false, languageResource)
                      : $t("inv_filter_t", false, languageResource),
        },
        legacy_model: paintKits[pattern]?.legacy_model,
        image,

        // Return original attributes from item_game.json
        original: {
            name: items[weapon].name,
        },
    };
}

export function getSkins(state: State, languageResource: LanguageResource, language: CustomTranslation) {
    const { itemsGame, items, cratesBySkins, cdnImages } = state;

    const skins = [
        ...Object.entries(itemsGame.alternate_icons2.weapon_icons)
            .filter(([, item]: any) => isSkin(item.icon_path))
            .map(([key, item]: any) =>
                parseItem({ ...item, object_id: key }, items, state, languageResource, language)
            ),
        ...knives.map(knife => ({
            id: `skin-vanilla-${knife.name}`,
            name: $tc(
                "rare_special_vanilla",
                {
                    item_name: $t(knife.item_name, false, languageResource),
                },
                language
            ),
            description: $t(knife.item_description, false, languageResource),
            weapon: {
                id: knife.item_name,
                weapon_id: weaponIDMapping[knife.name as any],
                name: $t(knife.item_name, false, languageResource),
            },
            category: {
                id: "sfui_invpanel_filter_melee",
                name: $t("sfui_invpanel_filter_melee", false, languageResource),
            },
            pattern: null,
            min_float: null,
            max_float: null,
            rarity: {
                id: `rarity_ancient_weapon`,
                name: $t(`rarity_ancient_weapon`, false, languageResource),
                color: getRarityColor("rarity_ancient_weapon"),
            },
            stattrak: true,
            paint_index: null,
            crates:
                cratesBySkins[`skin-vanilla-${knife.name}`]?.map((i: any) => ({
                    ...i,
                    name: $t(i.name, false, languageResource),
                })) ?? [],
            team: {
                id: "both",
                name: $t("inv_filter_both_teams", false, languageResource),
            },
            legacy_model: true,
            image:
                cdnImages[`econ/weapons/base_weapons/${knife.name}`] ??
                getImageUrl(`econ/weapons/base_weapons/${knife.name}`),

            // Return original attributes from item_game.json
            original: {
                name: knife.name,
            },
        })),
    ].filter((skin: any) => !skin.name.includes("null") && skin.rarity.id);

    return skins;
}
