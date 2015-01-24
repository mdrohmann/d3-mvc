module.exports = {};

module.exports.get_unique = function(arr) {
    var u = {}, a = [];
    var l = arr.length;
    var i = 0;
    for(i = 0; i < l; ++i) {
        if(u.hasOwnProperty(arr[i])) {
            continue;
        }
        a.push(arr[i]);
        u[arr[i]] = 1;
    }
    return a;
};

module.exports.string_to_slug = function(str) {
    // Separate camel-cased words with a space for later processing. 
    str = str.replace(/[A-Z]/g, function(s){ 
        return " " + s; 
    });

    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;",
        to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(from[i], to[i]);
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    // Trim leading and trailing whitespace and dashes. 
    str = str.replace(/^[\s|-]+|[\s|-]+$/g, '');

    return str;
};

/* vim: set sw=4: */
