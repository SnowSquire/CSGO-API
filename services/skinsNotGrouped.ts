import { getImageUrl } from "../constants.js";
import type { CustomTranslation, ProcessedItem } from "../types.js";
import {
    formatIconPath,
    getCategory,
    getDopplerPhase,
    getFinishStyleLink,
    getRarityColor,
    getWeaponName,
    getWears,
    isNotWeapon,
    knives,
    skinMarketHashName,
    weaponIDMapping,
} from "../utils/index.js";
import specialNotes from "../utils/specialNotes.json" with { type: "json" };

import type { State } from "./main.js";
import { $t, $tc, $tTag, type LanguageResource } from "./translations.js";

// Type for weapon icon entries from ItemsGame
type WeaponIcon = {
    icon_path: string;
};

function getPatternName(weapon: string, string: string): string {
    return string.replace(`${weapon}_`, "").toLowerCase();
}

function isSkin(iconPath: string): boolean {
    if (iconPath.includes("newcs2")) {
        return false;
    }

    const regexSkinId = /econ\/default_generated\/(.*?)_light$/i;

    return regexSkinId.test(iconPath.toLowerCase());
}

function getSkinInfo(iconPath: string): [string, string] {
    const regexSkinId = /econ\/default_generated\/(.*?)_light$/i;
    const path = iconPath.toLowerCase();
    const skinId = path.match(regexSkinId);
    if (!skinId) throw Error("Unable to parse skin icon path");
    const weapon = getWeaponName(skinId[1]!);
    if (!weapon) throw Error("Unable to determine weapon from skin icon path");
    const pattern = getPatternName(weapon, skinId[1]!);

    return [weapon, pattern];
}

function getDescription(
    desc: string | null,
    paintKits: Record<string, { description_tag?: string }>,
    pattern: string,
    isStatTrak: boolean,
    languageResource: LanguageResource
): string {
    const stattrakText = isStatTrak
        ? `<span style='color:#99ccff;'>${$t("attrib_killeater", false, languageResource) ?? ""}</span><br/><br/><span style='color:#cf6a32;'>${$t("killeaterdescriptionnotice_kills", false, languageResource) ?? ""}</span><br/><br/> `
        : "";

    const pattern_desc = $t(`#PaintKit_${pattern}`, false, languageResource);
    if (pattern_desc && pattern_desc.length > 0) {
        return `${stattrakText}${desc} ${pattern_desc}`;
    }

    const descriptionTag = paintKits[pattern]?.description_tag;
    if (descriptionTag) {
        const tag = descriptionTag.toLowerCase().replace("_tag", "");
        const tag_desc = $t(tag, false, languageResource);
        if (tag_desc && tag_desc.length > 0) {
            return `${stattrakText}${desc} ${tag_desc}`;
        }
    }

    const idx_desc = $tTag(paintKits[pattern]?.description_tag || "", false, languageResource);
    if (idx_desc && idx_desc.length > 0) {
        return `${stattrakText}${desc} ${idx_desc}`;
    }

    return desc ?? "";
}

function getVanillaDescription(
    desc: string | null,
    isStatTrak: boolean,
    languageResource: LanguageResource
): string {
    const stattrakText = isStatTrak
        ? `<span style='color:#99ccff;'>${$t("attrib_killeater", false, languageResource) ?? ""}</span><br/><br/><span style='color:#cf6a32;'>${$t("killeaterdescriptionnotice_kills", false, languageResource) ?? ""}</span><br/><br/> `
        : "";

    return `${stattrakText}${desc ?? ""}`;
}

