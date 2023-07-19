import React from "react";
import { Button, Flex, Spacer, Text } from '@chakra-ui/react'
import {CopyToClipboard} from "react-copy-to-clipboard"

function CopyNextStep() {
    alert("Material Copied to Clipboard. \nPlease Paste Material in MS Word.")
}

export default function Material(props) {
    return (
        <div>
            <hr style={{
                borderColor: 'red',
                marginTop: '50px'
            }} />
            <Flex>
                <Text fontSize={'3xl'} color={'blue.300'} as='b'>Material Section</Text>
                <Spacer />
                {props.isMaterialGenerated && 
                    <CopyToClipboard text={props.material}  mt='10px'>
                        <Button colorScheme='teal' onClick={CopyNextStep}>Copy to Clipboard</Button>
                    </CopyToClipboard>}
            </Flex>
            
            <div id="material section">
                {props.material}
            </div>
        </div>
        
    )
}