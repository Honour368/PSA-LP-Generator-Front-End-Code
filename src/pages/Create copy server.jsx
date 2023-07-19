import React, {useRef} from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Heading, Box, Text, Select, Flex, Button} from "@chakra-ui/react";

import HookForm from './HookForm';
import FormDevArea from './FormDevArea';
import Content from './Content';
import Loading from './Loading';
import Material from './Material';
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

  // const API_KEY = import.meta.env.VITE_API_KEY
  const bottomEl = useRef(null)
  const gptModel = "gpt-3.5-turbo"
  // const[promptFillState, setPromptFill] = React.useState("")

  function scrollToBottom () {
    bottomEl?.current?.scrollIntoView({behavior: 'smooth'})
  }

  function clearError() {
    setGenerateErrorState(false)
    setIsLoading(false)
  }

  //single function to communicate with server
  //Used only for content generation and not material generation
  //Processes response gotten from server
  function serverPromptRequest(prompt) {
    let requestVar = {"prompt":prompt, "model":gptModel}

    //request is being made to localhost right now.
    //will need to update "fetch URL" when server is being hosted by website
    fetch("http://localhost:8081/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*', // Set the allowed origin (replace * with your specific origin)
        'Access-Control-Allow-Methods': 'POST, GET, PUT', // Set the allowed methods
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(requestVar)
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
            let regex = /}}(\s*){/
            if (regex.test(readData)){
              readData = await readData.replace(/}}(\s*){/g, "},")
              
            }
            if (readData.slice(-2)!="}}"){
              readData+="}"
            }

            console.log(readData)
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
          const data = new TextDecoder().decode(value);
          readData+=data
          read();
        })
      }
      read();
    }) 
  }
  
  function devGPTResponse(queryValue) {
    setPrompt(queryValue["Prompt"])
    let promptGPT = queryValue["Prompt"] + '. Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.'
    console.log(promptGPT)
    serverPromptRequest(promptGPT)
  }

  function updateGPTResponse(value) {
    setIsMaterial(false)
    setMaterial("")
    var prompt = queryHelper(value)
    setPrompt(prompt)
    var promptGPT = prompt + ' Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.'
    console.log(promptGPT)

    serverPromptRequest(promptGPT) 
  }

  function reSubmit(value){
    setIsMaterial(false)
    setMaterial("")
    let promptGPT = promptState + 'Your output string must strictly have only this JSON format "Week x Day x": {"title": "..", "objective": "..", "activity": "1. .. (xx mins) \\n", "material list": "1. .. \\n"}. You must only use UTF-8 charset to encode the JSON output and the JSON output must be able to be parsed in express js. You must not add new line after every key value pair in the JSON output. Your entire response must only be the JSON string. There must be no extra comments, no extra notes and no extra texts before and after the JSON string in your response.' + resubmitHelper(value)

    console.log(promptGPT)
    serverPromptRequest(promptGPT)
  }

  function developerMode() {
    if(devMode){setDevMode(false)}
    else{setDevMode(true)}
    setIsLoading(false)
  }

  function generateMaterial(text, objective) {
    setIsMaterial(true)
    setIsMaterialGenerated(false)
    let prompt = `You are a school teacher who wants to design a lesson material. Generate in-depth ${text} with the objective of ${objective}.`
    
    let requestVar = {"prompt":prompt, "model":gptModel}
    fetch("http://localhost:8081/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*', // Set the allowed origin (replace * with your specific origin)
        'Access-Control-Allow-Methods': 'POST, GET, PUT', // Set the allowed methods
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(requestVar)
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
          const data = new TextDecoder().decode(value);
          readData+=data
          setMaterial(readData) 
          read();
        })
      }
      read();
    })
  }

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
