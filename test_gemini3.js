const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCKtPUXs8Nly_wgImA4wKHy8bRgC2TDUFQ";
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
})
.then(res => res.json())
.then(data => console.log('flash-latest', data.error ? data.error.status : 'SUCCESS'));

const url2 = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCKtPUXs8Nly_wgImA4wKHy8bRgC2TDUFQ";
fetch(url2, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
})
.then(res => res.json())
.then(data => console.log('pro', data.error ? data.error.status : 'SUCCESS'));
