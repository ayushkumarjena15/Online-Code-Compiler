const url = "https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCKtPUXs8Nly_wgImA4wKHy8bRgC2TDUFQ";
fetch(url)
.then(res => res.json())
.then(data => console.log(data.models.map(m => m.name)))
.catch(console.error);