function parseItem(
    item: WeaponIcon & { object_id: string },
    items: Record<string, ProcessedItem>,
    state: State,
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { rarities, paintKits, souvenirSkins, stattTrakSkins, cdnImages } = state;
    const [weapon, pattern] = getSkinInfo(item.icon_path);
    const translatedName = !isNotWeapon(weapon)
        ? ($t(items[weapon]!.item_name_prefab || "", false, languageResource) ?? "")
        : ($t(items[weapon]!.item_name || "", false, languageResource) ?? "");
    const translatedDescription = !isNotWeapon(weapon)
        ? $t(items[weapon]!.item_description_prefab || "", false, languageResource)
        : $t(items[weapon]!.item_description || "", false, languageResource);

    const isStatTrak =
        weapon.includes("knife") ||
        weapon.includes("bayonet") ||
        stattTrakSkins[`[${pattern}]${weapon}`] !== undefined;
    const isSouvenir = souvenirSkins?.[`skin-${item.object_id}`] ?? false;

    const isKnife = weapon.includes("weapon_knife") || weapon.includes("weapon_bayonet");

    const dopplerPhase = getDopplerPhase(paintKits[pattern]?.paint_index || "");

    const rarity = !isNotWeapon(weapon)
        ? rarities[`[${pattern}]${weapon}`]?.rarity
            ? `rarity_${rarities[`[${pattern}]${weapon}`]?.rarity}_weapon`
            : null
        : isKnife
          ? // Knives are 'Covert'
            `rarity_ancient_weapon`
          : // Gloves are 'Extraordinary'
            `rarity_ancient`;

    // Some skins only exist as souvenir like "MP5-SD | Lab Rats"
    const types = ["hy_labrat_mp5"].includes(pattern) ? [] : ["skin"];

    if (isStatTrak) {
        types.push("skin_stattrak");
    }

    if (isSouvenir) {
        types.push("skin_souvenir");
    }

    const wears = getWears(
        Number(paintKits[pattern]?.wear_remap_min),
        Number(paintKits[pattern]?.wear_remap_max)
    );

    const team =
        !items[weapon]?.used_by_classes || Object.keys(items[weapon]!.used_by_classes).length === 2
            ? "both"
            : (Object.keys(items[weapon]!.used_by_classes)[0] as string);

    return types.map(type =>
        wears.map((wear, index) => ({
            id: `skin-${item.object_id}_${index}${type === "skin_stattrak" ? "_st" : type === "skin_souvenir" ? "_so" : ""}`,
            skin_id: `skin-${item.object_id}`,
            name: isNotWeapon(weapon)
                ? $tc(
                      type === "skin_stattrak" ? "rare_special_with_wear_stattrak" : "rare_special_with_wear",
                      {
                          item_name: translatedName,
                          pattern:
                              $t(paintKits[pattern]?.description_tag || "", false, languageResource) ?? "",
                          wear: $t(wear, false, languageResource) ?? "",
                      },
                      language
                  )
                : $tc(
                      type as "skin" | "skin_stattrak" | "skin_souvenir",
                      {
                          item_name: translatedName,
                          pattern:
                              $t(paintKits[pattern]?.description_tag || "", false, languageResource) ?? "",
                          wear: $t(wear, false, languageResource) ?? "",
                      },
                      language
                  ),
            description: getDescription(
                translatedDescription,
                paintKits,
                pattern,
                type === "skin_stattrak",
                languageResource
            ),
            weapon: {
                id: weapon,
                weapon_id: weaponIDMapping[weapon as keyof typeof weaponIDMapping],
                name: translatedName,
            },
            category: {
                id: getCategory(weapon),
                name: $t(getCategory(weapon)!, false, languageResource) ?? "",
            },
            pattern: {
                id: pattern,
                // Some names are numbers, let's convert them to strings.
                // https://github.com/ByMykel/CSGO-API/issues/158
                name: $t(paintKits[pattern]?.description_tag || "", false, languageResource)?.toString(),
            },
            min_float: paintKits[pattern]?.wear_remap_min,
            max_float: paintKits[pattern]?.wear_remap_max,
            wear: {
                id: wear,
                name: $t(wear, false, languageResource) ?? "",
            },
            stattrak: type === "skin_stattrak",
            souvenir: type === "skin_souvenir",
            paint_index: paintKits[pattern]?.paint_index,
            rarity: {
                id: rarity,
                name: $t(rarity || "", false, languageResource) ?? "",
                color: getRarityColor(rarity || ""),
            },
            ...(dopplerPhase && { phase: dopplerPhase }),
            // Comment this because it makes JSON file too big.
            // collections:
            //     collectionsBySkins?.[`skin-${item.object_id}`]?.map((i) => ({
            //         ...i,
            //         name: $t(i.name),
            //     })) ?? [],
            // crates:
            //     cratesBySkins?.[`skin-${item.object_id}`]?.map((i) => ({
            //         ...i,
            //         name: $t(i.name),
            //     })) ?? [],
            market_hash_name: skinMarketHashName({
                itemName: !isNotWeapon(weapon)
                    ? ($t(items[weapon]!.item_name_prefab || "", true, languageResource) ?? "")
                    : ($t(items[weapon]!.item_name || "", true, languageResource) ?? ""),
                pattern: $t(paintKits[pattern]?.description_tag || "", true, languageResource) ?? "",
                wear: $t(wear, true, languageResource) ?? "",
                isStatTrak: type === "skin_stattrak",
                isSouvenir: type === "skin_souvenir",
                isWeapon: !isNotWeapon(weapon),
                isVanilla: false,
            }),
            special_notes: specialNotes?.[`skin-${item.object_id}` as keyof typeof specialNotes],
            team: {
                id: team,
                name:
                    team === "both"
                        ? ($t("inv_filter_both_teams", false, languageResource) ?? "")
                        : team === "counter-terrorists"
                          ? ($t("inv_filter_ct", false, languageResource) ?? "")
                          : ($t("inv_filter_t", false, languageResource) ?? ""),
            },
            style: {
                id: paintKits[pattern]?.style_id,
                name: $t(paintKits[pattern]?.style_name || "", false, languageResource) ?? "",
                url: getFinishStyleLink(paintKits[pattern]?.style_id || 0),
            },
            legacy_model: paintKits[pattern]?.legacy_model,
            image: cdnImages[formatIconPath(item.icon_path.toLowerCase(), wear)]
                ? cdnImages[formatIconPath(item.icon_path.toLowerCase(), wear)]
                : getImageUrl(formatIconPath(item.icon_path.toLowerCase(), wear)),

            // Return original attributes from item_game.json
            original: {
                name: items[weapon]!.name,
                image_inventory: formatIconPath(item.icon_path.toLowerCase(), wear),
            },
        }))
    );
}

