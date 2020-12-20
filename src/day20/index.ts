import * as path from "path";
import { displayGridFuncConfig } from "../helpers/displayGrid";
import { readInputRaw } from "../helpers/readInput";

const flipArrHoriz = <T>(arr: T[][]): T[][] => {
    const newArr = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        newArr.push([...arr[i]]);
    }
    return newArr;
};

const flipArrVerti = <T>(arr: T[][]): T[][] => {
    const newArr = [...arr];
    arr.map((l, idx) => {
        newArr[idx] = [...l].reverse();
    });
    return newArr;
};

const transpose = <T>(arr: T[][]): T[][] => {
    return arr[0].map((_, idx) => arr.map(j => j[idx]));
};

const rotateArrCW = <T>(arr: T[][]): T[][] => {
    return flipArrVerti(transpose(arr));
};

const rotateArr180 = <T>(arr: T[][]): T[][] => {
    return flipArrHoriz(flipArrVerti(arr));
};

const rotateArrCCW = <T>(arr: T[][]): T[][] => {
    return flipArrHoriz(transpose(arr));
};

const gridsAdjacent = (
    arr1: string[][],
    arr2: string[][],
    direction: number
) => {
    try {
        switch (direction) {
            case 0:
                return arr1[0].join("") === arr2[arr2.length - 1].join("");
            case 1:
                return (
                    arr1.map(l => l[l.length - 1]).join("") ===
                    arr2.map(l => l[0]).join("")
                );
            case 2:
                return arr2[0].join("") === arr1[arr1.length - 1].join("");
            case 3:
                return (
                    arr2.map(l => l[l.length - 1]).join("") ===
                    arr1.map(l => l[0]).join("")
                );
            default:
                throw `Invalid direction: ${direction}`;
        }
    } catch (e) {
        console.error(`We got ${e}`, arr1, arr2);
        throw "";
    }
};

const gridWorks = (arr: string[][][][]) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (i !== 0) {
                if (!gridsAdjacent(arr[i][j], arr[i - 1][j], 0)) {
                    return false;
                }
            }
            if (i !== arr.length - 1) {
                if (!gridsAdjacent(arr[i][j], arr[i + 1][j], 2)) {
                    return false;
                }
            }
            if (j !== 0) {
                if (!gridsAdjacent(arr[i][j], arr[i][j - 1], 3)) {
                    return false;
                }
            }
            if (j !== arr.length - 1) {
                if (!gridsAdjacent(arr[i][j], arr[i][j + 1], 1)) {
                    return false;
                }
            }
        }
    }
    return true;
};

const pairCount = (arr: string[][], arrs: string[][][]) => {
    return arrs.reduce((acc, cur) => {
        if (gridsAdjacent(arr, cur, 0)) {
            return acc + 1;
        }
        if (gridsAdjacent(arr, cur, 1)) {
            return acc + 1;
        }
        if (gridsAdjacent(arr, cur, 2)) {
            return acc + 1;
        }
        if (gridsAdjacent(arr, cur, 3)) {
            return acc + 1;
        }
        return acc;
    }, 0);
};

const edgePairCount = (
    arr: string[][],
    arrs: string[][][],
    direction: number
) => {
    return arrs.reduce(
        (acc, cur) => acc + +gridsAdjacent(arr, cur, direction),
        0
    );
};

const parseData = (str: string) => {
    const splitStr = str.split("\n");
    const tileId = Number(splitStr[0].slice(5, -1));
    const grid = splitStr.slice(1).map(l => l.split(""));
    return { [tileId]: grid };
};

const getAllOrientations = <T>(arr: T[][]) => {
    return [
        flipArrHoriz(arr),
        flipArrVerti(arr),
        rotateArrCW(arr),
        rotateArr180(arr),
        rotateArrCCW(arr),
        flipArrHoriz(rotateArrCW(arr)),
        flipArrHoriz(rotateArr180(arr)),
        flipArrHoriz(rotateArrCCW(arr)),
        flipArrVerti(rotateArrCW(arr)),
        flipArrVerti(rotateArr180(arr)),
        flipArrVerti(rotateArrCCW(arr)),
        arr
    ];
};

const countAdjacencies = (
    index: number,
    parsed: Record<number, string[][]>
) => {
    return Object.values(parsed)
        .map(getAllOrientations)
        .map(l =>
            getAllOrientations(parsed[index]).reduce(
                (acc, cur) => acc + pairCount(cur, l),
                0
            )
        )
        .map((l, idx) => l && Object.entries(parsed)[idx][0]);
};

