import { useEffect, useState } from 'react';

import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from './ui/card';

import { Switch } from './ui/switch';

import { 
  Bot,
  FileText,
  ClipboardCheck,
  BookOpen,
  Sparkles,
  Activity
} from 'lucide-react';



export default function AIAgentsControl({teacherId}) {


const [agents,setAgents] = useState([])

const [teacherAIInfo,setTeacherAIInfo] = useState(null)

const [loading,setLoading] = useState(true)



// MODAL STATES

const [showAssignmentModal,setShowAssignmentModal] = useState(false)

const [showQuizModal,setShowQuizModal] = useState(false)



// FORM STATES

const [selectedCourse,setSelectedCourse] = useState("")

const [topicName,setTopicName] = useState("")

const [noOfQuestions,setNoOfQuestions] = useState(5)

const [difficultyLevel,setDifficultyLevel] = useState("easy")

const [totalMarks,setTotalMarks] = useState(20)

const [duration,setDuration] = useState(7)



// ================================
// GET AI AGENT INFO
// ================================


const getAgentsInfo = async()=>{


try{


const response = await fetch(
`http://localhost:4000/api/teacherAIAgents/${teacherId}`
)


const data = await response.json()



if(data.success){


setTeacherAIInfo(data)



const backendAgents = data.agents



setAgents([


{
id:"assignment-generator",

name:"Assignment Generator",

description:
"Automatically generate assignments using AI",

icon:FileText,

enabled:
backendAgents.assignmentGenerator.enabled,

color:"blue",

stats:{
generated:
backendAgents.assignmentGenerator.used,

limit:
backendAgents.assignmentGenerator.limit
},

remaining:
backendAgents.assignmentGenerator.remaining

},



{
id:"quiz-generator",

name:"Quiz Generator",

description:
"Create quizzes using AI",

icon:ClipboardCheck,

enabled:
backendAgents.quizGenerator.enabled,

color:"green",

stats:{
generated:
backendAgents.quizGenerator.used,

limit:
backendAgents.quizGenerator.limit
},

remaining:
backendAgents.quizGenerator.remaining

},




{
id:"assignment-checker",

name:"Assignment Checker",

description:
"AI powered assignment checking",

icon:FileText,

enabled:true,

color:"purple",

stats:{
checked:
backendAgents.assignmentChecker.used
}

},




{
id:"quiz-checker",

name:"Quiz Checker",

description:
"Automatic quiz checking",

icon:ClipboardCheck,

enabled:true,

color:"orange",

stats:{
checked:
backendAgents.quizChecker.used
}

},



{
id:"content-creator",

name:"Course Content Creator",

description:
"Generate course content",

icon:BookOpen,

enabled:true,

color:"indigo",

stats:{
created:0
}

}



])


}


}
catch(error){

console.log(error)

}
finally{

setLoading(false)

}


}




useEffect(()=>{

getAgentsInfo()

},[])


const toggleAgent = (agentId) => {

  setAgents(prev =>
    prev.map(agent =>
      agent.id === agentId
        ? { ...agent, enabled: !agent.enabled }
        : agent
    )
  )

}


// ================================
// CREATE ASSIGNMENT TOPICS
// ================================


const createAssignmentTopic = async()=>{


try{


const response = await fetch(
"http://localhost:4000/api/createTopic",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

subscriptionId:
teacherAIInfo.subscriptionId,


courseId:
selectedCourse,


staffId:
teacherAIInfo.teacherId,


duration,


assignmentTopics:[

{

topicName,

source:"outside",

noOfQuestions:Number(noOfQuestions),

difficultyLevel,

totalMarks:Number(totalMarks)

}

]


})

}


)


const data = await response.json()


console.log(data)



setShowAssignmentModal(false)

getAgentsInfo()



}
catch(error){

console.log(error)

}


}





// ================================
// CREATE QUIZ TOPICS
// ================================


const createQuizTopic = async()=>{


try{


const response = await fetch(

"http://localhost:4000/api/quizInput",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

subscriptionId:
teacherAIInfo.subscriptionId,


courseId:
selectedCourse,


staffId:
teacherAIInfo.teacherId,


duration,


quizTopics:[

{

topicName,

source:"outside",

type:"MCQs Based",

noOfQuestions:Number(noOfQuestions),

difficultyLevel,

totalMarks:Number(totalMarks)

}

]


})


}

)


const data = await response.json()


console.log(data)


setShowQuizModal(false)


getAgentsInfo()


}
catch(error){

console.log(error)

}



}



// ================================
// COLOR HANDLER
// ================================


const getColorClasses=(color,enabled)=>{


const colors={


blue:{
bg:enabled?'bg-blue-100':'bg-gray-100',
text:enabled?'text-blue-600':'text-gray-400',
border:enabled?'border-blue-200':'border-gray-200'
},


green:{
bg:enabled?'bg-green-100':'bg-gray-100',
text:enabled?'text-green-600':'text-gray-400',
border:enabled?'border-green-200':'border-gray-200'
},


purple:{
bg:enabled?'bg-purple-100':'bg-gray-100',
text:enabled?'text-purple-600':'text-gray-400',
border:enabled?'border-purple-200':'border-gray-200'
},


orange:{
bg:enabled?'bg-orange-100':'bg-gray-100',
text:enabled?'text-orange-600':'text-gray-400',
border:enabled?'border-orange-200':'border-gray-200'
},


indigo:{
bg:enabled?'bg-indigo-100':'bg-gray-100',
text:enabled?'text-indigo-600':'text-gray-400',
border:enabled?'border-indigo-200':'border-gray-200'
}


}


return colors[color]

}




if(loading){

return <p>Loading AI Agents...</p>

}



