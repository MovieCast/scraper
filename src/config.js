export const environment = process.env.NODE_ENV || 'development';
export const baseConfig = require('../config/base.json');

export function loadConfig(env) {
    try {
        return require(`../config/${env}.json`);
    } catch(e) {
        throw Error("An error occured while loading the config file:", e);
    }
}

export function getConfig(env) {
    return Object.assign({}, baseConfig, loadConfig(env || environment));
}