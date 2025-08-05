declare module 'deep-eql' {
    function deepEqual<T>(a: T, b: T, options?: { strict?: boolean }): boolean;
    export = deepEqual;
}
