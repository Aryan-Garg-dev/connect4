export interface Serializable<T = Record<string, any>> {
    toObject: () => T
}

export interface Hydratable<TClass, TJson = Record<string, any>> {
    fromObject: (data: TJson) => TClass
}