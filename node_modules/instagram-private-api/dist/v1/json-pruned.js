'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_MAX_DEPTH = 6;
const DEFAULT_ARRAY_MAX_LENGTH = 50;
let seen;
Date.prototype.toPrunedJSON = Date.prototype.toJSON;
String.prototype.toPrunedJSON = String.prototype.toJSON;
const escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
const meta = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\',
};
function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string)
        ? `"${string.replace(escapable, a => {
            const c = meta[a];
            return typeof c === 'string' ? c : `\\u${`0000${a.charCodeAt(0).toString(16)}`.slice(-4)}`;
        })}"`
        : `"${string}"`;
}
function str(key, holder, depthDecr, arrayMaxLength) {
    let i;
    let k;
    let v;
    let length;
    let partial;
    let value = holder[key];
    if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
        value = value.toPrunedJSON(key);
    }
    switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            if (depthDecr <= 0 || seen.includes(value)) {
                return '"-pruned-"';
            }
            seen.push(value);
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = Math.min(value.length, arrayMaxLength);
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value, depthDecr - 1, arrayMaxLength) || 'null';
                }
                v = partial.length === 0 ? '[]' : `[${partial.join(',')}]`;
                return v;
            }
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    try {
                        v = str(k, value, depthDecr - 1, arrayMaxLength);
                        if (v)
                            partial.push(`${quote(k)}:${v}`);
                    }
                    catch (e) {
                    }
                }
            }
            v = partial.length === 0 ? '{}' : `{${partial.join(',')}}`;
            return v;
    }
}
exports.pruned = (value, depthDecr, arrayMaxLength) => {
    seen = [];
    depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
    arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
    return str('', { '': value }, depthDecr, arrayMaxLength);
};
//# sourceMappingURL=json-pruned.js.map