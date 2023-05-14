import { config } from "../chatGPT/dotenv"
config()

import { Configuration, OpenAIApi } from "openai"
// console.log(process.env.API_KEY)

const openAi = new OpenAIApi(new Configuration({
      apiKey: process.env.API_KEY,
    })
  )

// const userInterface = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// })

module.exports = {
  chatGPT: async function getInput(prompt) {
  console.log("ChatGPT Running")
  chatResponse = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
    return chatResponse
  }
}