const enabledCount = agents.filter(agent => agent.enabled).length
return (

<div className="space-y-6">



<Card>


<CardHeader>


<div className="flex justify-between">


<div>


<CardTitle className="flex gap-2 items-center">

<Sparkles className="text-yellow-500"/>

AI Agents Control Panel

</CardTitle>


<CardDescription>

Manage AI teaching assistants

</CardDescription>


</div>



<div className="text-right">

<p className="text-2xl font-bold">

{enabledCount}/5

</p>

<p className="text-sm">

Active Agents

</p>

</div>


</div>


</CardHeader>




<CardContent>


<div className="grid md:grid-cols-3 gap-4">


<div className="p-4 bg-blue-50 rounded-lg border">

<Activity className="text-blue-600"/>

<p className="text-2xl font-bold">

{
agents.reduce(
(sum,a)=>
sum+
(Object.values(a.stats)[0] || 0)
,0)
}

</p>

<p>Total AI Tasks</p>

</div>




<div className="p-4 bg-green-50 rounded-lg border">

<Bot className="text-green-600"/>

<p className="font-bold text-xl">

AI

</p>

<p>Automation Active</p>

</div>




{/* <div className="p-4 bg-purple-50 rounded-lg border">

<Sparkles className="text-purple-600"/>

<p className="font-bold text-xl">

96%

</p>

<p>Accuracy</p>


</div> */}


</div>


</CardContent>


</Card>





<div className="grid lg:grid-cols-2 gap-6">


{

agents.map(agent=>{


const colors =
getColorClasses(
agent.color,
agent.enabled
)


const Icon = agent.icon



return (


<Card

key={agent.id}

className={`border-2 ${colors.border}`}

>



<CardHeader>


<div className="flex justify-between">


<div className="flex gap-3">


<div className={`p-3 rounded-lg ${colors.bg}`}>

<Icon className={`w-6 h-6 ${colors.text}`}/>

</div>


<div>

<CardTitle>

{agent.name}

</CardTitle>


<CardDescription>

{agent.description}

</CardDescription>


</div>


</div>





{
<Switch
  checked={agent.enabled}
  onCheckedChange={() => toggleAgent(agent.id)}
  disabled={
    (
      agent.id === "assignment-generator" ||
      agent.id === "quiz-generator"
    )
      ? agent.remaining === 0
      : false
  }
/>
}
</div>


</CardHeader>





<CardContent>


<div className="bg-gray-50 rounded-lg p-3">


<div className="grid grid-cols-2">


<div>

<p className="text-xs">

Used

</p>


<p className="font-bold">

{
Object.values(agent.stats)[0]
}

</p>


</div>




<div>

<p className="text-xs">

Limit

</p>


<p className="font-bold">

{
Object.values(agent.stats)[1]
||
"Unlimited"
}

</p>


</div>


</div>


</div>






{
(agent.id==="assignment-generator" ||
agent.id==="quiz-generator")
&&

<button

disabled={agent.remaining===0}

onClick={()=>{


if(agent.id==="assignment-generator")

setShowAssignmentModal(true)


else

setShowQuizModal(true)


}}


className={`mt-4 w-full py-2 rounded-lg text-white ${
agent.remaining===0
?
"bg-gray-400"
:
"bg-black"
}`}

>

{
agent.remaining===0
?
"Limit Completed"
:
"Add Topic"
}


</button>


}




</CardContent>


</Card>


)


})


}


</div>







{/* ===========================
ASSIGNMENT MODAL
=========================== */}



{
showAssignmentModal &&


<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-xl w-[400px] space-y-4">


<h2 className="font-bold text-lg">

Create Assignment Topic

</h2>




<select

className="border p-2 w-full"

value={selectedCourse}

onChange={e=>setSelectedCourse(e.target.value)}

>

<option value="">

Select Course

</option>


{
teacherAIInfo?.courses?.map(course=>(

<option

key={course._id}

value={course._id}

>

{course.name}

</option>


))

}


</select>




<input

className="border p-2 w-full"

placeholder="Topic Name"

onChange={e=>setTopicName(e.target.value)}

/>




<input

className="border p-2 w-full"

type="number"

placeholder="Questions"

value={noOfQuestions}

onChange={e=>setNoOfQuestions(e.target.value)}

/>



<select

className="border p-2 w-full"

onChange={e=>setDifficultyLevel(e.target.value)}

>

<option>

easy

</option>

<option>

medium

</option>

<option>

hard

</option>

</select>



<button

onClick={createAssignmentTopic}

className="bg-black text-white w-full py-2 rounded-lg"

>

Create

</button>


</div>


</div>


}







{/* ===========================
QUIZ MODAL
=========================== */}



{
showQuizModal &&


<div className="fixed inset-0 bg-black/40 flex items-center justify-center">


<div className="bg-white p-6 rounded-xl w-[400px] space-y-4">


<h2 className="font-bold text-lg">

Create Quiz Topic

</h2>



<select

className="border p-2 w-full"

value={selectedCourse}

onChange={e=>setSelectedCourse(e.target.value)}

>

<option>

Select Course

</option>


{
teacherAIInfo?.courses?.map(course=>(


<option

key={course._id}

value={course._id}

>

{course.name}

</option>


))

}


</select>




<input

className="border p-2 w-full"

placeholder="Topic Name"

onChange={e=>setTopicName(e.target.value)}

/>




<select

className="border p-2 w-full"

onChange={e=>setDifficultyLevel(e.target.value)}

>

<option>

easy

</option>

<option>

medium

</option>

<option>

hard

</option>

</select>




<button

onClick={createQuizTopic}

className="bg-black text-white w-full py-2 rounded-lg"

>

Create

</button>



</div>


</div>


}



</div>

)

}