import './server';
import YTS from './providers/movie/YTS';
// Test provider

let yts = new YTS();

yts.fetch().then(console.log).catch(console.error);
