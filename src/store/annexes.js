import jdds from '../../public/mocks/jdd-list.json';
import _types from '../../public/mocks/jdd-types.json';
import _environments from '../../public/mocks/environments.json';
import envVars from '../../env.json';

/**
 * @param {RegExp} regex
 */
export const customMatch = function(regex) {
    const str = this.toString();
    let m;
    const matches = {};

    if ((m = regex.exec(str)) !== null) {
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            matches[groupIndex] = match;
        });
    }

    return matches;
};

/**
 * @param {String} str
 * @param {number} place
 * @param {number} nbCharsToDelete
 */
export const stringSplice = function(str, place = 0, nbCharsToDelete = 1) {
    const array = str.split('');
    array.splice(place, nbCharsToDelete);
    return array.join('');
};

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export function getTextWidth(font= 'bold 12pt arial') {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(this);
    return metrics.width;
}

export const getEnv = (name) => envVars[name] ?? null;

export const getJddsFromMocks = async () => await (fetch(`${getEnv('MOCK_URL')}/jdds`).then(r => r.json()));

export const getTypesFromMocks = async () => await (fetch(`${getEnv('MOCK_URL')}/types`).then(r => r.json()));

export const getEnvironmentsFromMocks = async () => await (fetch(`${getEnv('MOCK_URL')}/environments`).then(r => r.json()));

export const defaultData = jdds;
export const types = _types;
export const environments = _environments;

/**
 * @param {{jdds: defaultData, searchJdds: defaultData, environments: Array<String>, types: Array<String>}} state
 * @param {String} query
 */
export const searchByFlags = ({ state }, query) => {
    const flags = query.split(';');

    state.searchJdds = Object.keys(state.jdds).reduce((r, c) => {
        return {
            ...r,
            [c]: state.jdds[c].reduce((_r, _c) =>
                flags.indexOf(_c.type) !== -1 || flags.indexOf(_c.type.toUpperCase()) !== -1 || flags.indexOf(_c.type.toLowerCase()) !== -1
                    ? [..._r, _c] : _r, [])
        }
    }, {});
};

/**
 * @param {{jdds: defaultData, searchJdds: defaultData, environments: Array<String>, types: Array<String>}} state
 * @param {Object} getters
 * @param {String} query
 */
export const searchByEnvs = ({ state, getters }, query) => {
    const envs = query.split(';');

    const searchJdds = Object.keys(state.jdds)
        .reduce((r, c) =>
            envs.indexOf(c) !== -1 || envs.indexOf(c.toUpperCase()) !== -1 || envs.indexOf(c.toLowerCase()) !== -1 ? [...r, c] : r, [])
        .reduce((r, c) => ({ ...r, [c]: state.jdds[c] }), {});

    for (const env of getters.environments) {
        if (Object.keys(searchJdds).indexOf(env) === -1) {
            searchJdds[env] = [];
        }
    }

    state.searchJdds = searchJdds;
}

/**
 * @param {{jdds: defaultData, searchJdds: defaultData, environments: Array<String>, types: Array<String>}} state
 * @param {Object} getters
 * @param {String} query
 */
export const searchByAll = ({ state, getters }, query) => {
    let splitQuery = query.split(';');

    const envs = getters.environments.reduce((r, c) => {
        const id = splitQuery.indexOf(c);

        if (id !== -1) {
            splitQuery.splice(id, 1);
            return [...r, c];
        }
        return r;
    }, []);

    if (envs.length === 0) {
        getters.environments.map(e => envs.push(e));
    }

    const flags = getters.types.reduce((r, c) => {
        const id = splitQuery.indexOf(c);

        if (id !== -1) {
            splitQuery.splice(id, 1);
            return [...r, c];
        }
        return r;
    }, []);

    const titles = [...splitQuery];

    let searchJdds = Object.keys(state.jdds)
        .reduce((r, c) => {
            return envs.indexOf(c) !== -1 || envs.indexOf(c.toUpperCase()) !== -1 || envs.indexOf(c.toLowerCase()) !== -1 ? [...r, c] : r
        }, [])
        .reduce((r, c) => {
            const jddsToAdd = titles.length > 0 ? state.jdds[c].reduce((_r, _c) => {
                const nbMatches = titles.reduce((matchesNb, t) => Object.keys(_c.case
                    .replace(/<(b|i|u)>/g, '')
                    .replace(/<\/(b|i|u)>/g, '')
                    .replace('/n', '')
                    .customMatch(new RegExp(`(.+)?(${t
                        .replace(/\(/g, '\\(')
                        .replace(/\)/g, '\\)')})(.+)?`))).length > 0
                    ? ++matchesNb : matchesNb, 0);

                return nbMatches > 0 ? [..._r, _c] : _r;
            }, []) : state.jdds[c];

            return { ...r, [c]: jddsToAdd };
        }, {});

    if (flags.length > 0) {
        searchJdds = Object.keys(searchJdds).reduce((r, c) => {
            return {
                ...r,
                [c]: searchJdds[c].reduce((_r, _c) =>
                    flags.indexOf(_c.type) !== -1 || flags.indexOf(_c.type.toUpperCase()) !== -1 || flags.indexOf(_c.type.toLowerCase()) !== -1
                        ? [..._r, _c] : _r, [])
            }
        }, {});
    }

    for (const env of getters.environments) {
        if (Object.keys(searchJdds).indexOf(env) === -1) {
            searchJdds[env] = [];
        }
    }

    state.searchJdds = searchJdds;
}
