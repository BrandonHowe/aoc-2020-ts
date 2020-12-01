import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export const readInputRaw = (filepath: string): Promise<string> =>
    readFile(filepath, "utf-8");

export const readInputSplit = async (filepath: string): Promise<string[]> =>
    (await readFile(filepath, "utf-8")).split("\n");

export const readInputSplitNum = async (filepath: string): Promise<number[]> =>
    (await readFile(filepath, "utf-8")).split("\n").map(Number);

export const readInputGrid = async (filepath: string): Promise<string[][]> =>
    (await readFile(filepath, "utf-8")).split("\n").map(l => l.split(""));
