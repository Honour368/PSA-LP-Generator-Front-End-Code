import React from 'react'
import { useForm } from 'react-hook-form'
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Textarea,
    Box,
  } from '@chakra-ui/react'

export default function FormDevArea(props) {
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting },
        control
      } = useForm({})
    
    //function to submit prompt that will be passed to chatGPT.
    function onSubmit(values) {
        return new Promise((resolve) => {
            console.log(values)
            props.updateResponse(values)
            props.setIsResponse(false)
            props.setIsLoading(true)
            setTimeout(() => {
            alert("Your request has been submitted!" + "\n" + "Please wait a moment.")
            resolve()
            }, 1000)
        })
    } 
    
    //This displays the textbox area to input prompts as text.
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <FormControl>
                    <FormLabel pt='10px' htmlFor='learning_objectives'>Prompt</FormLabel>
                    <Textarea
                        placeholder={'Prompt'}
                        resize='vertical'
                        id={'Prompt'}
                        name={'Prompt'}
                        {...register("Prompt", {
                            required: 'This is required',
                            })}
                        />
                </FormControl>
                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                    Generate
                </Button>
            </div>
        </form>
    )
}