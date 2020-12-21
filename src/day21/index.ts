import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

interface Recipe {
    ingredients: string[];
    allergens: string[];
}

const canBeAllergen = (str: string, allergen: string, menu: Recipe[]) => {
    const matchingRecipes = menu.filter(l => l.allergens.includes(allergen));
    return matchingRecipes.every(l => l.ingredients.includes(str));
};

const parseInput = (str: string) => {
    const splitStr = str.split(" (");
    const ingredients = splitStr[0].split(" ");
    const allergens = splitStr[1]
        .slice(0, -1)
        .split(", ")
        .flatMap(l => l.split(" "))
        .slice(1);
    return {
        ingredients,
        allergens
    };
};

const getIngCount = (str: string, menu: Recipe[]) => {
    return menu
        .map(l => l.ingredients)
        .reduce((acc, cur) => acc + cur.filter(l => l === str).length, 0);
};

const part1 = (arr: string[]) => {
    const parsed = arr.map(parseInput);
    const ingredients = [...new Set(parsed.flatMap(l => l.ingredients))];
    const allergens = [...new Set(parsed.flatMap(l => l.allergens))];
    const matching = ingredients
        .map(
            l =>
                [l, allergens.map(j => canBeAllergen(l, j, parsed))] as [
                    string,
                    boolean[]
                ]
        )
        .filter(l => !l[1].includes(true))
        .map(l => l[0]);
    return matching
        .map(l => getIngCount(l, parsed))
        .reduce((acc, cur) => acc + cur);
};

const part2 = (arr: string[]) => {
    return "Use pencil and paper to solve this.";
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    input.pop();

    console.time("main");

    console.log(part1(input));
    console.log(part2(input));

    console.timeEnd("main");
};

main();