export function getSkinsNotGrouped(
    state: State,
    languageResource: LanguageResource,
    language: CustomTranslation
) {
    const { itemsGame, items, cdnImages } = state;

    const types = ["rare_special_vanilla", "rare_special_vanilla_stattrak"] as const;

    const skins = [
        ...(itemsGame.alternate_icons2.weapon_icons
            ? Object.entries(itemsGame.alternate_icons2.weapon_icons)
                  .filter(([, item]: [string, WeaponIcon]) => isSkin(item.icon_path))
                  .map(([key, item]: [string, WeaponIcon]) =>
                      parseItem({ ...item, object_id: key }, items, state, languageResource, language)
                  )
                  .flatMap(level1 => level1.flat())
            : []),
        ...types.flatMap(type =>
            knives.map(knife => ({
                id: `skin-vanilla-${knife.name}${type === "rare_special_vanilla_stattrak" ? "_st" : ""}`,
                skin_id: `skin-vanilla-${knife.name}`,
                name: $tc(
                    type,
                    {
                        item_name: $t(knife.item_name, false, languageResource) ?? "",
                    },
                    language
                ),
                description: getVanillaDescription(
                    $t(knife.item_description, false, languageResource),
                    type === "rare_special_vanilla_stattrak",
                    languageResource
                ),
                weapon: {
                    id: knife.item_name,
                    weapon_id: weaponIDMapping[knife.name as keyof typeof weaponIDMapping],
                    name: $t(knife.item_name, false, languageResource) ?? "",
                },
                category: {
                    id: "sfui_invpanel_filter_melee",
                    name: $t("sfui_invpanel_filter_melee", false, languageResource) ?? "",
                },
                rarity: {
                    id: `rarity_ancient_weapon`,
                    name: $t(`rarity_ancient_weapon`, false, languageResource) ?? "",
                    color: getRarityColor(`rarity_ancient_weapon`),
                },
                stattrak: type === "rare_special_vanilla_stattrak",
                paint_index: null,
                market_hash_name: skinMarketHashName({
                    itemName: $t(knife.item_name, true, languageResource) ?? "",
                    pattern: null,
                    wear: null,
                    isStatTrak: type === "rare_special_vanilla_stattrak",
                    isSouvenir: false,
                    isWeapon: false,
                    isVanilla: true,
                }),
                team: {
                    id: "both",
                    name: $t("inv_filter_both_teams", false, languageResource) ?? "",
                },
                style: {
                    id: 0,
                    name: $t(`SFUI_ItemInfo_FinishStyle_0`, false, languageResource) ?? "",
                    url: getFinishStyleLink(0),
                },
                legacy_model: true,
                image:
                    cdnImages[`econ/weapons/base_weapons/${knife.name}`] ??
                    getImageUrl(`econ/weapons/base_weapons/${knife.name}`),

                // Return original attributes from item_game.json
                original: {
                    name: knife.name,
                    image_inventory: `econ/weapons/base_weapons/${knife.name}`,
                },
            }))
        ),
    ].filter(skin => !skin.name.includes("null") && skin.rarity.id);

    return skins;
}
