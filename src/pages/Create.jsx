import React from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Heading, Box, Text, Select, Flex, Button} from "@chakra-ui/react";

import HookForm from './HookForm';
import FormDevArea from './FormDevArea';
import $ from 'jquery';
import Content from './Content';
import Loading from './Loading';


export default function Create() {
  const[response, setResponse] = React.useState({})
  const[devMode, setDevMode] = React.useState(false)
  const[isResponse, setIsResponse] = React.useState(false)
  const[isLoading, setIsLoading] = React.useState(false)
  const[promptState, setPrompt] = React.useState("")
  // const[promptFillState, setPromptFill] = React.useState("")

  async function devGPTResponse(queryValue) {
    setPrompt(queryValue["Prompt"])
    // "http://localhost:8081/devQuery"
    await fetch("https://psa-webservice.herokuapp.com/devQuery", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*', // Set the allowed origin (replace * with your specific origin)
        'Access-Control-Allow-Methods': 'POST, GET, PUT', // Set the allowed methods
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(queryValue)
    }).then(res=>{
      let readData = ""
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then(({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            const jsonData = JSON.parse(readData);
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
          const data = new TextDecoder().decode(value);
          readData += data
          read();
        })
      }
      read();
    })
  }

  async function updateGPTResponse(value) {
    // console.log(value)
    //"http://localhost:8081/query"
    await fetch("https://psa-webservice.herokuapp.com/query", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*', // Set the allowed origin (replace * with your specific origin)
        'Access-Control-Allow-Methods': 'POST, GET, PUT', // Set the allowed methods
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(value)
    }).then(res=>{
      let readData = ""
      const promptRegex = /^You are a school teacher who wants to design a lesson plan./
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then(({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            const jsonData = JSON.parse(readData);
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
          const data = new TextDecoder().decode(value);
          if (promptRegex.test(data)){
            setPrompt(data)
          }
          else {
            readData += data
          }
          read();
        })
      }
      read();
    })
  }

  async function reSubmit(value){
    // let sendPrompt = {"prompt": promptState, "addPrompt":{}};
    // console.log(promptState)
    // console.log(promptFillState)
    value["prompt"] = promptState //create new field
    console.log(value)

    //"http://localhost:8081/resubmit"
    await fetch("https://psa-webservice.herokuapp.com/resubmit" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*', // Set the allowed origin (replace * with your specific origin)
        'Access-Control-Allow-Methods': 'POST, GET, PUT', // Set the allowed methods
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(value)
    }).then(res=>{
      let readData = ""
      const reader = res.body.getReader();
      const read = () => {
        reader.read().then(({done, value}) => {
          if (done) {
            // console.log(readData)
            console.log("Fetch done!")
            const jsonData = JSON.parse(readData);
            setResponse(jsonData)
            setIsResponse(true)
            setIsLoading(false)
            return
          }
          const data = new TextDecoder().decode(value);
          readData += data
          read();
        })
      }
      read();
    })
  }

  function developerMode() {
    if(devMode){setDevMode(false)}
    else{setDevMode(true)}
    setIsLoading(false)
  }

  return (
    <Container  maxW=''>
        <Heading mt="30px" p="10px" color={"blue.300"} fontWeight={"bold"} alignSelf={"center"}>Lesson Plan Generator</Heading>
        <Button colorScheme='red' onClick={developerMode}>Toggle Developer Mode</Button>
        <div>
          {devMode? (
            <div>
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
            <Flex>
              <Box p={4} maxW='30%'>
                <HookForm updateResponse={updateGPTResponse} setIsResponse={setIsResponse} setIsLoading={setIsLoading}/>
              </Box>
              {isResponse && 
                <Box flex='1' maxW='80%'>
                  <Content data={response} reSubmit={reSubmit} setIsResponse={setIsResponse} setIsLoading={setIsLoading}/>
                </Box>}
              {isLoading && 
                <Box flex='1' maxW='80%'>
                  <Loading justify={"center"}/>
                </Box>}
            </Flex>
          )}
        </div>
    </Container>
  )
}
