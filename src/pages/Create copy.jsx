import React, {useRef} from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Heading, Box, Text, Select, Flex, Button} from "@chakra-ui/react";

import HookForm from './HookForm';
import FormDevArea from './FormDevArea';
import Content from './Content';
import Loading from './Loading';
import Material from './Material';

//This files implement functions that creates the final prompt sent to chatGPT using the variables
//gotten from the forms or the "keep/drop" shopping cart.
import { queryHelper, resubmitHelper } from '../functions';

export default function Create() {
  const[response, setResponse] = React.useState({})
  const[devMode, setDevMode] = React.useState(false)
  const[isResponse, setIsResponse] = React.useState(false)
  const[isLoading, setIsLoading] = React.useState(false)
  const[promptState, setPrompt] = React.useState("")
  const[generateErrorState, setGenerateErrorState] = React.useState(false)
  const[errorMessage, setErrorMessage] = React.useState("")
  const[unparsedResponse, setUnparsedResponse] = React.useState("")
  const[isMaterial, setIsMaterial] = React.useState(false)
  const[material, setMaterial] = React.useState("")
  const[isMaterialGenerated, setIsMaterialGenerated] = React.useState(false)

  const API_KEY = import.meta.env.VITE_API_KEY
  const bottomEl = useRef(null)
  // const[promptFillState, setPromptFill] = React.useState("")

  function scrollToBottom () {
    bottomEl?.current?.scrollIntoView({behavior: 'smooth'})
  }

  //function to clear any error and reset the app
  function clearError() {
    setGenerateErrorState(false)
    setIsLoading(false)
  }
  
  //function to handle generating response for prompts in developer mode
  function devGPTResponse(queryValue) {
    setPrompt(queryValue["Prompt"])
    let promptGPT = queryValue["Prompt"] + '. Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.'
    console.log(promptGPT)

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model:'gpt-3.5-turbo',
        messages: [{role:"user", content: promptGPT}],
        temperature:0,
        stream:true,
      })
    }).then(res=>{
      let readData = ""
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then( async ({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            readData = readData.trim()

            //remove unwanted additional notes and comments from GPT
            let lastIndex = readData.lastIndexOf('}', readData.length)
            if (lastIndex!=readData.length) {
              readData = readData.slice(0, lastIndex+1)
            }

            setUnparsedResponse(readData)
            // console.log(readData.slice(-2))
            // console.log(readData)
            let regex = /}}(\s*){/
            // console.log(regex.test(readData))
            if (regex.test(readData)){
              // console.log("ChatGPT Error")
              readData = await readData.replace(/}}(\s*){/g, "},")
              // console.log(readData)
              
            }
            if (readData.slice(-2)!="}}"){
              readData+="}"
            }

            let jsonData={}
            try {
              jsonData = JSON.parse(readData);
            } catch(err) {
              alert(err)
              setGenerateErrorState(true)
              setIsLoading(false)
              return
            }
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
          try {
            const data = new TextDecoder().decode(value);
            let lines = (data.split("\n"))
            .map(line=>line.replace(/^data: /,"").trim())
            .filter(line=>line!==""&&line!=="[DONE]")
            .map(line=>JSON.parse(line))

            for (const line of lines) {
              const {choices} = line
              const {delta} = choices[0]
              const {content} = delta
              
              if (content) {
                console.log(content)
                readData += content 
              }
            }     
            read();
          }
          catch(err) {
            alert(err)
            setGenerateErrorState(true)
            setIsLoading(false)
          }    
        })
      }
      read();
    })
  }

  //function to handle generating response for prompts from form
  function updateGPTResponse(value) {
    setIsMaterial(false)
    setMaterial("")
    var prompt = queryHelper(value)
    setPrompt(prompt)
    var promptGPT = prompt + ' Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.'
    console.log(promptGPT)
    //"http://localhost:8081/query"

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages: [{role:"user", content: promptGPT}],
        temperature:0,
        stream:true,
      })
    }).then(res=>{
      let readData = ""
      // const promptRegex = /^You are a school teacher who wants to design a lesson plan./
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then( async ({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            readData = readData.trim()
            // console.log(readData)

            //remove unwanted additional notes and comments from GPT
            let lastIndex = readData.lastIndexOf('}', readData.length)
            if (lastIndex!=readData.length) {
              readData = readData.slice(0, lastIndex+1)
            }
            
            setUnparsedResponse(readData)
            // console.log(readData.slice(-2))
            // console.log(readData)
            let regex = /}}(\s*){/
            // console.log(regex.test(readData))
            if (regex.test(readData)){
              // console.log("ChatGPT Error")
              readData = await readData.replace(/}}(\s*){/g, "},")
              // console.log(readData)
              
            }
            if (readData.slice(-2)!="}}"){
              readData+="}"
            }

            let jsonData={}
            try {
              jsonData = JSON.parse(readData);
            } catch(err) {
              alert(err)
              setGenerateErrorState(true)
              setIsLoading(false)
              return
            }
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
          try {
            const data = new TextDecoder().decode(value);
            let lines = (data.split("\n"))
            .map(line=>line.replace(/^data: /,"").trim())
            .filter(line=>line!==""&&line!=="[DONE]")
            .map(line=>JSON.parse(line))

            for (const line of lines) {
              const {choices} = line
              const {delta} = choices[0]
              const {content} = delta
              
              if (content) {
                console.log(content)
                readData += content 
              }
            }     
            read();
          }
          catch(err) {
            alert(err)
            setGenerateErrorState(true)
            setIsLoading(false)
          }
        })
      }
      read();
    }) 
  }

  //function to handle generating response for prompts keep/drop mode
  function reSubmit(value){
    setIsMaterial(false)
    setMaterial("")
    let promptGPT = promptState + 'Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.' + resubmitHelper(value)

    console.log(promptGPT)

    fetch("https://api.openai.com/v1/chat/completions" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages: [{role:"user", content: promptGPT}],
        temperature:0,
        stream:true,
      })
    }).then(res=>{
      let readData = ""
      // const promptRegex = /^You are a school teacher who wants to design a lesson plan./
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then( async ({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            readData = readData.trim()

            //remove unwanted additional notes and comments from GPT
            let lastIndex = readData.lastIndexOf('}', readData.length)
            if (lastIndex!=readData.length) {
              readData = readData.slice(0, lastIndex+1)
            }
            
            setUnparsedResponse(readData)
            // console.log(readData.slice(-2))
            // console.log(readData)
            let regex = /}}(\s*){/
            // console.log(regex.test(readData))
            if (regex.test(readData)){
              // console.log("ChatGPT Error")
              readData = await readData.replace(/}}(\s*){/g, "},")
              // console.log(readData)
              
            }
            if (readData.slice(-2)!="}}"){
              readData+="}"
            }

            let jsonData = {}
            try {
              jsonData = JSON.parse(readData);
            } catch(err) {
              setGenerateErrorState(true)
              setIsLoading(false)
              return
            }
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
         try {
            const data = new TextDecoder().decode(value);
            let lines = (data.split("\n"))
            .map(line=>line.replace(/^data: /,"").trim())
            .filter(line=>line!==""&&line!=="[DONE]")
            .map(line=>JSON.parse(line))

            for (const line of lines) {
              const {choices} = line
              const {delta} = choices[0]
              const {content} = delta
              
              if (content) {
                console.log(content)
                readData += content 
              }
            }     
            read();
          }
          catch(err) {
            alert(err)
            setGenerateErrorState(true)
            setIsLoading(false)
          }
        })
      }
      read();
    })
  }

  //function to toggle developer mode display
  function developerMode() {
    if(devMode){setDevMode(false)}
    else{setDevMode(true)}
    setIsLoading(false)
  }

  //function to generate materials 
  function generateMaterial(text, objective) {
    setIsMaterial(true)
    setIsMaterialGenerated(false)
    let prompt = `You are a school teacher who wants to design a lesson material. Generate in-depth ${text} with the objective of ${objective}.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages: [{role:"user", content: prompt}],
        temperature:0,
        stream:true,
      })
    }).then(res=>{
      let readData = ""
      const reader = res.body.getReader();
      scrollToBottom();
      const read = () => {
        reader.read().then( async ({done, value}) => {
          if (done) {
            console.log("Fetch done!")
            scrollToBottom()
            setIsMaterialGenerated(true)
            return
          }
          try {
            const data = new TextDecoder().decode(value);
            let lines = (data.split("\n"))
            .map(line=>line.replace(/^data: /,"").trim())
            .filter(line=>line!==""&&line!=="[DONE]")
            .map(line=>JSON.parse(line))

            for (const line of lines) {
              const {choices} = line
              const {delta} = choices[0]
              const {content} = delta
              
              if (content) {
                // console.log(content)
                readData += content
                setMaterial(readData) 
              }
            }     
            read();
          }
          catch(err) {
            alert(err)
            setGenerateErrorState(true)
            setIsLoading(false)
          }
        })
      }
      read();
    })
  }

  //this generates the layout for all contents created/generated by rendering the following components:
  //FormDevArea: generates Text box area to get prompt as text input
  //Content: generates Table for displaying response from chatGPT
  //Loading: generates animation of 3 dots to show the app is loading the response
  //HookForm: generates form for user input which will be used to make initial prompt
  //Material: generates an empty box where materials generated by chatGPT is displayed
  return (
    <Container  maxW=''>
        <Heading mt="30px" p="10px" color={"blue.300"} fontWeight={"bold"} alignSelf={"center"}>Lesson Plan Generator</Heading>
        
        <div>
          {generateErrorState? (
            <div>
              <div><Button mb={4} colorScheme='teal' onClick={clearError}>Reload</Button></div>
              <div>There was an error generating your response. </div>
              <div>Please seek technical assistance</div>
              <div>Response from GPT: {unparsedResponse}</div>
            </div>
          ):
          (devMode? (
            <div>
              <Button colorScheme='red' onClick={developerMode}>Leave Developer Mode</Button>
              <Box p={4} maxW='100%'>
                <div><b>Reference Prompt: </b>{promptState}</div>
                <FormDevArea updateResponse={devGPTResponse} setIsLoading={setIsLoading} setIsResponse={setIsResponse}/>
              </Box>
              {isResponse && 
                <Box flex='1' maxW='100%'>
                  <Content data={response} reSubmit={reSubmit} setIsResponse={setIsResponse} setIsLoading={setIsLoading}/>
                </Box>}
              {isLoading && 
                <Box flex='1' maxW='100%'>
                  <Loading justify={"center"}/>
                </Box>}
            </div>
          ):(
            <div>
            <Button colorScheme='red' onClick={developerMode}>Enter Developer Mode</Button>
            <Flex>
              <Box p={4} maxW='30%'>
                <HookForm updateResponse={updateGPTResponse} setIsResponse={setIsResponse} setIsLoading={setIsLoading}/>
              </Box>
              {isResponse && 
                <Box flex='1' maxW='80%'>
                  <Content data={response} reSubmit={reSubmit} setIsResponse={setIsResponse} setIsLoading={setIsLoading} generateMaterial={generateMaterial}/>
                </Box>}
              {isLoading && 
                <Box flex='1' maxW='80%'>
                  <Loading justify={"center"}/>
                </Box>}
            </Flex>
            {isMaterial && 
              <Box whiteSpace='pre-wrap'>
                <Material material={material} isMaterialGenerated={isMaterialGenerated} whiteSpace='pre-wrap'></Material>
                <div ref={bottomEl}></div>
              </Box>
            }
            </div>
          ))}
        </div>
    </Container>
  )
}
