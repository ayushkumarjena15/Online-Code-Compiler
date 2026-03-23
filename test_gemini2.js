const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCKtPUXs8Nly_wgImA4wKHy8bRgC2TDUFQ";
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
