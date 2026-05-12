import slugify from 'slugify';
console.log('slugify:', slugify);
try {
    console.log('slugify("Test"):', slugify("Test", { lower: true }));
} catch (e) {
    console.log('slugify("Test") failed');
}
try {
    console.log('slugify.default("Test"):', slugify.default("Test", { lower: true }));
} catch (e) {
    console.log('slugify.default("Test") failed');
}
