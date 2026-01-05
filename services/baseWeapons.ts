import { getImageUrl } from "../constants.js";
import { weaponIDMapping } from "../utils/index.js";
import type { State } from "./main.js";
import { $t, type LanguageResource } from "./translations.js";

interface BaseWeapon {
    id: string;
    name: string | null;
    description: string | null;
    def_index: string | number;
    image: string;
}

export function getBaseWeapons(
    state: {
        cdnImages: State["cdnImages"];
    },
    languageResource: LanguageResource
): BaseWeapon[] {
    const { cdnImages } = state;

    const baseWeapons = [
        {
            id: "base_weapon-ct_gloves",
            name: $t(`csgo_wearable_ct_defaultgloves`, false, languageResource),
            description: $t(`csgo_wearable_ct_defaultgloves_desc`, false, languageResource),
            def_index: weaponIDMapping.ct_gloves,
            image:
                cdnImages["econ/weapons/base_weapons/ct_gloves"] ??
                getImageUrl(`econ/weapons/base_weapons/ct_gloves`),
        },
        {
            id: "base_weapon-t_gloves",
            name: $t(`csgo_wearable_t_defaultgloves`, false, languageResource),
            description: $t(`csgo_wearable_t_defaultgloves_desc`, false, languageResource),
            def_index: weaponIDMapping.t_gloves,
            image:
                cdnImages["econ/weapons/base_weapons/t_gloves"] ??
                getImageUrl(`econ/weapons/base_weapons/t_gloves`),
        },
        {
            id: "base_weapon-weapon_ak47",
            name: $t(`sfui_wpnhud_ak47`, false, languageResource),
            description: $t(`csgo_item_desc_ak47`, false, languageResource),
            def_index: weaponIDMapping.weapon_ak47,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_ak47"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_ak47`),
        },
        {
            id: "base_weapon-weapon_aug",
            name: $t(`sfui_wpnhud_aug`, false, languageResource),
            description: $t(`csgo_item_desc_aug`, false, languageResource),
            def_index: weaponIDMapping.weapon_aug,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_aug"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_aug`),
        },
        {
            id: "base_weapon-weapon_awp",
            name: $t(`sfui_wpnhud_awp`, false, languageResource),
            description: $t(`csgo_item_desc_awp`, false, languageResource),
            def_index: weaponIDMapping.weapon_awp,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_awp"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_awp`),
        },
        {
            id: "base_weapon-weapon_bayonet",
            name: $t(`sfui_wpnhud_knifebayonet`, false, languageResource),
            description: $t(`csgo_item_desc_knife_bayonet`, false, languageResource),
            def_index: weaponIDMapping.weapon_bayonet,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_bayonet"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_bayonet`),
        },
        {
            id: "base_weapon-weapon_bizon",
            name: $t(`sfui_wpnhud_bizon`, false, languageResource),
            description: $t(`csgo_item_desc_bizon`, false, languageResource),
            def_index: weaponIDMapping.weapon_bizon,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_bizon"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_bizon`),
        },
        {
            id: "base_weapon-weapon_c4",
            name: $t(`sfui_wpnhud_c4`, false, languageResource),
            description: $t(`csgo_item_desc_c4`, false, languageResource),
            def_index: weaponIDMapping.weapon_c4,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_c4"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_c4`),
        },
        {
            id: "base_weapon-weapon_cz75a",
            name: $t(`sfui_wpnhud_cz75`, false, languageResource),
            description: $t(`csgo_item_desc_cz75a`, false, languageResource),
            def_index: weaponIDMapping.weapon_cz75a,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_cz75a"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_cz75a`),
        },
        {
            id: "base_weapon-weapon_deagle",
            name: $t(`sfui_wpnhud_deagle`, false, languageResource),
            description: $t(`csgo_item_desc_deserteagle`, false, languageResource),
            def_index: weaponIDMapping.weapon_deagle,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_deagle"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_deagle`),
        },
        {
            id: "base_weapon-weapon_decoy",
            name: $t(`sfui_wpnhud_decoy`, false, languageResource),
            description: $t(`csgo_item_desc_decoy`, false, languageResource),
            def_index: weaponIDMapping.weapon_decoy,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_decoy"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_decoy`),
        },
        {
            id: "base_weapon-weapon_elite",
            name: $t(`sfui_wpnhud_elite`, false, languageResource),
            description: $t(`csgo_item_desc_elites`, false, languageResource),
            def_index: weaponIDMapping.weapon_elite,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_elite"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_elite`),
        },
        {
            id: "base_weapon-weapon_famas",
            name: $t(`sfui_wpnhud_famas`, false, languageResource),
            description: $t(`csgo_item_desc_famas`, false, languageResource),
            def_index: weaponIDMapping.weapon_famas,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_famas"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_famas`),
        },
        {
            id: "base_weapon-weapon_fiveseven",
            name: $t(`sfui_wpnhud_fiveseven`, false, languageResource),
            description: $t(`csgo_item_desc_fiveseven`, false, languageResource),
            def_index: weaponIDMapping.weapon_fiveseven,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_fiveseven"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_fiveseven`),
        },
        {
            id: "base_weapon-weapon_flashbang",
            name: $t(`sfui_wpnhud_flashbang`, false, languageResource),
            description: $t(`csgo_item_desc_flashbang`, false, languageResource),
            def_index: weaponIDMapping.weapon_flashbang,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_flashbang"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_flashbang`),
        },
        {
            id: "base_weapon-weapon_g3sg1",
            name: $t(`sfui_wpnhud_g3sg1`, false, languageResource),
            description: $t(`csgo_item_desc_g3sg1`, false, languageResource),
            def_index: weaponIDMapping.weapon_g3sg1,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_g3sg1"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_g3sg1`),
        },
        {
            id: "base_weapon-weapon_galilar",
            name: $t(`sfui_wpnhud_galilar`, false, languageResource),
            description: $t(`csgo_item_desc_galilar`, false, languageResource),
            def_index: weaponIDMapping.weapon_galilar,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_galilar"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_galilar`),
        },
        {
            id: "base_weapon-weapon_glock",
            name: $t(`sfui_wpnhud_glock18`, false, languageResource),
            description: $t(`csgo_item_desc_glock18`, false, languageResource),
            def_index: weaponIDMapping.weapon_glock,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_glock"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_glock`),
        },
        {
            id: "base_weapon-weapon_healthshot",
            name: $t(`sfui_wpnhud_healthshot`, false, languageResource),
            description: $t(`csgo_item_desc_healthshot`, false, languageResource),
            def_index: weaponIDMapping.weapon_healthshot,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_healthshot"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_healthshot`),
        },
        {
            id: "base_weapon-weapon_hegrenade",
            name: $t(`sfui_wpnhud_hegrenade`, false, languageResource),
            description: $t(`csgo_item_desc_hegrenade`, false, languageResource),
            def_index: weaponIDMapping.weapon_hegrenade,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_hegrenade"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_hegrenade`),
        },
        {
            id: "base_weapon-weapon_hkp2000",
            name: $t(`sfui_wpnhud_hkp2000`, false, languageResource),
            description: $t(`csgo_item_desc_hkp2000`, false, languageResource),
            def_index: weaponIDMapping.weapon_hkp2000,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_hkp2000"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_hkp2000`),
        },
        {
            id: "base_weapon-weapon_incgrenade",
            name: $t(`sfui_wpnhud_incgrenade`, false, languageResource),
            description: $t(`csgo_item_desc_incgrenade`, false, languageResource),
            def_index: weaponIDMapping.weapon_incgrenade,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_incgrenade"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_incgrenade`),
        },
        {
            id: "base_weapon-weapon_knife_butterfly",
            name: $t(`sfui_wpnhud_knife_butterfly`, false, languageResource),
            description: $t(`csgo_item_desc_knife_butterfly`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_butterfly,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_butterfly"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_butterfly`),
        },
        {
            id: "base_weapon-weapon_knife_canis",
            name: $t(`sfui_wpnhud_knife_canis`, false, languageResource),
            description: $t(`csgo_item_desc_knife_canis`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_canis,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_canis"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_canis`),
        },
        {
            id: "base_weapon-weapon_knife_cord",
            name: $t(`sfui_wpnhud_knife_cord`, false, languageResource),
            description: $t(`csgo_item_desc_knife_cord`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_cord,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_cord"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_cord`),
        },
        {
            id: "base_weapon-weapon_knife_css",
            name: $t(`sfui_wpnhud_knifecss`, false, languageResource),
            description: $t(`csgo_item_desc_knife_css`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_css,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_css"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_css`),
        },
        {
            id: "base_weapon-weapon_knife_falchion",
            name: $t(`sfui_wpnhud_knife_falchion_advanced`, false, languageResource),
            description: $t(`csgo_item_desc_knife_falchion_advanced`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_falchion,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_falchion"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_falchion`),
        },
        {
            id: "base_weapon-weapon_knife_flip",
            name: $t(`sfui_wpnhud_knifeflip`, false, languageResource),
            description: $t(`csgo_item_desc_knifeflip`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_flip,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_flip"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_flip`),
        },
        {
            id: "base_weapon-weapon_knife_gut",
            name: $t(`sfui_wpnhud_knifegut`, false, languageResource),
            description: $t(`csgo_item_desc_knifegut`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_gut,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_gut"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_gut`),
        },
        {
            id: "base_weapon-weapon_knife_gypsy_jackknife",
            name: $t(`sfui_wpnhud_knife_gypsy_jackknife`, false, languageResource),
            description: $t(`csgo_item_desc_knife_gypsy_jackknife`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_gypsy_jackknife,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_gypsy_jackknife"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_gypsy_jackknife`),
        },
        {
            id: "base_weapon-weapon_knife_karambit",
            name: $t(`sfui_wpnhud_knifekaram`, false, languageResource),
            description: $t(`csgo_item_desc_knife_karam`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_karambit,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_karambit"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_karambit`),
        },
        {
            id: "base_weapon-weapon_knife_kukri",
            name: $t(`sfui_wpnhud_knife_kukri`, false, languageResource),
            description: $t(`csgo_item_desc_knife_kukri`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_kukri,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_kukri"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_kukri`),
        },
        {
            id: "base_weapon-weapon_knife_m9_bayonet",
            name: $t(`sfui_wpnhud_knifem9`, false, languageResource),
            description: $t(`csgo_item_desc_knifem9`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_m9_bayonet,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_m9_bayonet"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_m9_bayonet`),
        },
        {
            id: "base_weapon-weapon_knife_outdoor",
            name: $t(`sfui_wpnhud_knife_outdoor`, false, languageResource),
            description: $t(`csgo_item_desc_knife_outdoor`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_outdoor,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_outdoor"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_outdoor`),
        },
        {
            id: "base_weapon-weapon_knife",
            name: $t(`sfui_wpnhud_knife`, false, languageResource),
            description: $t(`csgo_item_desc_knife`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife`),
        },
        {
            id: "base_weapon-weapon_knife_push",
            name: $t(`sfui_wpnhud_knife_push`, false, languageResource),
            description: $t(`csgo_item_desc_knife_push`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_push,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_push"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_push`),
        },
        {
            id: "base_weapon-weapon_knife_skeleton",
            name: $t(`sfui_wpnhud_knife_skeleton`, false, languageResource),
            description: $t(`csgo_item_desc_knife_skeleton`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_skeleton,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_skeleton"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_skeleton`),
        },
        {
            id: "base_weapon-weapon_knife_stiletto",
            name: $t(`sfui_wpnhud_knife_stiletto`, false, languageResource),
            description: $t(`csgo_item_desc_knife_stiletto`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_stiletto,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_stiletto"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_stiletto`),
        },
        {
            id: "base_weapon-weapon_knife_survival_bowie",
            name: $t(`sfui_wpnhud_knife_survival_bowie`, false, languageResource),
            description: $t(`csgo_item_desc_knife_survival_bowie`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_survival_bowie,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_survival_bowie"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_survival_bowie`),
        },
        {
            id: "base_weapon-weapon_knife_t",
            name: $t(`sfui_wpnhud_knife_t`, false, languageResource),
            description: $t(`csgo_item_desc_knife_t`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_t,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_t"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_t`),
        },
        {
            id: "base_weapon-weapon_knife_tactical",
            name: $t(`sfui_wpnhud_knifetactical`, false, languageResource),
            description: $t(`csgo_item_desc_knifetactical`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_tactical,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_tactical"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_tactical`),
        },
        {
            id: "base_weapon-weapon_knife_ursus",
            name: $t(`sfui_wpnhud_knife_ursus`, false, languageResource),
            description: $t(`csgo_item_desc_knife_ursus`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_ursus,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_ursus"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_ursus`),
        },
        {
            id: "base_weapon-weapon_knife_widowmaker",
            name: $t(`sfui_wpnhud_knife_widowmaker`, false, languageResource),
            description: $t(`csgo_item_desc_knife_widowmaker`, false, languageResource),
            def_index: weaponIDMapping.weapon_knife_widowmaker,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_knife_widowmaker"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_knife_widowmaker`),
        },
        {
            id: "base_weapon-weapon_m249",
            name: $t(`sfui_wpnhud_m249`, false, languageResource),
            description: $t(`csgo_item_desc_m249`, false, languageResource),
            def_index: weaponIDMapping.weapon_m249,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_m249"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_m249`),
        },
        {
            id: "base_weapon-weapon_m4a1",
            name: $t(`sfui_wpnhud_m4a1`, false, languageResource),
            description: $t(`csgo_item_desc_m4a4`, false, languageResource),
            def_index: weaponIDMapping.weapon_m4a1,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_m4a1"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_m4a1`),
        },
        {
            id: "base_weapon-weapon_m4a1_silencer",
            name: $t(`sfui_wpnhud_m4a1_silencer`, false, languageResource),
            description: $t(`csgo_item_desc_m4a1_silencer`, false, languageResource),
            def_index: weaponIDMapping.weapon_m4a1_silencer,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_m4a1_silencer"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_m4a1_silencer`),
        },
        {
            id: "base_weapon-weapon_mac10",
            name: $t(`sfui_wpnhud_mac10`, false, languageResource),
            description: $t(`csgo_item_desc_mac10`, false, languageResource),
            def_index: weaponIDMapping.weapon_mac10,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_mac10"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_mac10`),
        },
        {
            id: "base_weapon-weapon_mag7",
            name: $t(`sfui_wpnhud_mag7`, false, languageResource),
            description: $t(`csgo_item_desc_mag7`, false, languageResource),
            def_index: weaponIDMapping.weapon_mag7,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_mag7"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_mag7`),
        },
        {
            id: "base_weapon-weapon_molotov",
            name: $t(`sfui_wpnhud_molotov`, false, languageResource),
            description: $t(`csgo_item_desc_molotov`, false, languageResource),
            def_index: weaponIDMapping.weapon_molotov,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_molotov"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_molotov`),
        },
        {
            id: "base_weapon-weapon_mp5sd",
            name: $t(`sfui_wpnhud_mp5sd`, false, languageResource),
            description: $t(`csgo_item_desc_mp5sd`, false, languageResource),
            def_index: weaponIDMapping.weapon_mp5sd,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_mp5sd"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_mp5sd`),
        },
        {
            id: "base_weapon-weapon_mp7",
            name: $t(`sfui_wpnhud_mp7`, false, languageResource),
            description: $t(`csgo_item_desc_mp7`, false, languageResource),
            def_index: weaponIDMapping.weapon_mp7,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_mp7"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_mp7`),
        },
        {
            id: "base_weapon-weapon_mp9",
            name: $t(`sfui_wpnhud_mp9`, false, languageResource),
            description: $t(`csgo_item_desc_mp9`, false, languageResource),
            def_index: weaponIDMapping.weapon_mp9,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_mp9"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_mp9`),
        },
        {
            id: "base_weapon-weapon_negev",
            name: $t(`sfui_wpnhud_negev`, false, languageResource),
            description: $t(`csgo_item_desc_negev`, false, languageResource),
            def_index: weaponIDMapping.weapon_negev,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_negev"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_negev`),
        },
        {
            id: "base_weapon-weapon_nova",
            name: $t(`sfui_wpnhud_nova`, false, languageResource),
            description: $t(`csgo_item_desc_nova`, false, languageResource),
            def_index: weaponIDMapping.weapon_nova,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_nova"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_nova`),
        },
        {
            id: "base_weapon-weapon_p250",
            name: $t(`sfui_wpnhud_p250`, false, languageResource),
            description: $t(`csgo_item_desc_p250`, false, languageResource),
            def_index: weaponIDMapping.weapon_p250,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_p250"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_p250`),
        },
        {
            id: "base_weapon-weapon_p90",
            name: $t(`sfui_wpnhud_p90`, false, languageResource),
            description: $t(`csgo_item_desc_p90`, false, languageResource),
            def_index: weaponIDMapping.weapon_p90,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_p90"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_p90`),
        },
        {
            id: "base_weapon-weapon_revolver",
            name: $t(`sfui_wpnhud_revolver`, false, languageResource),
            description: $t(`csgo_item_desc_revolver`, false, languageResource),
            def_index: weaponIDMapping.weapon_revolver,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_revolver"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_revolver`),
        },
        {
            id: "base_weapon-weapon_sawedoff",
            name: $t(`sfui_wpnhud_sawedoff`, false, languageResource),
            description: $t(`csgo_item_desc_sawedoff`, false, languageResource),
            def_index: weaponIDMapping.weapon_sawedoff,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_sawedoff"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_sawedoff`),
        },
        {
            id: "base_weapon-weapon_scar20",
            name: $t(`sfui_wpnhud_scar20`, false, languageResource),
            description: $t(`csgo_item_desc_scar20`, false, languageResource),
            def_index: weaponIDMapping.weapon_scar20,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_scar20"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_scar20`),
        },
        {
            id: "base_weapon-weapon_sg556",
            name: $t(`sfui_wpnhud_sg556`, false, languageResource),
            description: $t(`csgo_item_desc_sg553`, false, languageResource),
            def_index: weaponIDMapping.weapon_sg556,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_sg556"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_sg556`),
        },
        {
            id: "base_weapon-weapon_smokegrenade",
            name: $t(`sfui_wpnhud_smokegrenade`, false, languageResource),
            description: $t(`csgo_item_desc_smokegrenade`, false, languageResource),
            def_index: weaponIDMapping.weapon_smokegrenade,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_smokegrenade"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_smokegrenade`),
        },
        {
            id: "base_weapon-weapon_ssg08",
            name: $t(`sfui_wpnhud_ssg08`, false, languageResource),
            description: $t(`csgo_item_desc_ssg08`, false, languageResource),
            def_index: weaponIDMapping.weapon_ssg08,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_ssg08"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_ssg08`),
        },
        {
            id: "base_weapon-weapon_taser",
            name: $t(`sfui_wpnhud_taser`, false, languageResource),
            description: $t(`csgo_item_desc_taser`, false, languageResource),
            def_index: weaponIDMapping.weapon_taser,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_taser"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_taser`),
        },
        {
            id: "base_weapon-weapon_tec9",
            name: $t(`sfui_wpnhud_tec9`, false, languageResource),
            description: $t(`csgo_item_desc_tec9`, false, languageResource),
            def_index: weaponIDMapping.weapon_tec9,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_tec9"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_tec9`),
        },
        {
            id: "base_weapon-weapon_ump45",
            name: $t(`sfui_wpnhud_ump45`, false, languageResource),
            description: $t(`csgo_item_desc_ump45`, false, languageResource),
            def_index: weaponIDMapping.weapon_ump45,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_ump45"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_ump45`),
        },
        {
            id: "base_weapon-weapon_usp_silencer",
            name: $t(`sfui_wpnhud_usp_silencer`, false, languageResource),
            description: $t(`csgo_item_desc_usp_silencer`, false, languageResource),
            def_index: weaponIDMapping.weapon_usp_silencer,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_usp_silencer"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_usp_silencer`),
        },
        {
            id: "base_weapon-weapon_xm1014",
            name: $t(`sfui_wpnhud_xm1014`, false, languageResource),
            description: $t(`csgo_item_desc_xm1014`, false, languageResource),
            def_index: weaponIDMapping.weapon_xm1014,
            image:
                cdnImages["econ/weapons/base_weapons/weapon_xm1014"] ??
                getImageUrl(`econ/weapons/base_weapons/weapon_xm1014`),
        },
    ].sort((a, b) => a.def_index - b.def_index);

    return baseWeapons;
}
