'use strict';

const fs = require('fs');
const json_beautifier = require('csvjson-json_beautifier');

module.exports = (js_filepath, object) => {
    object = escape_single_quote(JSON.parse(JSON.stringify(object)));
    let result = json_beautifier(object, {
        dropQuotesOnKeys: true, dropQuotesOnNumbers: true, 
        inlineShortArrays: 1, quoteType: 'single', space: 4, minify: false
    });
    result = result.replace(/__single_quote__/g, '\\\'');
    fs.writeFileSync(js_filepath, '\'use strict\';\n\nmodule.exports = ');
    fs.appendFileSync(js_filepath, result + ';\n');
};

function escape_single_quote(value) {
    const type = typeof value;
    if (!value) {
        return value;
    } else if (type === 'object') {
        for (const [key, val] of Object.entries(value)) {
            value[key] = escape_single_quote(val);
        }
        return value;
    } else if (type === 'string') {
        return value.replace(/'/g, '__single_quote__');
    } else {
        return value;
    }
}