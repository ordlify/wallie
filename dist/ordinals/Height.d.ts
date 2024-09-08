import { Sat } from "./Sat";
export declare class Height {
    #private;
    readonly n: number;
    constructor(n: number);
    get startingSat(): Sat;
    get periodOffset(): number;
    add(n: number): Height;
    sub(n: number): Height;
    eq(n: number): boolean;
}
