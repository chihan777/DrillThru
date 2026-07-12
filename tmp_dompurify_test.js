const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const dirty = '<p style="font-size:24px;color:red;">Test font size</p>';
const clean = DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['p'],
  ALLOWED_ATTR: ['style'],
  ADD_ATTR: ['style'],
  ALLOW_DATA_ATTR: true,
});
console.log(clean);
console.log('contains style:', /style=/.test(clean));
