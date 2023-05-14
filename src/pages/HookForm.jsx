import React from 'react'
import ReactDOM from 'react-dom/client'
import { useForm } from 'react-hook-form'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex, Center
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
  } = useForm()

  function onSubmit(values) { //change here to communicate with backend
    return new Promise((resolve) => {
        props.updateResponse(values)
      setTimeout(() => {
        alert("Your request has been submitted!" + "\n" + "Please wait a moment.")
        resolve()
      }, 1000)
    })
  }

//   const [SliderValue, setSliderValue] = React.useState(100);
//   const handleSliderChange = (val) => {setSliderValue(val)}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>

        <FormLabel htmlFor='subject'>Choose your subject</FormLabel>
        <Select 
            id='subject'
            placeholder='Select Subject'
            {...register('subject')}
            >
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

        <FormLabel pt='10px' htmlFor='topic'>Topic of Module</FormLabel>
        <Input
          id='topic'
          name='topic'
          placeholder='Module Topic'
          {...register('topic', {
            required: 'This is required',
          })}
        />

        <FormLabel pt='10px' htmlFor='subtopic'>Module Subtopics</FormLabel>
        <Input
          id='subtopic'
          name='subtopic'
          resize='vertical'
          placeholder='Subtopic'
          {...register('topic', {
            required: 'This is required',
          })}
        />

        <FormLabel pt='10px' htmlFor='weeks'>Number of weeks</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={10} clampValueOnBlur={true}
            id='weeks'
            name="weeks"
            {...register('weeks',{
                required: 'This is required',
              })}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        <FormLabel pt='10px' htmlFor='lesson_no'>Number of Lessons per Week</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={14} clampValueOnBlur={true}
            id='lesson_no'
            name="lesson_no"
            {...register('lesson_no',{
                required: 'This is required',
              })}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        <FormLabel pt='10px' htmlFor='lesson_mins'>Length of lesson (in mins)</FormLabel>
        <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={180} clampValueOnBlur={true}
            id='lesson_mins'
            name="lesson_mins"
            {...register('lesson_mins',{
                required: 'This is required',
              })}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        {/* <p style={{fontWeight:'600', paddingTop:'10px'}}>Number of students:</p>
        <Flex>
            <FormLabel htmlFor='min_student_no' alignSelf={'center'}>Min</FormLabel>
            <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={40} clampValueOnBlur={true}
                id='min_student_no'
                name="min_student_no"
                {...register('min_student_no',{
                    required: 'This is required',
                  })}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            
            <FormLabel htmlFor='max_student_no' alignSelf={'center'} paddingInlineStart={'10px'}>Max</FormLabel>
            <NumberInput size='md' maxW={24} defaultValue={1} min={1} max={20} clampValueOnBlur={true}
                id='max_student_no'
                name="max_student_no"
                {...register('max_student_no',{
                    required: 'This is required',
                  })}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Flex> */}

        <FormLabel pt='10px' htmlFor='learning_objectives'>Learning Objectives</FormLabel>
        <Textarea
            // value={value}
            // onChange={handleInputChange}
            placeholder={'Learning Obj 1' + '\n' + 'Learning Obj 2'}
            resize='vertical'
            id='learning_objectives'
            name="learning_objectives"
            {...register('learning_objectives', {
                required: 'This is required',
              })}
        />
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





        {/* <Slider min={30} max={180} 
            id = 'lesson_mins'
            name = "lesson_mins"
            flex='1' 
            focusThumbOnChange={false}
            value={SliderValue}
            {...register('lesson_mins')}
            // onChange={handleSliderChange}
            onChange={(e)=>{
                register('lesson_mins').onChange(e);
                {handleSliderChange};
            }}
        >
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize='sm' boxSize='32px' children={SliderValue} />
        </Slider> */}

        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
        Submit
      </Button>
    </form>
  )
}