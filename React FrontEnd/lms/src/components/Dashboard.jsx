import {
  ClipboardList,
  Award,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({ studentData }) {

const courses = studentData?.courses || [];


const submittedAssignments = courses.flatMap(
  course => course?.submittedAssignments || []
);


const submittedQuizzes = courses.flatMap(
  course => course?.submittedQuizzes || []
);



const allSubmitted = [

...submittedAssignments.map(item=>({
  ...item,
  type:"Assignment"
})),

...submittedQuizzes.map(item=>({
  ...item,
  type:"Quiz"
}))

];



const totalAssessments = allSubmitted.length;



const passingGrades = allSubmitted.filter(
item =>
(item.marks || 0) >= ((item.maxMarks || 0) / 2)
).length;



const failingGrades = allSubmitted.filter(
item =>
(item.marks || 0) < ((item.maxMarks || 0) / 2)
).length;



const averagePercentage =
allSubmitted.length > 0

?

allSubmitted.reduce(

(sum,item)=>

sum + (((item.marks || 0)/(item.maxMarks || 1))*100)

,0

) / allSubmitted.length

:

0;



return (

<div className="space-y-6">


<div className="grid grid-cols-1 md:grid-cols-4 gap-6">



<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Average Score
</p>


<p className={`text-2xl mt-2 ${
averagePercentage >= 50
?
"text-green-600"
:
"text-red-600"
}`}>

{averagePercentage.toFixed(1)}%

</p>


{
averagePercentage >= 50

?

<TrendingUp className="text-green-600 w-8 h-8 mt-3"/>

:

<TrendingDown className="text-red-600 w-8 h-8 mt-3"/>

}


</div>




<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Total Assessments
</p>


<p className="text-2xl mt-2">
{totalAssessments}
</p>


<ClipboardList className="text-blue-600 w-8 h-8 mt-3"/>


</div>





<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Passing Grades
</p>


<p className="text-2xl text-green-600 mt-2">
{passingGrades}
</p>


<Award className="text-green-600 w-8 h-8 mt-3"/>


</div>





<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Need Improvement
</p>


<p className="text-2xl text-red-600 mt-2">
{failingGrades}
</p>


<AlertCircle className="text-red-600 w-8 h-8 mt-3"/>


</div>



</div>





<div>

<h2 className="text-xl mb-4">
Recent Assessments
</h2>



<div className="bg-white border rounded-lg overflow-hidden">


{
allSubmitted.length > 0

?

<table className="w-full">


<thead className="bg-gray-50">

<tr>

<th className="px-6 py-3 text-left">
Type
</th>

<th className="px-6 py-3 text-left">
Marks
</th>

<th className="px-6 py-3 text-left">
Status
</th>

</tr>

</thead>



<tbody>


{
allSubmitted.map((item,index)=>(


<tr
key={item._id || index}
className="border-t"
>


<td className="px-6 py-4">

{item.type}

</td>



<td className="px-6 py-4">

{item.marks || 0}/{item.maxMarks || 0}

</td>




<td className="px-6 py-4">


{
(item.marks || 0) >= ((item.maxMarks || 0)/2)

?

<span className="text-green-600">
Pass
</span>

:

<span className="text-red-600">
Need Improvement
</span>

}


</td>



</tr>


))

}



</tbody>



</table>


:

<div className="p-6 text-gray-600 text-center">

No assessment submitted yet

</div>


}


</div>


</div>



</div>

)

} 