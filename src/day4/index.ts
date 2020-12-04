import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const fields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

const validEcl = "amb blu brn gry grn hzl oth".split(" ");

const passwordValid = (str: string) => {
    const splitStr = str
        .split("\n")
        .join(" ")
        .split(" ")
        .map(l => l.split(":"));
    const mapped = splitStr.map(l => l[0]);
    const newObj: Record<string, string | undefined> = {};
    newObj.byr = splitStr.find(l => l[0] === "byr")
        ? splitStr.find(l => l[0] === "byr")![1]
        : undefined;
    newObj.iyr = splitStr.find(l => l[0] === "iyr")
        ? splitStr.find(l => l[0] === "iyr")![1]
        : undefined;
    newObj.eyr = splitStr.find(l => l[0] === "eyr")
        ? splitStr.find(l => l[0] === "eyr")![1]
        : undefined;
    newObj.hgt = splitStr.find(l => l[0] === "hgt")
        ? splitStr.find(l => l[0] === "hgt")![1]
        : undefined;
    newObj.hcl = splitStr.find(l => l[0] === "hcl")
        ? splitStr.find(l => l[0] === "hcl")![1]
        : undefined;
    newObj.ecl = splitStr.find(l => l[0] === "ecl")
        ? splitStr.find(l => l[0] === "ecl")![1]
        : undefined;
    newObj.pid = splitStr.find(l => l[0] === "pid")
        ? splitStr.find(l => l[0] === "pid")![1]
        : undefined;
    if (
        Object.keys(newObj).reduce(
            (acc, cur) => acc || !mapped.includes(cur),
            false
        )
    ) {
        return false;
    }
    if (Number(newObj.byr!) < 1920 || Number(newObj.byr!) > 2002) {
        return false;
    }
    if (Number(newObj.iyr!) < 2010 || Number(newObj.iyr!) > 2020) {
        return false;
    }
    if (Number(newObj.eyr!) < 2020 || Number(newObj.eyr!) > 2030) {
        return false;
    }
    const hgtNum = newObj.hgt!.slice(0, -2);
    if (
        isNaN(Number(hgtNum)) ||
        newObj.hgt!.slice(-2) === "cm" ? Number(hgtNum) < 150 || Number(hgtNum) > 193 : false ||
        newObj.hgt!.slice(-2) === "in" ? Number(hgtNum) < 59 || Number(hgtNum) > 76 : true
    ) {
        return false;
    }
    if (
        newObj.hcl!.charAt(0) !== "#" ||
        newObj
            .hcl!.slice(1)
            .split("")
            .some(l => !"1234567890abcdef".split("").includes(l))
    ) {
        return false;
    }
    if (!validEcl.includes(newObj.ecl!)) {
        return false;
    }
    if (isNaN(Number(newObj.pid!)) || newObj.pid!.length !== 9) {
        return false;
    }
    return true;
};

const main = async () => {
    const input = await (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    )
        .split("\n\n")
        .map(l => l.split("\n").join(" "));

    console.log(input);

    console.log(input.map(l => passwordValid(l)).filter(l => !!l).length);

    console.time("main");

    console.timeEnd("main");
};

main();
