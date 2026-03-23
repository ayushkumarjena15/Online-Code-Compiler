import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCKtPUXs8Nly_wgImA4wKHy8bRgC2TDUFQ');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  try {
    const result = await model.generateContent("Say 'hello' if this works.");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error connecting to Gemini:", error.message, error);
  }
}
run();
