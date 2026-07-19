import { useEffect, useState } from 'react';
import { BookOpen, ClipboardList, Award, MessageCircle, Home } from 'lucide-react';

import Dashboard from './components/Dashboard';
import ContentView from './components/ContentView';
import QuizAssignment from './components/QuizAssignment';
import Grading from './components/Grading';
import Counseling from './components/Counseling';

export default function App(){

const studentId="6a12dcfb7ee0df75b1e22a45";

const [activeTab,setActiveTab]=useState("dashboard");
const [studentData,setStudentData]=useState(null);
const [loading,setLoading]=useState(true);


const getStudentDashboardInfo=async()=>{

try{

const response=await fetch(
`https://univeristy-management-system.vercel.app/api/studentDashboardInfo/${studentId}`
);

const data=await response.json();

console.log("Student Dashboard Data",data);


if(data.success){

setStudentData(data.data);

}

}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

}



useEffect(()=>{

getStudentDashboardInfo();

},[])



if(loading){

return <p>Loading Student Dashboard...</p>

}



const course = studentData?.courses?.[0] || {}



const navigation=[

{
id:"dashboard",
label:"Dashboard",
icon:Home
},

{
id:"content",
label:"Content",
icon:BookOpen
},

{
id:"quiz",
label:"Quiz & Assignments",
icon:ClipboardList
},

{
id:"grading",
label:"Grading",
icon:Award
},

{
id:"counseling",
label:"Counseling",
icon:MessageCircle
}

]



return(

<div className="min-h-screen bg-gray-50">


<header className="bg-white shadow-sm border-b">

<div className="max-w-7xl mx-auto px-4 py-4">


<h1 className="text-gray-900">
Student Portal
</h1>


<p className="text-gray-600">
{studentData?.name}
</p>


</div>

</header>



<nav className="bg-white border-b">

<div className="flex gap-2 overflow-x-auto">


{
navigation.map(item=>{

const Icon=item.icon;

return(

<button

key={item.id}

onClick={()=>setActiveTab(item.id)}

className={`flex items-center gap-2 px-6 py-4 border-b-2 ${
activeTab===item.id
?
"border-blue-600 text-blue-600"
:
"border-transparent text-gray-600"
}`}

>

<Icon className="w-5 h-5"/>

{item.label}

</button>

)

})

}


</div>

</nav>




<main className="max-w-7xl mx-auto px-4 py-8">


{
activeTab==="dashboard" &&

<Dashboard

studentData={studentData}

/>

}



{

activeTab==="content" &&

<ContentView
courses={studentData?.courses || []}
/>


}


 
{
activeTab==="quiz" &&

<QuizAssignment
courseName={course.courseName}
assignments={course.assignments || []}
quizzes={course.quizzes || []}
submittedAssignments={course.submittedAssignments || []}
submittedQuizzes={course.submittedQuizzes || []}
studentId={studentId}
/>

}



{
activeTab==="grading" &&

<Grading
grades={[
...(course.submittedAssignments || []),
...(course.submittedQuizzes || [])
]}

/>

}



{
activeTab==="counseling" &&

<Counseling

counsellingData={course.counselling || []}

grades={[
...(course.submittedAssignments || []),
...(course.submittedQuizzes || [])
]}

/>

}



</main>


</div>


)

}