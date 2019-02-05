import { Source as S } from 'callbag';

export default function combine<T1>(s1: S<T1>): S<[T1]>;
export default function combine<T1, T2>(s1: S<T1>, s2: S<T2>): S<[T1, T2]>;
export default function combine<T1, T2, T3>(s1: S<T1>, s2: S<T2>, s3: S<T3>): S<[T1, T2, T3]>;
export default function combine<T1, T2, T3, T4>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>): S<[T1, T2, T3, T4]>;
export default function combine<T1, T2, T3, T4, T5>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>): S<[T1, T2, T3, T4, T5]>;
export default function combine<T1, T2, T3, T4, T5, T6>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>, s6: S<T6>): S<[T1, T2, T3, T4, T5, T6]>;
export default function combine<T1, T2, T3, T4, T5, T6, T7>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>, s6: S<T6>, s7: S<T7>): S<[T1, T2, T3, T4, T5, T6, T7]>;
export default function combine<T1, T2, T3, T4, T5, T6, T7, T8>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>, s6: S<T6>, s7: S<T7>, s8: S<T8>): S<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export default function combine<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>, s6: S<T6>, s7: S<T7>, s8: S<T8>, s9: S<T9>): S<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export default function combine<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(s1: S<T1>, s2: S<T2>, s3: S<T3>, s4: S<T4>, s5: S<T5>, s6: S<T6>, s7: S<T7>, s8: S<T8>, s9: S<T9>, s10: S<T10>): S<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
