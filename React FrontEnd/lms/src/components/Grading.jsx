import {
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';


export default function Grading({grades=[]}){


const totalPercentage = grades.length > 0

?
grades.reduce(
(sum,item)=>
sum + ((item.marks/item.maxMarks)*100)
,0
) / grades.length

:

0;



const passed = grades.filter(
item =>
(item.marks/item.maxMarks)*100 >=50
).length;



const failed = grades.filter(
item =>
(item.marks/item.maxMarks)*100 <50
).length;



return(

<div className="space-y-6">



<div>

<h2 className="text-gray-900">
Your Grades
</h2>

<p className="text-gray-600 mt-1">
Track your academic performance
</p>

</div>





<div className="grid grid-cols-1 md:grid-cols-3 gap-6">



<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Average Score
</p>

<h2 className={`text-3xl mt-2 ${
totalPercentage>=50
?
"text-green-600"
:
"text-red-600"
}`}>

{totalPercentage.toFixed(1)}%

</h2>

</div>




<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Passing Assessments
</p>

<h2 className="text-3xl text-green-600 mt-2">

{passed}

</h2>

<Award className="text-green-600 mt-3"/>

</div>





<div className="bg-white border rounded-lg p-6">

<p className="text-gray-600">
Need Improvement
</p>

<h2 className="text-3xl text-red-600 mt-2">

{failed}

</h2>

<TrendingDown className="text-red-600 mt-3"/>

</div>



</div>






<div className="bg-white border rounded-lg p-6">


<div className="flex gap-2 items-center mb-5">

<BarChart3 className="text-blue-600"/>

<h3>
All Assessments
</h3>

</div>




{

grades.length===0

?

<p className="text-gray-600">
No assessment submitted yet
</p>


:

<table className="w-full">


<thead className="bg-gray-50">

<tr>

<th className="px-4 py-3 text-left">
#
</th>

<th className="px-4 py-3 text-left">
Type
</th>


<th className="px-4 py-3 text-left">
Marks
</th>


<th className="px-4 py-3 text-left">
Percentage
</th>


<th className="px-4 py-3 text-left">
Status
</th>


</tr>


</thead>



<tbody>


{

grades.map((item,index)=>{


const percentage =
(item.marks/item.maxMarks)*100;



return(


<tr
key={item._id}
className="border-t"
>


<td className="px-4 py-3">
{index+1}
</td>



<td className="px-4 py-3">

{

item.assignmentId

?

"Assignment"

:

"Quiz"

}

</td>




<td className="px-4 py-3">

{item.marks}/{item.maxMarks}

</td>



<td className="px-4 py-3">


<span
className={
percentage>=50
?
"text-green-600"
:
"text-red-600"
}
>

{percentage.toFixed(1)}%

</span>


</td>



<td className="px-4 py-3">


{

percentage>=50

?

<span className="text-green-600 flex items-center gap-1">

<TrendingUp size={16}/>

Pass

</span>


:

<span className="text-red-600 flex items-center gap-1">

<TrendingDown size={16}/>

Fail

</span>


}


</td>



</tr>


)


})


}



</tbody>



</table>


}



</div>




</div>


)

}