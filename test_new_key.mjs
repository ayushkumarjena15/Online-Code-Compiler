import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyDWvk-8UDP4MVvu5_Lu6M-ZVZ5o4pSMRhQ');

async function testModel(name) {
  try {
    const model = genAI.getGenerativeModel({ model: name });
    await model.generateContent('hi');
    console.log(name, 'WORKS!');
  } catch(e) {
    console.log(name, 'ERROR:', e.status || e.message);
  }
}

async function run() {
  await testModel('gemini-1.5-flash');
  await testModel('gemini-1.5-flash-latest');
  await testModel('gemini-1.5-pro');
  await testModel('gemini-pro');
  await testModel('gemini-2.0-flash');
}
run();
