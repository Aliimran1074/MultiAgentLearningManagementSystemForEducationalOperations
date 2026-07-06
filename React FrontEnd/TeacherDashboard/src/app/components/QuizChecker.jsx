import { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from './ui/card';

import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  BarChart3, 
  ArrowLeft,
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
          `http://localhost:3000/api/teacherDashboard/${teacherId}/quizSubmission`
        );


        const data = await res.json();


        console.log("📦 QUIZ DATA:",data);


        setQuizzes(data);


      }
      catch(error){

        console.log(
          "❌ Quiz Fetch Error:",
          error
        );

      }

    }


    if(teacherId)
    fetchQuizData();


  },[teacherId]);





  // =========================
  // FILTERS
  // =========================


  const pendingQuizzes = useMemo(()=>{

    return quizzes.filter(
      q=>q.status==="uncheck"
    );

  },[quizzes]);




  const gradedQuizzes = useMemo(()=>{

    return quizzes.filter(
      q=>q.status==="checked"
    );

  },[quizzes]);





  const currentData = 
    selectedTab==="pending"
    ? pendingQuizzes
    : gradedQuizzes;




  // =========================
  // DOWNLOAD
  // =========================


  const handleDownload=(url)=>{

    if(url)
    {
      window.open(url,"_blank");
    }

  };





  // =========================
  // MODAL
  // =========================


  const QuizDetailModal=({quiz,onClose})=>{


    const [score,setScore]=useState(
      quiz.score || ""
    );


    const [feedback,setFeedback]=useState("");



    const handleSave=()=>{


      console.log(
        "SAVE QUIZ MARKS",
        {
          quizId:quiz.quizId,
          studentId:quiz.studentId,
          marks:score
        }
      );


      /*
        yahan manual quiz marks API call add hogi
      */


      onClose();

    }



    return(

<div className="
fixed inset-0 
bg-black/60 
flex items-center 
justify-center 
z-50 
p-4
">


<Card className="
w-full 
max-w-3xl
max-h-[90vh]
overflow-y-auto
rounded-3xl
">


<CardHeader 
className="
flex flex-row 
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


<button onClick={onClose}>
<X/>
</button>


</CardHeader>





<CardContent className="space-y-5">



<div className="grid grid-cols-2 gap-4">


<div className="p-4 bg-blue-50 rounded-xl">

<p className="text-xs">
Student
</p>

<p className="font-bold">
{quiz.studentName}
</p>

</div>



<div className="p-4 bg-purple-50 rounded-xl">

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
items-center 
gap-2
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

value={score}

onChange={
e=>setScore(e.target.value)
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

onClick={handleSave}

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-bold
flex
justify-center
gap-2
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
// MAIN UI
// =========================


return (

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
lg:grid-cols-4 
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

{gradedQuizzes.length}

</h2>


</CardContent>

</Card>



</div>






{/* TABS */}


<div className="
flex
gap-3
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
px-5
py-2
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


<Card 
key={q.submissionId}
>


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


<p className="text-sm text-gray-500">

{q.studentName}
 •
{q.courseName}

</p>


<p className="text-xs">

Status:
{q.status}

</p>


</div>





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

{
selectedTab==="checked"
?
"Review"
:
"Grade"
}


</button>



</CardContent>


</Card>


))

}


</div>







{
selectedQuiz &&

<QuizDetailModal

quiz={selectedQuiz}

onClose={
()=>setSelectedQuiz(null)
}

/>

}


</div>


)

}