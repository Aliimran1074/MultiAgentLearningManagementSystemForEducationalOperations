import { FileText, Upload, ExternalLink, CheckCircle } from "lucide-react";

export default function QuizAssignment({
  assignments = [],
  quizzes = [],
  submittedAssignments = [],
  submittedQuizzes = []
}) {


const isAssignmentSubmitted=(id)=>{

return submittedAssignments.some(
(item)=>item.assignmentId===id
)

}



const isQuizSubmitted=(id)=>{

return submittedQuizzes.some(
(item)=>item.quizId===id
)

}



return (

<div className="space-y-8">


{/* Assignments */}

<div>

<h2 className="text-xl font-semibold mb-4">
Assignments
</h2>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


{
assignments.map((assignment)=>{


const assignmentData =
JSON.parse(assignment.assignmentQuestions);



const submitted =
isAssignmentSubmitted(assignment._id);



return(


<div
key={assignment._id}
className="bg-white border rounded-lg p-6"
>


<div className="flex items-center gap-3 mb-4">

<FileText className="text-blue-600"/>

<h3 className="font-semibold">
{assignmentData.title}
</h3>

</div>



<p className="text-gray-600 mb-5">
Course Assignment
</p>



<div className="flex gap-3">


<a

href={assignment.assignmentFile}

target="_blank"

className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"

>

<ExternalLink size={18}/>

Open Assignment

</a>




<button

disabled={submitted}

className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
submitted
?
"bg-gray-300 cursor-not-allowed"
:
"bg-green-600 text-white"
}`}

>


{
submitted
?
<>
<CheckCircle size={18}/>
Submitted
</>
:
<>
<Upload size={18}/>
Upload Submission
</>
}


</button>



</div>



</div>


)

})

}



</div>


</div>







{/* Quizzes */}


<div>


<h2 className="text-xl font-semibold mb-4">

Quizzes

</h2>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">



{

quizzes.map((quiz)=>{


const quizData =
JSON.parse(quiz.quizQuestions);



const submitted =
isQuizSubmitted(quiz._id);



return(


<div

key={quiz._id}

className="bg-white border rounded-lg p-6"

>


<div className="flex items-center gap-3 mb-4">


<FileText className="text-purple-600"/>


<h3 className="font-semibold">

{quizData.title}

</h3>


</div>



<p className="text-gray-600 mb-5">

Course Quiz

</p>




<button

disabled={submitted}

className={`px-5 py-2 rounded-lg ${
submitted
?
"bg-gray-300 cursor-not-allowed"
:
"bg-purple-600 text-white"
}`}

>


{
submitted
?
"Already Submitted"
:
"Start Quiz"
}


</button>



</div>


)


})

}



</div>


</div>



</div>

)

}