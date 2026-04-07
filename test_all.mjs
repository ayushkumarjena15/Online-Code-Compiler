import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyDWvk-8UDP4MVvu5_Lu6M-ZVZ5o4pSMRhQ');
async function testModel(name) {
  try {
    const model = genAI.getGenerativeModel({ model: name });
    await model.generateContent('hi');
    console.log(name, 'WORKS!');
  } catch(e) {
    console.log(name, 'ERROR:', e.status, JSON.stringify(e.errorDetails) || e.message);
  }
}
async function run() {
  await testModel('gemini-2.5-flash');
}
run();