const arrDiff = <T>(arr1: T[], arr2: T[]) => {
    const copied = [...arr1];
    for (let i = 0; i < copied.length; i++) {
        if (arr2.includes(copied[i])) {
            copied.splice(+i, 1);
            i--;
        }
    }
    return copied;
};

const xor = (a: boolean, b: boolean) => {
    return (a || b) && !(a && b);
};

const getSecondRotation = (
    arr1: string[][],
    arr2: string[][],
    direction: number
) => {
    const rots = getAllOrientations(arr2);
    for (const i in rots) {
        const rot = rots[i];
        if (gridsAdjacent(arr1, rot, direction)) {
            return +i;
        }
    }
    return -1;
};

const getRotationBetween2 = (
    arr1: string[][],
    arr2: string[][],
    direction: number
) => {
    const rot1 = getAllOrientations(arr1);
    const rot2 = getAllOrientations(arr2);
    for (const i in rot1) {
        for (const j in rot2) {
            const r1 = rot1[i];
            const r2 = rot2[j];
            if (gridsAdjacent(r1, r2, direction)) {
                return [r1, r2];
            }
        }
    }
    return [];
};

const expandKnown = (
    known: (number | null)[][],
    rotations: (number | null)[][],
    boards: Record<number, string[][]>,
    adjacencies: Record<number, number[]>
) => {
    const newKnown = [...known.map(l => [...l])];
    for (let i = 0; i < known.length; i++) {
        for (let j = 0; j < known[i].length; j++) {
            if (
                typeof known[i][j] !== "undefined" &&
                xor(
                    typeof known[i + 1][j] === "undefined",
                    typeof known[i][j + 1] === "undefined"
                )
            ) {
                const adjacent = [
                    known[i - 1] && known[i - 1][j],
                    known[i + 1] && known[i + 1][j],
                    known[i][j - 1],
                    known[i][j + 1]
                ].filter(l => !!l);
                const currOrientation = getAllOrientations(
                    boards[newKnown[i][j]!]
                )[rotations[i][j]!];
                    if (adjacencies[known[i][j]!].length === adjacent.length + 1) {
                    if (typeof known[i + 1][j] === "undefined") {
                        newKnown[i + 1][j] = arrDiff(
                            adjacencies[known[i][j]!],
                            adjacent
                        )[0];
                        rotations[i + 1][j] = getSecondRotation(
                            currOrientation,
                            boards[newKnown[i + 1][j]!],
                            2
                        );
                    } else if (typeof known[i][j + 1] === "undefined") {
                        newKnown[i][j + 1] = arrDiff(
                            adjacencies[known[i][j]!],
                            adjacent
                        )[0];
                        rotations[i][j + 1] = getSecondRotation(
                            currOrientation,
                            boards[newKnown[i][j + 1]!],
                            1
                        );
                    }
                }
            }
        }
    }
    known = newKnown;
    const newKnown2 = [...known.map(l => [...l])];
    for (let i = 0; i < known.length; i++) {
        for (let j = 0; j < known[i].length; j++) {
            if (i !== j) {
                continue;
            }
            if (
                typeof known[i][j] !== "undefined" &&
                (!known[i + 1] || typeof known[i + 1][j] === "undefined") &&
                typeof known[i][j + 1] === "undefined"
            ) {
                const adjacent = [
                    known[i - 1] && known[i - 1][j],
                    known[i + 1] && known[i + 1][j],
                    known[i][j - 1],
                    known[i][j + 1]
                ].filter(l => !!l) as number[];
                if (adjacencies[known[i][j]!].length === adjacent.length + 2) {
                    const difference = arrDiff(
                        adjacencies[known[i][j]!],
                        adjacent
                    );
                    const currOrientation = getAllOrientations(
                        boards[newKnown2[i][j]!]
                    )[rotations[i][j]!];
                    if (
                        j === 0 ||
                        adjacencies[known[i + 1][j - 1]!].includes(
                            difference[0]
                        )
                    ) {
                        newKnown2[i + 1][j] = difference[0];
                        rotations[i + 1][j] = getSecondRotation(
                            currOrientation,
                            boards[difference[0]],
                            2
                        );
                        newKnown2[i][j + 1] = difference[1];
                        rotations[i][j + 1] = getSecondRotation(
                            currOrientation,
                            boards[difference[1]],
                            1
                        );
                    } else {
                        newKnown2[i + 1][j] = difference[1];
                        rotations[i + 1][j] = getSecondRotation(
                            currOrientation,
                            boards[difference[1]],
                            2
                        );
                        newKnown2[i][j + 1] = difference[0];
                        rotations[i][j + 1] = getSecondRotation(
                            currOrientation,
                            boards[difference[0]],
                            1
                        );
                    }
                    // console.log("finsihed 2, new thing is", newKnown2);
                }
                if (i + 1 >= known.length || j + 1 >= known[0].length) {
                    continue;
                }
                const filteredArray = adjacencies[
                    newKnown2[i + 1][j]!
                ].filter(l => adjacencies[newKnown2[i][j + 1]!].includes(l));
                newKnown2[i + 1][j + 1] = filteredArray.find(
                    l => l !== known[i][j]
                )!;
                rotations[i + 1][j + 1] = getSecondRotation(
                    getAllOrientations(boards[newKnown2[i + 1][j]!])[
                        rotations[i + 1][j]!
                    ],
                    boards[newKnown2[i + 1][j + 1]!],
                    1
                );
            }
        }
    }
    return newKnown2;
};

