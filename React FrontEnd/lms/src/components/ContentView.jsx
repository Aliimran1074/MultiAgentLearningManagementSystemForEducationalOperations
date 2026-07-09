import { BookOpen, FileText, Download } from 'lucide-react';

export default function ContentView({ courses = [] }) {

return (

<div className="space-y-6">

<div>
<h2 className="text-gray-900">
Course Content
</h2>

<p className="text-gray-600 mt-1">
Access all your course materials and resources
</p>

</div>


<div className="grid grid-cols-1 gap-6">


{
courses.length > 0

?

courses.map((course,index)=>(


<div
key={course.courseId || index}
className="bg-white rounded-lg shadow-sm border overflow-hidden"
>


<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">

<div className="flex items-center gap-3">

<BookOpen className="w-6 h-6 text-white"/>

<h3 className="text-white">
{course.courseName}
</h3>

</div>

</div>



<div className="p-6">


<div className="space-y-3">


{

course.content && course.content.length > 0

?

course.content.map((item,index)=>(


<div
key={item._id || index}
className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
>


<div className="flex items-center gap-3">


<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">

<FileText className="w-5 h-5 text-blue-600"/>

</div>



<div>

<p className="text-gray-900">

{item.contentTitle}

</p>


<p className="text-gray-600">

Course Material

</p>


</div>


</div>




<a

href={item.fileUrl}

target="_blank"

rel="noreferrer"

className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"

>

View

<Download className="w-4 h-4"/>

</a>



</div>


))


:


<p className="text-gray-600">
No content available
</p>


}



</div>


</div>



</div>


))


:


<div className="bg-white border rounded-lg p-6 text-gray-600 text-center">

No courses available

</div>


}



</div>


</div>

)

}