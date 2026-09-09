import * as cheerio from 'cheerio';

const url = process.argv[2] || 'https://hoatayviet.net/';
const res = await fetch(url);
const html = await res.text();
const $ = cheerio.load(html);

console.log('STATUS', res.status, 'LEN', html.length);
console.log('---HEAD LINKS (fonts/css)---');
$('head link, head style').each((i, el) => {
  const tag = $(el);
  if (tag.is('link')) console.log(tag.attr('rel'), tag.attr('href'));
});
console.log('---TITLE---', $('title').text());
console.log('---BODY CLASSES---', $('body').attr('class'));
