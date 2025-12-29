import fs from "node:fs/promises";
import path from "node:path";
import { LANGUAGES_URL } from "./constants.js";
import { getManifestId } from "./services/main.js";

const args = process.argv.slice(2);
const isForce = args.includes("--force");

const inputFilePathsTemplate = [
    "./public/api/{lang}/agents.json",
    "./public/api/{lang}/collectibles.json",
    "./public/api/{lang}/collections.json",
    "./public/api/{lang}/crates.json",
    "./public/api/{lang}/graffiti.json",
    "./public/api/{lang}/keys.json",
    "./public/api/{lang}/music_kits.json",
    "./public/api/{lang}/patches.json",
    "./public/api/{lang}/skins_not_grouped.json",
    "./public/api/{lang}/stickers.json",
    "./public/api/{lang}/sticker_slabs.json",
    "./public/api/{lang}/keychains.json",
    "./public/api/{lang}/tools.json",
] as const;

let existingManifestId = "";
const latestManifestId = await getManifestId();

try {
    existingManifestId = await fs.readFile("./manifestIdGroup.txt", { encoding: "utf-8" });
} catch (err) {
    if (err.code !== "ENOENT") {
        throw err;
    }
}

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

for (const langObj of LANGUAGES_URL) {
    const lang = langObj.folder;
    const allData: Record<string, any> = {};

    const inputFilePaths = inputFilePathsTemplate.map(templatePath => templatePath.replace("{lang}", lang));

    await Promise.all(
        inputFilePaths.map(async filePath => {
            const fullPath = path.join(process.cwd(), filePath);
            try {
                await fs.access(fullPath);
                const fileContent = await fs.readFile(fullPath, "utf-8");
                const fileData = JSON.parse(fileContent);
                if (Array.isArray(fileData)) {
                    fileData.forEach(item => {
                        allData[item.id] = item;
                    });
                }
            } catch (err) {
                const e = err as NodeJS.ErrnoException | undefined;
                if (e?.code === "ENOENT") {
                    console.warn(`File not found: ${fullPath}, skipping.`);
                    return;
                }
                throw err;
            }
        })
    );

    const outputFilePath = `./public/api/${lang}/all.json`;
    await fs.writeFile(outputFilePath, JSON.stringify(allData));

    console.log(`all.json for ${lang} has been generated.`);
}

await fs.writeFile("./manifestIdGroup.txt", latestManifestId.toString());
