import { useState } from "react";
import { ExternalLink, Upload, CheckCircle2 } from "lucide-react";

export default function QuizAssignment({
  courseName,
  assignments = [],
  quizzes = [],
  submittedAssignments = [],
  submittedQuizzes = [],
  studentId
}) {


const [uploadedAssignments,setUploadedAssignments]=useState(
submittedAssignments
);

const [uploadedQuizzes,setUploadedQuizzes]=useState(
submittedQuizzes
);



const checkAssignmentSubmitted=(id)=>{

return uploadedAssignments.some(
item=>
item.assignmentId===id ||
item.assignmentId?._id===id
)

}



const checkQuizSubmitted=(id)=>{

return uploadedQuizzes.some(
item=>
item.quizId===id ||
item.quizId?._id===id
)

}




const uploadAssignment=async(e,assignmentId)=>{


const file=e.target.files[0];


if(!file)
return;


const formData=new FormData();


formData.append(
"assignmentId",
assignmentId
);


formData.append(
"studentId",
studentId
);


formData.append(
"pdf",
file
);



try{


const response=await fetch(
"http://localhost:4000/api/uploadAssignment",
{
method:"POST",
body:formData
}
);


const data=await response.json();



if(response.ok){


setUploadedAssignments([
...uploadedAssignments,
data.uploadAssignment
]);


alert("Assignment Uploaded Successfully");


}
else{

alert(data.message);

}


}
catch(error){

console.log(error);

}


}




const uploadQuiz=async(e,quizId)=>{


const file=e.target.files[0];


if(!file)
return;



const formData=new FormData();


formData.append(
"quizId",
quizId
);


formData.append(
"studentId",
studentId
);


formData.append(
"pdf",
file
);



try{


const response=await fetch(
"https://univeristy-management-system.vercel.app/api/uploadingQuiz",
{
method:"POST",
body:formData
}
);


const data=await response.json();



if(response.ok){


setUploadedQuizzes([
...uploadedQuizzes,
data.uploadQuiz
]);


alert("Quiz Uploaded Successfully");


}
else{

alert(data.message);

}


}
catch(error){

console.log(error);

}


}




return(


<div className="space-y-8">



{/* Assignments */}


<div>


<h2 className="text-xl font-semibold mb-4">
Assignments
</h2>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


{

assignments.map((assignment)=>{


let assignmentInfo={};


try{

assignmentInfo=
JSON.parse(
assignment.assignmentQuestions
);

}
catch(error){

console.log(error);

}



const submitted=
checkAssignmentSubmitted(
assignment._id
);



return(


<div
key={assignment._id}
className="bg-white border rounded-lg p-6 shadow-sm"
>


<h3 className="text-lg font-semibold">
{assignmentInfo.title}
</h3>


<p className="text-gray-600 mt-1"> 
{courseName}
</p>


<p className="text-blue-600 mt-2">
Total Marks : {assignmentInfo.total_marks}
</p>



<div className="flex gap-3 mt-6">


<a
href={assignment.assignmentFile}
target="_blank"
rel="noreferrer"
className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
>

<ExternalLink size={18}/>

Open Assignment

</a>



<input
type="file"
accept="application/pdf"
hidden
id={`assignment-${assignment._id}`}
onChange={(e)=>
uploadAssignment(
e,
assignment._id
)}
/>



<button

disabled={submitted}

onClick={()=>{

document
.getElementById(
`assignment-${assignment._id}`
)
.click()

}}

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

<CheckCircle2 size={18}/>
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






{/* Quiz */}



<div>


<h2 className="text-xl font-semibold mb-4">
Quizzes
</h2>



<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


{

quizzes.map((quiz,index)=>{


let quizInfo={};


try{

quizInfo=
JSON.parse(
quiz.quizQuestions
)

}
catch(error){

console.log(error);

}



const submitted=
checkQuizSubmitted(
quiz._id
);



return(


<div
key={quiz._id}
className="bg-white border rounded-lg p-6 shadow-sm"
>


<h3 className="text-lg font-semibold">
Quiz {index+1}
</h3>



<p className="text-gray-600 mt-1">
{courseName}
</p>


<p className="text-blue-600 mt-2">
Total Marks : {quizInfo.total_marks}
</p>



<input

type="file"

accept="application/pdf"

hidden

id={`quiz-${quiz._id}`}

onChange={(e)=>
uploadQuiz(
e,
quiz._id
)
}

/>



<button

disabled={submitted}

onClick={()=>{

document
.getElementById(
`quiz-${quiz._id}`
)
.click()

}}

className={`flex items-center gap-2 mt-6 px-4 py-2 rounded-lg ${
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

<>

<Upload size={18}/>

Quiz Submission

</>

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