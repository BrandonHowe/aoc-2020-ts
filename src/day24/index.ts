import * as path from "path";
import { parse } from "path";
import { readInputRaw } from "../helpers/readInput";

interface HexCoords {
    x: number;
    y: number;
    z: number;
}

const parseStr = (str: string) => {
    let currChar = 0;
    const res = [];
    while (currChar < str.length) {
        if (str[currChar] === "e") {
            res.push(0);
            currChar++;
            continue;
        } else if (str[currChar] === "s") {
            if (str[currChar + 1] === "e") {
                res.push(1);
            } else if (str[currChar + 1] === "w") {
                res.push(2);
            }
            currChar += 2;
            continue;
        } else if (str[currChar] === "w") {
            res.push(3);
            currChar++;
            continue;
        } else if (str[currChar] === "n") {
            if (str[currChar + 1] === "e") {
                res.push(4);
            } else if (str[currChar + 1] === "w") {
                res.push(5);
            }
            currChar += 2;
            continue;
        }
    }
    return res;
};

const walkHexCoords = (nums: number[]) => {
    const currCoords = { x: 0, y: 0, z: 0 };
    nums.map(l => {
        switch (l) {
            case 0:
                currCoords.x++;
                currCoords.y--;
                break;
            case 1:
                currCoords.y--;
                currCoords.z++;
                break;
            case 2:
                currCoords.x--;
                currCoords.z++;
                break;
            case 3:
                currCoords.x--;
                currCoords.y++;
                break;
            case 4:
                currCoords.x++;
                currCoords.z--;
                break;
            case 5:
                currCoords.y++;
                currCoords.z--;
                break;
        }
    });
    return currCoords;
};

const part1 = (str: string[]) => {
    const coords = str.map(parseStr).map(walkHexCoords);
    const leMap: Record<string, boolean> = {};
    coords.map(l => {
        if (JSON.stringify(l) in leMap) {
            leMap[JSON.stringify(l)] = !leMap[JSON.stringify(l)];
        } else {
            leMap[JSON.stringify(l)] = true;
        }
    });
    return Object.values(leMap).filter(l => !!l).length;
};

const getNeighbors = (cell: HexCoords) => {
    const cell1 = { ...cell, x: cell.x + 1, y: cell.y - 1 };
    const cell2 = { ...cell, z: cell.z + 1, y: cell.y - 1 };
    const cell3 = { ...cell, z: cell.z + 1, x: cell.x - 1 };
    const cell4 = { ...cell, y: cell.y + 1, x: cell.x - 1 };
    const cell5 = { ...cell, x: cell.x + 1, z: cell.z - 1 };
    const cell6 = { ...cell, y: cell.y + 1, z: cell.z - 1 };
    return [cell1, cell2, cell3, cell4, cell5, cell6];
};

const part2 = (str: string[]) => {
    const coords = str.map(parseStr).map(walkHexCoords);
    let leMap: Record<string, boolean> = {};
    coords.map(l => {
        if (JSON.stringify(l) in leMap) {
            leMap[JSON.stringify(l)] = !leMap[JSON.stringify(l)];
        } else {
            leMap[JSON.stringify(l)] = true;
        }
    });
    for (let i = 0; i < 100; i++) {
        const newMap = { ...leMap };
        Object.keys(newMap).map(l => JSON.parse(l))
            .flatMap(l =>
                [
                    ...new Set(
                        [l, ...getNeighbors(l)].map(l => JSON.stringify(l))
                    )
                ].map(l => JSON.parse(l))
            )
            .map(l => {
                const neighbors = getNeighbors(l);
                const total = neighbors.reduce(
                    (acc, cur) =>
                        acc + Number(leMap[JSON.stringify(cur)] || false),
                    0
                );
                if (leMap[JSON.stringify(l)] && (total === 0 || total > 2)) {
                    delete newMap[JSON.stringify(l)];
                } else if (!leMap[JSON.stringify(l)] && total === 2) {
                    newMap[JSON.stringify(l)] = true;
                }
            });
        leMap = { ...newMap };
    }
    return Object.values(leMap).filter(l => !!l).length;
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .trim()
        .split("\n");

    console.time("part1");

    // console.log(part1(input));
    console.log(part2(input));

    console.timeEnd("part1");
};

main();
