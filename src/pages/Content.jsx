import React from 'react'
import ReactDOM from 'react-dom/client'
import { Container, Heading, List, ListItem, Text, UnorderedList, Wrap, WrapItem } from "@chakra-ui/react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button
  } from '@chakra-ui/react'

  import $ from 'jquery';


export default function Content(props) {
    const[Feedback, setFeedback] = React.useState({})

    function getKeys (obj) {
        return Object.keys(obj)    
    }

    var column_keys = []
    var day_keys =[]
    var feedBack = {};
    feedBack = Feedback;

    function generateColumns (obj) {
        // let week_keys = getKeys(obj)
        let day_keys = getKeys(obj)
        // console.log(getKeys(obj[day_keys[0]]))
        column_keys = getKeys(obj[day_keys[0]])
    }

    function generateDayKeys (obj) {
        day_keys = getKeys(obj)
    }

    function storeCell(e) {
        var currentElementID = e.target.id
        var currentElement = document.getElementById(currentElementID)
        var grandparent = document.getElementById(currentElementID).parentElement.parentElement.id
        var greatGrandparent = document.getElementById(currentElementID).parentElement.parentElement.parentElement.id
        var value = props.data[greatGrandparent][grandparent];
        var key = greatGrandparent+" "+grandparent;
       
        if(!feedBack.hasOwnProperty(key)){
            feedBack[key] = value;
            setFeedback(feedBack)
            currentElement.innerHTML = "Drop"
        }
        else{
            delete feedBack[key]
            setFeedback(Feedback)
            currentElement.innerHTML = "Add"
        }

        // console.log(currentElement);
        // console.log(grandparent);
        // console.log(greatGrandparent);
        console.log(Feedback);
    }

    function resubmit(){
        props.reSubmit(Feedback)
        alert("Your request has been submitted!" + "\n" + "Please wait a moment.")
        //reset all checkboxes as well!
        setFeedback({})
    }

    
    
  return (
   <TableContainer maxWidth='100%'>
        <Table variant='striped' colorScheme="blue"> 
            <Thead>
                <Tr>
                    <Th>
                        Week and Day
                    </Th>
                    {generateColumns(props.data)}
                    {column_keys.map((column_key)=>{
                        return <Th maxWidth='20%'>
                            {column_key}
                        </Th>
                    })}
                </Tr>
            </Thead>
            <Tbody>
                {generateDayKeys(props.data)}
                {day_keys.map((day_key)=>{  
                    // console.log(day_key);
                    return <Tr /*key={day_key}*/ id={day_key}>
                        <Td key={day_key} whiteSpace='pre-wrap' maxWidth='50px' id={day_key + " row"}>
                            {day_key}
                        </Td>
                        <Td key={day_key + " title"} whiteSpace='pre-wrap' maxWidth='150px' id={"title"}>
                            {props.data[day_key]['title']}
                            <div id={day_key + " title" + " div"}>
                                <Button mt={4} id={day_key + " title" + " button"} size ="sm" variant="outline" colorScheme='blue' onClick={storeCell}>
                                    Add
                                </Button> 
                            </div>      
                        </Td>
                        <Td key={day_key + " objective"} whiteSpace='pre-wrap' maxWidth='200px' id={"objective"}>
                            {props.data[day_key]['objective']}
                            <div id={day_key + " objective" + " div"}>
                                <Button mt={4} id={day_key + " objective" + " button"} size ="sm" variant="outline" colorScheme='blue' onClick={storeCell}>
                                    Add
                                </Button> 
                            </div>
                        </Td>
                        <Td key={day_key + " activity"} whiteSpace='pre-wrap' maxWidth='400px' id={"activity"}>
                            {props.data[day_key]['activity']}
                            <div id={day_key + " activity" + " div"}>
                                <Button mt={4} id={day_key + " activity" + " button"} size ="sm" variant="outline" colorScheme='blue' onClick={storeCell}>
                                    Add
                                </Button> 
                            </div>
                        </Td>
                        {/* <Td key={day_key + " rundown"} whiteSpace='pre-wrap' maxWidth='300px' id={"rundown"}>
                            {props.data[day_key]['rundown']}
                            <input type="checkbox" id={day_key + " rundown" + " checkbox"} onChange={storeCell}></input>                            
                        </Td> */}
                        <Td key={day_key + " material list"} whiteSpace='pre-wrap' maxWidth='250px' id={"material list"}>
                            {props.data[day_key]['material list']}
                            <div id={day_key + " material list" + " div"}>
                                <Button mt={4} id={day_key + " material list" + " button"} size ="sm" variant="outline" colorScheme='blue' onClick={storeCell}>
                                    Add
                                </Button> 
                            </div>
                        </Td>
                    </Tr>
                })}
            </Tbody>
        </Table>
        <Button mt={4} colorScheme='teal' onClick={resubmit} type='submit'>
            Make Changes
        </Button>
   </TableContainer>
    
  )
}