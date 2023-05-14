import React from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Heading, Box, Text, Select, Flex} from "@chakra-ui/react";

import HookForm from './HookForm';
import $ from 'jquery';
import Content from './Content';


export default function Create() {
  const[response, setResponse] = React.useState({})
  const[isResponse, setIsResponse] = React.useState(false)
  const[promptState, setPrompt] = React.useState("")

  function updateGPTResponse(value) {
    $.ajax({
      method: "PUT",
      url: "http://localhost:8081/query",
      datatype: "json",
      data: {prompt:value}, //can change this to remove the "prompt"
      success: ((result)=> {
        setResponse(result["response"])
        // console.log(result);
        setIsResponse(true)
        setPrompt(result["prompt"])

      }).bind(this)
    })
  }

  function reSubmit(value){
    // let sendPrompt = {"prompt": promptState, "addPrompt":{}};
    console.log(typeof promptState)
    console.log(value)
    value["prompt"] = promptState
    // sendPrompt["addPrompt"] = value
    // console.log(sendPrompt["addPrompt"])
    // console.log(sendPrompt)
    $.ajax({
        method: "POST",
        url: "http://localhost:8081/resubmit",
        datatype: "json",
        data: value,
        success: ((result)=> {
          setResponse(result["response"])
          // console.log(result);
          setIsResponse(true)
          setPrompt(result["prompt"])
  
        }).bind(this)
        // success: ((result)=> {
        //   setResponse(result)
        //   // console.log(result);
        //   setIsResponse(true)
        // }).bind(this)
      })
}


  return (
    <Container  maxW=''>
        <Heading mt="30px" p="10px" color={"blue.300"} fontWeight={"bold"} alignSelf={"center"}>Lesson Plan Generator</Heading>
        <Flex>
          <Box p={4} maxW='20%'>
            <HookForm updateResponse={updateGPTResponse}/>
          </Box>
              {isResponse && 
              <Box flex='1' maxW='80%'>
                <Content data={response} reSubmit={reSubmit}/>
              </Box>}
       
          
        </Flex>
    </Container>
  )
}
