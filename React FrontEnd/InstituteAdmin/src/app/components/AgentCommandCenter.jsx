import { useEffect, useState } from "react";
import axios from "axios";

import {
  BookCheck,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText
} from "lucide-react";


export default function AgentCommandCenter({ instituteId })  {


const [data,setData] = useState(null);
const [loading,setLoading] = useState(true);





useEffect(()=>{


const fetchAgentData = async()=>{


try{


const response = await axios.get(
`https://univeristy-management-system.vercel.app/api/getAgentCommander/${instituteId}`
);


console.log(
"Agent Command Center Data:",
response.data
);


setData(response.data.data);



}
catch(error){


console.log(
"Agent Command Center Error:",
error
);


}
finally{

setLoading(false);

}


}



fetchAgentData();



},[]);



if(loading){

return <h2>Loading Agent Command Center...</h2>

}



return (

<div className="space-y-6">


{/* Header */}

<div>

<h2 className="text-2xl font-bold text-gray-900">
Agent Command Center
</h2>


<p className="text-sm text-gray-600">
Real time monitoring
</p>

</div>





<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">





{/* Assessment Agent */}


<div className="bg-white border rounded-lg p-6">


<div className="flex items-center gap-3 mb-6">


<div className="bg-blue-50 p-3 rounded-lg">

<BookCheck className="text-blue-600"/>

</div>


<div>

<h3 className="font-semibold text-lg">
Assessment Agent
</h3>

<p className="text-sm text-gray-500">
Quiz & Assignment Analysis
</p>


</div>


</div>




<div className="grid grid-cols-2 gap-5">



<div>

<p className="text-sm text-gray-500">
Total Assignments
</p>

<h3 className="text-3xl font-bold">

{data.assessment.totalAssignments}

</h3>


</div>





<div>

<p className="text-sm text-gray-500">
Total Quizzes
</p>

<h3 className="text-3xl font-bold">

{data.assessment.totalQuizzes}

</h3>


</div>





<div>

<p className="text-sm text-gray-500">
Students Evaluated
</p>

<h3 className="text-3xl font-bold">

{data.assessment.studentsEvaluated}

</h3>


</div>





<div>

<p className="text-sm text-gray-500">
Weak Students
</p>

<h3 className="text-3xl font-bold text-red-600">

{data.assessment.weakStudents}

</h3>


</div>



</div>


</div>









{/* Counselling Agent */}



<div className="bg-white border rounded-lg p-6">


<div className="flex items-center gap-3 mb-6">


<div className="bg-red-50 p-3 rounded-lg">

<MessageSquare className="text-red-600"/>

</div>



<div>

<h3 className="font-semibold text-lg">
Counselling Agent
</h3>


<p className="text-sm text-gray-500">
Student Intervention Monitoring
</p>


</div>


</div>





<div className="grid grid-cols-2 gap-5">





<div>


<div className="flex items-center gap-2">

<AlertTriangle 
className="w-4 text-red-500"
/>

<p className="text-sm text-gray-500">
Flagged Students
</p>

</div>


<h3 className="text-3xl font-bold">

{data.counselling.flaggedStudents}

</h3>


</div>








<div>


<div className="flex items-center gap-2">

<Clock 
className="w-4 text-yellow-500"
/>

<p className="text-sm text-gray-500">
Pending Requests
</p>

</div>


<h3 className="text-3xl font-bold">

{data.counselling.pendingRequests}

</h3>


</div>









<div>


<div className="flex items-center gap-2">

<FileText
className="w-4 text-blue-500"
/>

<p className="text-sm text-gray-500">
Scheduled Meetings
</p>

</div>


<h3 className="text-3xl font-bold">

{data.counselling.scheduledMeetings}

</h3>


</div>








<div>


<div className="flex items-center gap-2">

<CheckCircle
className="w-4 text-green-500"
/>


<p className="text-sm text-gray-500">
Completed Meetings
</p>


</div>


<h3 className="text-3xl font-bold">

{data.counselling.completedMeetings}

</h3>


</div>






</div>



</div>




</div>


</div>


)


}