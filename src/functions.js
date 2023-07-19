export function queryHelper (queryObject) {
    var subject = queryObject["subject"]
    var grade = queryObject["grade"]
    var topic = queryObject["topic"]
    var weeks = queryObject["weeks"]
    var lesson_no = queryObject["lesson_no"]
    var lesson_mins = queryObject["lesson_mins"]
    // var min_student_no = req.body["prompt[min_student_no]"]
    // var max_student_no = req.body["prompt[max_student_no]"]
  
    var subtopics = queryObject['subtopics'].reduce((word, item)=>{return word +" "+ item['subtopic']+" and"}, '')
    subtopics = subtopics.substring(0, subtopics.lastIndexOf("and"))
    // console.log(subtopics)
  
    var learning_objectives = queryObject['objectives'].reduce((word, item)=>{return word +" "+ item['objective']+" and"}, '')
    learning_objectives = learning_objectives.substring(0, learning_objectives.lastIndexOf("and"))
    // console.log(learning_objectives)
  
    if (queryObject["additional_notes"]!=''){
      var additional_notes = ", Consider the following as well: " + queryObject["additional_notes"].split("\n").join(", and ") + "."
    }
    else{
      var additional_notes = ''
    }
  
    var activities=""
    if (lesson_mins<=30){
      // activities="Activities must include an icebreaker or recap, an intro or lecture on today's topic, one activity only and a wrap up."
      activities = "Activities must have the following format 1. Icebreaker/Recap - .. (xx mins) \\n 2. Intro - .. (xx mins) \\n 3. Activity 1 - .. (xx mins) \\n 4. Wrap up - .. (xx mins)"
    }
    else if (lesson_mins<=45){
      // activities="Activities must only include an icebreaker or recap, an intro on today's topic, 2 extra activities and a wrap up."
      activities = "Activities must have the following format 1. Icebreaker/Recap: .. (xx mins) \\n 2. Intro: .. (xx mins) \\n 3. Activity 1: .. (xx mins) \\n 4. Activity 2: .. (xx mins) \\n 5. Wrap up\: .. (xx mins)"
    }
    else if (lesson_mins<=60){
      // activities="Activities must include first lecture on the present topic, first activity on the topic, second lecture on the present topic and second activity on the topic."
      activities = "Activities must have the following format 1. Lecture 1 - .. (xx mins) \\n 2. Activity 1 - .. (xx mins) \\n 3. Lecture 2 - .. (xx mins) \\n 4. Activity 2 - .. (xx mins) \\n"
    }
    else{
      // activities="Activities must include first lecture on the present topic, first activity on the topic, second lecture on the present topic, second activity on the topic, third lecture on the present topic and third activity on the topic."
      activities = "Activites must have the following format 1. Lecture 1 - .. (xx mins) \\n 2. Activity 1 - .. (xx mins) \\n 3. Lecture 2 - .. (xx mins) \\n 4. Activity 2 - .. (xx mins) \\n 5. Lecture 3 - .. (xx mins) \\n 6. Activity 3 - .. (xx mins) \\n"
    }
  
    var prompt = `You are a school teacher who wants to design a lesson plan. Design a sample ${subject} lesson plan for grade ${grade} students focusing on ${topic} as the topic and the following subtopics: ${subtopics}. The module is ${weeks} weeks long and must meet ${lesson_no} days per week and must have a total of exactly ${lesson_mins} minutes per lesson. The module's learning objectives are ${learning_objectives}. The generated lesson plan must include a rundown of the lesson, lesson objectives, activities and material lists. The material list should be limited to Quiz, Handouts, Excerpts, Worksheet, Flow Charts. ${activities}. ${additional_notes}`;
    return prompt
}     

export function resubmitHelper(queryObject) {
    // console.log(queryObject) 
    var promptEnd=" You must keep";

    var keys = Object.keys(queryObject)
    for (var i=0; i<keys.length-1; i++){
      promptEnd += " ["+keys[i] + "] as [" + queryObject[keys[i]] + "] and"
    }
    promptEnd = promptEnd.substring(0, promptEnd.lastIndexOf(" "))
    promptEnd += ". Generate non-repeating content for the remaining weeks and days. Remember to include all required keys (especially the 'material list' key) for the json output as specified earlier when generating your output."
    return promptEnd
}