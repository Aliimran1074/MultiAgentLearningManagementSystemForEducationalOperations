import { useState, useEffect, useMemo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from './ui/card';

import {
  Clock,
  CheckCircle,
  X,
  Download,
  Send
} from 'lucide-react';



export default function QuizChecker() {


const teacherId = import.meta.env.VITE_TEACHER_ID;


const [selectedTab,setSelectedTab] = useState("pending");

const [selectedQuiz,setSelectedQuiz] = useState(null);

const [quizzes,setQuizzes] = useState([]);




// =========================
// FETCH QUIZ DATA
// =========================


useEffect(()=>{


const fetchQuizData = async()=>{

try{


const res = await fetch(
`https://univeristy-management-system.vercel.app/api/teacherDashboard/${teacherId}/quizSubmission`
);


const data = await res.json();


console.log("📦 QUIZ DATA:",data);


setQuizzes(data);


}

catch(error){

console.log(
"❌ Quiz Fetch Error",
error
);

}


}



if(teacherId)
fetchQuizData();



},[teacherId]);







// =========================
// FILTER
// =========================


const pendingQuizzes = useMemo(()=>{


return quizzes.filter(
q=>q.status==="uncheck"
);


},[quizzes]);




const checkedQuizzes = useMemo(()=>{


return quizzes.filter(
q=>q.status==="checked"
);


},[quizzes]);





const currentData =
selectedTab==="pending"
?
pendingQuizzes
:
checkedQuizzes;







// =========================
// DOWNLOAD
// =========================


const handleDownload=(url)=>{


if(url){

window.open(
url,
"_blank"
);

}


};








// =========================
// MARK QUIZ
// =========================


const handleSaveMarks=(quiz,marks,feedback)=>{


console.log(
"Saving Quiz Marks",
{
quizId:quiz.quizId,
studentId:quiz.studentId,
marks,
feedback
}
);


// API yahan add hogi


setSelectedQuiz(null);


};









// =========================
// MODAL
// =========================


const QuizModal=({quiz,onClose})=>{


const [marks,setMarks]=useState(
quiz.marks || ""
);


const [feedback,setFeedback]=useState("");



return(

<div className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
p-4
">


<Card className="
w-full
max-w-xl
rounded-3xl
">


<CardHeader className="
flex
flex-row
justify-between
items-center
">


<div>

<CardTitle>
Grade Quiz
</CardTitle>


<CardDescription>

{quiz.studentName}
•
{quiz.quizTitle}

</CardDescription>


</div>


<button
onClick={onClose}
>

<X/>

</button>


</CardHeader>





<CardContent className="space-y-5">


<div className="
grid
grid-cols-2
gap-4
">


<div className="
bg-blue-50
p-4
rounded-xl
">


<p className="text-xs">
Student
</p>


<p className="font-bold">

{quiz.studentName}

</p>


</div>





<div className="
bg-purple-50
p-4
rounded-xl
">


<p className="text-xs">
Course
</p>


<p className="font-bold">

{quiz.courseName}

</p>


</div>


</div>






<button

onClick={()=>handleDownload(quiz.uploadedFile)}

className="
flex
gap-2
items-center
bg-gray-100
px-4
py-2
rounded-xl
"

>


<Download size={18}/>

Download Quiz File


</button>








<div>


<label className="font-bold">
Marks
</label>


<input

type="number"

value={marks}

onChange={
e=>setMarks(e.target.value)
}

className="
w-full
border
p-3
rounded-xl
"

/>


</div>







<div>


<label className="font-bold">
Feedback
</label>


<textarea

value={feedback}

onChange={
e=>setFeedback(e.target.value)
}

className="
w-full
border
p-3
rounded-xl
"

/>


</div>







<button

onClick={()=>handleSaveMarks(
quiz,
marks,
feedback
)}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
flex
justify-center
gap-2
font-bold
"

>


<Send size={18}/>

Save Result


</button>



</CardContent>


</Card>


</div>

)


}









// =========================
// UI
// =========================


return(


<div className="
max-w-6xl
mx-auto
px-4
py-6
space-y-6
">


<h1 className="
text-3xl
font-black
">

Quiz Checker

</h1>







{/* STATS */}


<div className="
grid
grid-cols-2
gap-4
">


<Card>

<CardContent className="p-5">

<Clock/>

<p>
Pending
</p>


<h2 className="text-2xl font-bold">

{pendingQuizzes.length}

</h2>


</CardContent>

</Card>





<Card>

<CardContent className="p-5">

<CheckCircle/>


<p>
Checked
</p>


<h2 className="text-2xl font-bold">

{checkedQuizzes.length}

</h2>


</CardContent>

</Card>


</div>







{/* TABS */}


<div className="
flex
gap-4
border-b
">


{
[
"pending",
"checked"
].map(tab=>(


<button

key={tab}

onClick={()=>setSelectedTab(tab)}

className={`
pb-2
font-bold
${
selectedTab===tab
?
"text-blue-600 border-b-2 border-blue-600"
:
"text-gray-500"
}
`}

>

{tab}

</button>


))

}


</div>









{/* LIST */}


<div className="space-y-4">


{

currentData.length===0

?

<div className="
text-center
py-20
text-gray-400
font-bold
">

No {selectedTab} quizzes available

</div>


:


currentData.map(q=>(


<Card key={q.submissionId}>


<CardContent className="
p-5
flex
justify-between
items-center
">


<div>


<h2 className="font-bold">

{q.quizTitle}

</h2>



<p className="
text-sm
text-gray-500
">

{q.studentName}
•
{q.courseName}

</p>




<p className="
text-xs
text-gray-400
">

Status:
{
q.status==="uncheck"
?
"Pending"
:
"Checked"
}

</p>


</div>








<div className="flex gap-2">


{

selectedTab==="checked"

&&

<button

onClick={()=>handleDownload(q.uploadedFile)}

className="
bg-gray-100
p-3
rounded-xl
"

>

<Download size={18}/>

</button>

}




{

selectedTab==="pending"

&&

<button

onClick={()=>setSelectedQuiz(q)}

className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
"

>

Grade

</button>

}



</div>



</CardContent>


</Card>


))

}


</div>







{

selectedQuiz

&&

<QuizModal

quiz={selectedQuiz}

onClose={
()=>setSelectedQuiz(null)
}

/>

}


</div>

)

}