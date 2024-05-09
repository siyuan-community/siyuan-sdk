import type { Assertion, AsymmetricMatchersContaining } from "vitest";

interface CustomMatchers<R> {
    toResolve(resolve: (result: any) => void): R;
}

declare module "vitest" {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}
