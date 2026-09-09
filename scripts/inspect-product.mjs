import * as cheerio from 'cheerio';

const url = process.argv[2];
const res = await fetch(url);
const html = await res.text();
const $ = cheerio.load(html);

console.log('STATUS', res.status);
console.log('TITLE', $('title').text());
console.log('H1', $('h1').first().text().trim());
console.log('--- breadcrumb ---');
$('.woocommerce-breadcrumb, .breadcrumb, nav.breadcrumb').each((i,el)=>console.log($(el).text().replace(/\s+/g,' ').trim()));
console.log('--- price ---');
$('.price, .woocommerce-Price-amount').each((i,el)=>console.log(i, $(el).text().trim()));
console.log('--- gallery images ---');
$('.woocommerce-product-gallery img, .product-gallery img, figure img, .images img').each((i,el)=>console.log(i, $(el).attr('src') || $(el).attr('data-src'), $(el).attr('alt')));
console.log('--- description ---');
const desc = $('.woocommerce-product-details__short-description, .product-short-description, #tab-description, .description').first().text().replace(/\s+/g,' ').trim();
console.log(desc.slice(0,500));
console.log('--- product classes ---');
console.log($('.product').first().attr('class'));
console.log('--- category tags ---');
$('.posted_in a, .product_meta a').each((i,el)=>console.log($(el).text().trim(), $(el).attr('href')));
