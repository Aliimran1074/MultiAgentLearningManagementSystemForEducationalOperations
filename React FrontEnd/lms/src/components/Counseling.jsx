import {
 CheckCircle2,
 AlertCircle,
 Calendar,
 Clock,
 User
} from "lucide-react";


export default function Counseling({
counsellingData=[],
grades=[]
}){


const totalPercentage = grades.length>0

?

grades.reduce(
(sum,item)=>
sum + ((item.marks/item.maxMarks)*100)
,0
)/grades.length

:

0;



const needsCounseling =
totalPercentage < 50;



const lowPerformance = grades.filter(
item =>
((item.marks/item.maxMarks)*100)<50
);



return(


<div className="max-w-4xl mx-auto space-y-6">





{
!needsCounseling && counsellingData.length===0

&&

<div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">


<CheckCircle2
className="w-10 h-10 text-green-600 mx-auto mb-3"
/>


<h2 className="text-xl font-semibold text-green-900">

Great Job!

</h2>


<p className="text-green-700 mt-2">

Your performance is above 50%. No counseling required.

</p>


</div>


}






{
needsCounseling &&


<div className="bg-red-50 border border-red-200 rounded-lg p-6">


<div className="flex gap-3">


<AlertCircle
className="text-red-600"
/>


<div>


<h2 className="font-semibold text-red-900">

Counseling Required

</h2>


<p className="text-red-700">

Your average score is {totalPercentage.toFixed(1)}%

</p>


</div>


</div>


</div>


}






{
lowPerformance.length>0 &&


<div className="bg-white border rounded-lg p-6">


<h3 className="font-semibold mb-4">

Subjects Needing Improvement

</h3>


<ul className="list-disc ml-5">


{

lowPerformance.map((item,index)=>(


<li key={index}>

Assessment {index+1}

-
Marks {item.marks}/{item.maxMarks}

</li>


))

}



</ul>


</div>


}








<div className="bg-white border rounded-lg p-6">


<h3 className="text-lg font-semibold mb-4">

Counseling Requests

</h3>




{

counsellingData.length===0


?


<p className="text-gray-600">

No counseling request available

</p>


:


<div className="space-y-4">


{

counsellingData.map((item)=>(


<div

key={item._id}

className="border rounded-lg p-4"

>


<div className="flex items-center gap-2">

<User
className="w-5 h-5 text-gray-600"
/>


<p>

Teacher ID:
{item.teacherId}

</p>


</div>





<div className="flex items-center gap-2 mt-3">


<Calendar
className="w-5 h-5 text-gray-600"
/>


<p>

Course ID:
{item.courseId}

</p>


</div>






<div className="flex items-center gap-2 mt-3">


<Clock
className="w-5 h-5 text-gray-600"
/>


<p>

Status:

<span
className={

item.status==="accepted"

?

"text-green-600 ml-2"

:

item.status==="rejected"

?

"text-red-600 ml-2"

:

"text-yellow-600 ml-2"

}

>

{item.status}

</span>


</p>


</div>




<p className="mt-3 text-gray-600">

Reason:

{item.reason}

</p>



</div>


))


}


</div>


}



</div>





</div>


)

}