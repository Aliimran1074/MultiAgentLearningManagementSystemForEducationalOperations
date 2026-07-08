import { useEffect, useState } from 'react';
import {   Card,  CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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

  const [loading,setLoading] = useState(true)



  const getAgentsInfo = async()=>{


    try{


      const response =
      await fetch(
        `http://localhost:3000/api/teacherAIAgents/${teacherId}`
      )


      const data =
      await response.json()



      if(data.success){


        const backendAgents=data.agents



        setAgents([


          {
            id:"assignment-generator",
            name:"Assignment Generator",

            description:
            "Automatically generate customized assignments based on curriculum and difficulty level",

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
            "Create quizzes with multiple question types from your course content",

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
            "AI-powered grading and feedback for student assignments",

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
            "Automatic grading for objective-type quizzes",

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
            "Generate course materials, notes and study guides",

            icon:BookOpen,

            enabled:false,

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



  const enabledCount =
  agents.filter(a=>a.enabled).length




return (

<div className="space-y-6">



<Card>

<CardHeader>

<div className="flex items-start justify-between">


<div>

<CardTitle className="flex items-center gap-2">

<Sparkles className="w-5 h-5 text-yellow-500"/>

AI Agents Control Panel

</CardTitle>


<CardDescription className="mt-2">

Manage your AI powered teaching assistants

</CardDescription>


</div>


<div className="text-right">

<p className="text-2xl font-bold">

{enabledCount}/5

</p>

<p className="text-sm text-gray-600">

Active Agents

</p>


</div>



</div>


</CardHeader>



<CardContent>


<div className="grid grid-cols-1 md:grid-cols-3 gap-4">


<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">

<Activity className="w-6 h-6 text-blue-600 mb-2"/>

<p className="text-2xl font-bold text-blue-600">

{agents.reduce(
(total,a)=>
total+
(Object.values(a.stats)[0]||0)
,0)}

</p>


<p className="text-sm">

Total AI Tasks

</p>


</div>


<div className="p-4 bg-green-50 rounded-lg border border-green-200">

<Bot className="w-6 h-6 text-green-600 mb-2"/>

<p className="text-2xl font-bold">

AI

</p>

<p className="text-sm">

Automation Active

</p>

</div>



<div className="p-4 bg-purple-50 rounded-lg border border-purple-200">

<Sparkles className="w-6 h-6 text-purple-600 mb-2"/>

<p className="text-2xl font-bold">

96%

</p>

<p className="text-sm">

Accuracy Rate

</p>


</div>


</div>


</CardContent>

</Card>





<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


{
agents.map(agent=>{


const colors=getColorClasses(
agent.color,
agent.enabled
)


const Icon=agent.icon



return (


<Card 
key={agent.id}
className={`border-2 ${colors.border} ${
agent.enabled?'shadow-md':''
}`}
>


<CardHeader>


<div className="flex justify-between">


<div className="flex gap-3">


<div className={`p-3 rounded-lg ${colors.bg}`}>

<Icon 
className={`w-6 h-6 ${colors.text}`}
/>

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



<Switch
checked={agent.enabled}
disabled={
(agent.id==="assignment-generator" ||
agent.id==="quiz-generator")
&& !agent.enabled
}
/>


</div>


</CardHeader>




<CardContent>


<div className="p-3 bg-gray-50 rounded-lg">


<div className="grid grid-cols-2 gap-4">


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
Object.values(agent.stats)[1] || "Unlimited"
}

</p>


</div>


</div>


</div>




{
agent.remaining===0 &&

<p className="text-sm text-red-500 mt-3">

Limit reached. Add new topics disabled.

</p>

}



</CardContent>


</Card>


)

})


}


</div>


</div>

)

}