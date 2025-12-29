import * as fs from "node:fs/promises";
import path from "node:path";
export async function saveDataJson(file: string, data: unknown[]) {
    // I beautify the JSON data because it's easier for me see the changes
    await fs.mkdir(path.dirname(file), { recursive: true });

    await fs.writeFile(file, JSON.stringify(data, null, 1));
}
