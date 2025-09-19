export type Mods = Record<string, boolean | undefined>;

/**
 * Функция для склеивания css классов
 * @param {string} cls (обязательно) основной класс, который отображается всегда
 * @param {{[className: string]: boolean}} mods (опционально) объект вида { [classname: string]: boolean }, применяется только при true значении ключа
 * @param {Array<string | undefined>} additional (опционально) массив строк-классов которые применяются всегда
 * @returns {string} строку-класс, которая применяется к компоненту
 * @supported любую версию React, поддерживающая аттрибут className
 */
export function classNames(
    cls: string,
    mods: Mods = {},
    additional: Array<string | undefined> = [],
): string {
    return [
        cls,
        ...Object.entries(mods)
            .filter(([_, value]) => Boolean(value))
            .map(([className, _]) => className),
        ...additional,
    ].join(' ');
}
