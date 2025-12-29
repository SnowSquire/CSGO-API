import { describe, test } from "bun:test";
import { configure, type } from "arktype";
import items_game from "./items_game.json";
import { ItemsGame } from "./types";

describe("ItemsGame Schema", () => {
    test("items_game schema validation", () => {
        const result = ItemsGame(items_game.items_game);
        if (result instanceof type.errors) {
            throw Error(result.summary);
        }
    });
});
