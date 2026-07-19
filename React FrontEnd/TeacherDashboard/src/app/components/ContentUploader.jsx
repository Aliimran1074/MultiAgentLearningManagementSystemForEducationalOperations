import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "./ui/card";

import {
  Upload,
  FileText,
  Download,
  Trash2,
  X
} from "lucide-react";

import { Badge } from "./ui/badge";


export default function ContentUploader({teacherData}) {


const teacherId = import.meta.env.VITE_TEACHER_ID;



const [courseContent,setCourseContent] = useState([]);

const [showUploadModal,setShowUploadModal] = useState(false);


const [selectedFile,setSelectedFile] = useState(null);


const [newContent,setNewContent] = useState({

    contentTitle:"",
    courseId:"",
    instituteId:""

});




// ================================
// FETCH CONTENT
// ================================


const fetchContent = async()=>{

try{


const res = await fetch(
`https://univeristy-management-system.vercel.app/api/teacherCourseContent/${teacherId}`
);


const data = await res.json();


console.log("CONTENT DATA",data);


setCourseContent(data);



}
catch(error){

console.log(
"Content Fetch Error",
error
)

}


}




useEffect(()=>{

if(teacherId)
fetchContent();


},[teacherId]);






// ================================
// UPLOAD CONTENT
// ================================


const handleUpload = async()=>{


try{


const formData = new FormData();


formData.append(
"contentTitle",
newContent.contentTitle
);


formData.append(
"courseId",
newContent.courseId
);


formData.append(
"instituteId",
newContent.instituteId
);


formData.append(
"pdf",
selectedFile
);



const res = await fetch(

"https://univeristy-management-system.vercel.app/api/uploadManualContent",

{
method:"POST",
body:formData
}

);



const data = await res.json();



console.log(
"UPLOAD RESPONSE",
data
);



if(res.ok){

alert(
"Content Uploaded Successfully"
);


setShowUploadModal(false);


setNewContent({
contentTitle:"",
courseId:"",
instituteId:""
});


setSelectedFile(null);


fetchContent();

}


}
catch(error){

console.log(
"Upload Error",
error
)

}


}







// ================================
// DELETE CONTENT
// ================================


const handleDelete = async(id)=>{


try{


const res = await fetch(

"https://univeristy-management-system.vercel.app/api/deleteCourseContent",

{
method:"DELETE",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

id:id

})

}

);


const data = await res.json();


console.log(
"DELETE RESPONSE",
data
);



if(res.ok){

fetchContent();

}


}
catch(error){

console.log(
"Delete Error",
error
)

}


}







return (

<div className="max-w-7xl mx-auto p-6 space-y-6">



<Card>


<CardHeader>

<div className="flex justify-between items-center">


<div>

<CardTitle>
Content Library
</CardTitle>


<CardDescription>
Manage PDF course material
</CardDescription>


</div>



<button

onClick={()=>setShowUploadModal(true)}

className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
flex
gap-2
items-center
"

>

<Upload size={18}/>

Upload PDF

</button>


</div>


</CardHeader>


</Card>







{
courseContent.map(course=>(


<div
key={course.courseId}
className="space-y-4"
>


<h2 className="
text-xl
font-black
">

{course.courseName}

</h2>





<div className="
grid
grid-cols-1
md:grid-cols-3
gap-4
">



{
course.contents.length===0

?

<p className="text-gray-400">
No Content Available
</p>


:

course.contents.map(content=>(


<Card key={content._id}>


<CardContent className="p-5 space-y-4">



<div className="
flex
justify-between
">


<div className="
p-3
bg-red-100
text-red-600
rounded-xl
">

<FileText/>

</div>


<button

onClick={()=>handleDelete(content._id)}

>

<Trash2
className="text-red-500"
/>

</button>



</div>





<h3 className="font-bold">

{content.contentTitle}

</h3>





<Badge>

{course.courseName}

</Badge>





<div className="
flex
gap-2
">


<button

onClick={()=>window.open(
content.fileUrl,
"_blank"
)}

className="
flex-1
bg-blue-50
text-blue-600
py-2
rounded-xl
flex
justify-center
gap-2
"

>


<Download size={16}/>

View PDF


</button>



</div>






</CardContent>


</Card>


))


}




</div>



</div>


))


}









{/* UPLOAD MODAL */}



{
showUploadModal &&

<div className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
">


<Card className="w-full max-w-lg">


<CardHeader className="
flex
justify-between
flex-row
">


<CardTitle>
Upload PDF
</CardTitle>


<button
onClick={()=>setShowUploadModal(false)}
>

<X/>

</button>


</CardHeader>





<CardContent className="space-y-4">



<input

placeholder="Content Title"

className="w-full border p-3 rounded-xl"

value={newContent.contentTitle}

onChange={
e=>setNewContent({
...newContent,
contentTitle:e.target.value
})
}

/>






<select

className="w-full border p-3 rounded-xl"

onChange={(e)=>{

setNewContent({

...newContent,

courseId:e.target.value,

instituteId:teacherData.teacher.instituteId

})

}}

>

<option>
Select Course
</option>


{
teacherData.courses.map((item)=>(

<option

key={item.course._id}

value={item.course._id}

>

{item.course.name}

</option>

))

}


</select>

<input type="file" accept="application/pdf" onChange={e=>setSelectedFile(e.target.files[0])}/>

<button
onClick={handleUpload}
className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-bold"
>
Upload
</button>

</CardContent>

</Card>

</div>


}



</div>


)

}