const part1 = (input: string[]) => {
    const parsed = input
        .map(parseData)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    const res = Object.keys(parsed)
        .map(l => [l, countAdjacencies(+l, parsed).filter(l => l !== 0).length])
        .filter(l => l[1] === 3);
    return res.reduce((acc, cur) => acc * Number(cur[0]), 1);
};

// eslint-disable-next-line prettier/prettier
const seaMonsterRaw =
`                  #
#    ##    ##    ###
 #  #  #  #  #  #   `;

const seaMonsterCoords = () => {
    return seaMonsterRaw.split("\n").flatMap((l, idx) =>
        l
            .split("")
            .map((j, idx2) => [j, idx, idx2])
            .filter(l => l[0] !== " ")
    ) as [string, number, number][];
};

const findSeaMonster = (board: string[][]) => {
    const seaMonster = seaMonsterCoords();
    let seaMonsterCount = 0;
    for (let i = 0; i < board.length - 2; i++) {
        for (let j = 0; j < board[i].length - 19; j++) {
            seaMonsterCount += +seaMonster.every(
                l => board[l[1] + i][l[2] + j] === "#"
            );
        }
    }
    return seaMonsterCount;
};

const displaySuper = (arr: string[][][][]) => {
    return arr
        .map(l => {
            const rows = l.map(j => displayGridFuncConfig(j).split("\n"));
            let res = "";
            for (let i = 0; i < rows[0].length; i++) {
                res += "\n" + rows.reduce((acc, cur) => acc + cur[i], "");
            }
            return res.slice(1);
        })
        .join("");
};

const removeBorders = (arr: string[][]) => {
    return arr.map(l => l.slice(1, -1)).slice(1, -1);
};

const part2 = (input: string[]) => {
    const parsed = input
        .map(parseData)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    const resFirst: [string, number[]][] = Object.keys(parsed).map(l => [
        l,
        countAdjacencies(+l, parsed)
            .filter(j => j !== 0)
            .map(Number)
    ]);
    const res: Record<number, number[]> = resFirst.reduce(
        (acc, cur) => ({
            ...acc,
            ...{ [cur[0]]: cur[1].filter(l => l !== +cur[0]) }
        }),
        {}
    );
    const corners = Object.keys(parsed)
        .map(l => [l, countAdjacencies(+l, parsed).filter(l => l !== 0).length])
        .filter(l => l[1] === 3);
    const width = 12;
    const known = Array(width)
        .fill([])
        .map(() => Array(width));
    known[0][0] = +corners[0][0];
    let val = known;
    const rotations: (number | null)[][] = Array(width)
        .fill([])
        .map(() => Array(width));
    rotations[0][0] = 2;
    for (let i = 0; i < width - 1; i++) {
        val = expandKnown(val, rotations, parsed, res);
    }
    const displayStr = val.map((l, idx) =>
        l.map((j, idx2) =>
            removeBorders(getAllOrientations(parsed[j])[rotations[idx][idx2]!])
        )
    );
    const hashCount = displaySuper(displayStr)
        .split("")
        .filter(l => l === "#").length;
    return Math.min(
        ...getAllOrientations(
            displaySuper(displayStr)
                .split("\n")
                .map(l => l.split(""))
        ).map(l => hashCount - findSeaMonster(l) * 15)
    );
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .trim()
        .split("\n\n");

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
