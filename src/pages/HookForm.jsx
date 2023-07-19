import React from 'react'
import ReactDOM from 'react-dom/client'
import { useFieldArray, useForm, useController } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
  Flex,
} from '@chakra-ui/react'
import {Select} from "@chakra-ui/react";
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react'

export default function HookForm(props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control
  } = useForm({
    defaultValues: {
      subtopics: [{subtopic:''}],
      objectives: [{objective:''}]
    }
  })

  const {field: weeks} = useController({
    name:'weeks',
    control,
    rules: { required: true, min:1, max:10 },
  });

  const {field: lesson_no} = useController({
    name:'lesson_no',
    control,
    rules: { required: true, min:1, max:14 },
  });

  const {field: lesson_mins} = useController({
    name:'lesson_mins',
    control,
    rules: { required: true, min:1, max:100 },
  });

  const {
    fields: subtopicFields, 
    append: subtopicAppend, 
    remove: subtopicRemove
  } = useFieldArray({name:'subtopics', control})

  const {
    fields: objectiveFields, 
    append: objectiveAppend, 
    remove: objectiveRemove
  } = useFieldArray({name:'objectives', control})

  function onSubmit(values) { 
    return new Promise((resolve) => {
        props.updateResponse(values)
        props.setIsResponse(false)
        props.setIsLoading(true)
      setTimeout(() => {
        alert("Your request has been submitted!" + "\n" + "Please wait a moment.")
        resolve()
      }, 1000)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor='subject'>Choose your subject</FormLabel>
        <Select 
            id='subject'
            placeholder='Select Subject'
            {...register('subject')}
            >
            {/*Subject options below*/}
            <option value='English as a Second Language'>English as a Second Language</option>
            <option value='Grammar'>Grammar</option>
            <option value='Reading'>Reading</option>
            <option value='Writing'>Writing</option>
            <option value='Remedial'>Remedial</option>
            <option value='Rhetoric'>Rhetoric</option>
            <option value='Literature'>Literature</option>
            <option value='Drama'>Drama</option>
            <option value='Fiction'>Fiction</option>
            <option value='Poetry'>Poetry</option>
            <option value='Folklore'>Folklore</option>
        </Select>

        <FormLabel pt='10px' htmlFor='grade'>Choose your grade level</FormLabel>
        <Select 
            id='grade'
            name='grade'
            placeholder='Select Grade'
            {...register('grade')}
            >
            {/*Grade level options below*/}
            <option value='Pre-School'>Pre-School</option>
            <option value='1'>1st Grade</option>
            <option value='2'>2nd Grade</option>
            <option value='3'>3rd Grade</option>
            <option value='4'>4th Grade</option>
            <option value='5'>5th Grade</option>
            <option value='6'>6th Grade</option>
            <option value='7'>7th Grade</option>
            <option value='8'>8th Grade</option>
            <option value='9'>9th Grade</option>
            <option value='10'>10th Grade</option>
            <option value='11'>11th Grade</option>
            <option value='12'>12th Grade</option>
        </Select>
        
        {/*Textbox input for module topic*/}
        <FormLabel pt='10px' htmlFor='topic'>Topic of Module</FormLabel>
        <Input
          id='topic'
          name='topic'
          placeholder='Module Topic'
          {...register('topic', {
            required: 'This is required',
          })}
        />

        {/*Textbox input for module topic subtopics*/}
        {/*Also implements multiple subtopics using "useFieldArray" hook*/}
        <FormLabel pt='10px' htmlFor='subtopic'>Module Subtopics</FormLabel>
        {subtopicFields.map((field, index)=>{
          if ((index+1)!=subtopicFields.length) {
            return <Flex mb={2} key={field.id}>
                      <Input
                      id={'subtopic '+ (index+1)}
                      name={'subtopic '+ (index+1)}
                      resize='vertical'
                      placeholder={'Subtopic '+ (index+1)}
                      {...register(`subtopics.${index}.subtopic`,{
                        required: 'This is required',
                      })}
                      />
                      <Button ml={2} colorScheme='blue' variant='outline' onClick={()=>{subtopicRemove(index)}}>
                        -
                      </Button>
                    </Flex>
          }
          return <Flex key={field.id}>
                    <Input
                    id={'subtopic '+(index+1)}
                    name={'subtopic '+(index+1)}
                    resize='vertical'
                    placeholder={'Subtopic '+(index+1)}
                    {...register(`subtopics.${index}.subtopic`,{
                      required: 'This is required',
                    })}
                    />
                    <Button ml={2} colorScheme='blue' variant='outline' onClick={()=>{subtopicAppend(
                      {subtopic:''}
                    )}}>
                      +
                    </Button>
                  </Flex>
        })}

        {/*Number input for number of weeks*/}
        <FormLabel pt='10px' htmlFor='weeks'>Number of weeks</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={10} clampValueOnBlur={true}
            id='weeks'
            name="weeks"
            onChange={weeks.onChange}
            value={weeks.value}
            {...weeks}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        {/*Number input for number of lessons per week*/}
        <FormLabel pt='10px' htmlFor='lesson_no'>Number of Lessons per Week</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={14} clampValueOnBlur={true}
            id='lesson_no'
            name="lesson_no"
            onChange={lesson_no.onChange}
            value={lesson_no.value}
            {...lesson_no}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        {/*Number input for lesson length*/}
        <FormLabel pt='10px' htmlFor='lesson_mins'>Length of lesson (in mins)</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={180} clampValueOnBlur={true}
            id='lesson_mins'
            name="lesson_mins"
            onChange={lesson_mins.onChange}
            value={lesson_mins.value}
            {...lesson_mins}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        {/*Textbox input for learning objectives*/}
        {/*Also implements multiple learning objectives using "useFieldArray" hook*/}
        <FormLabel pt='10px' htmlFor='learning_objectives'>Learning Objectives</FormLabel>
        {objectiveFields.map((field, index)=>{
          if ((index+1)!=objectiveFields.length) {
            return <Flex mb={2} key={field.id}>
                      <Textarea
                        placeholder={'Learning Obj '+ (index+1)}
                        resize='vertical'
                        id={'Learning Obj '+ (index+1)}
                        name={'Learning Obj '+ (index+1)}
                        {...register(`objectives.${index}.objective`, {
                            required: 'This is required',
                          })}
                      />
                      <Button ml={2} mt={5} colorScheme='blue' variant='outline' onClick={()=>{objectiveRemove(index)}}>
                        -
                      </Button>
                    </Flex>
            }
          return <Flex key={field.id}>
                  <Textarea
                        placeholder={'Learning Obj '+ (index+1)}
                        resize='vertical'
                        id={'Learning Obj '+ (index+1)}
                        name={'Learning Obj '+ (index+1)}
                        {...register(`objectives.${index}.objective`, {
                            required: 'This is required',
                          })}
                      />
                      <Button ml={2} mt={5} colorScheme='blue' variant='outline' onClick={()=>{objectiveAppend(
                        {objective:''}
                      )}}>
                        +
                      </Button>
                </Flex>  
        })}

        {/*Textbox input for additional notes*/}
        <FormLabel pt='10px' htmlFor='additional_notes'>Additional Notes</FormLabel>
        <Textarea
            // value={value}
            // onChange={handleInputChange}
            placeholder="Include craft activities. \n Don't include icebreakers etc"
            resize='vertical'
            id='additional_notes'
            name="additional_notes"
            {...register('additional_notes')}
        />

        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
        Generate
      </Button>
    </form>
  )
}