import { useState, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Calendar,
  Clock,
  Check,
  X,
  Search,
  MoreVertical,
  CheckCircle2
} from "lucide-react";


export default function AppointmentManager({ teacherData }) {


  const [appointments, setAppointments] = useState(
    teacherData?.appointments || []
  );


  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");



  const filteredAppointments = useMemo(() => {

    return appointments.filter((appt)=>{

      const studentName =
        appt.student?.name?.toLowerCase() || "";

      return (
        appt.status === selectedTab &&
        studentName.includes(searchQuery.toLowerCase())
      );

    });

  },[
    appointments,
    selectedTab,
    searchQuery
  ]);




  const handleAccept = async(id)=>{

    try {

      await axios.post(
        "http://localhost:4000/api/acceptAppointment",
        {
          appointmentId:id
        }
      );


      setAppointments(prev=>
        prev.map(app=>
          app._id===id
          ?
          {
            ...app,
            status:"accepted"
          }
          :
          app
        )
      );


    } catch(error){

      console.log(
        "Accept Error",
        error
      );

    }

  };




  const handleReject = async(id)=>{


    try {

      await axios.post(
        "http://localhost:4000/api/rejectAppointment",
        {
          appointmentId:id,
          remarks:"Teacher rejected appointment"
        }
      );


      setAppointments(prev=>
        prev.map(app=>
          app._id===id
          ?
          {
            ...app,
            status:"rejected"
          }
          :
          app
        )
      );


    }catch(error){

      console.log(
        "Reject Error",
        error
      );

    }

  };




  return (

<div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">


<div>

<h1 className="text-2xl font-black text-gray-900">
Appointments
</h1>

<p className="text-gray-500">
Manage your student sessions and requests
</p>

</div>



<div className="space-y-4">


<div className="relative">

<Search 
className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
/>


<input

type="text"

placeholder="Search by student name..."

className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"

value={searchQuery}

onChange={(e)=>setSearchQuery(e.target.value)}

/>


</div>



<div className="flex gap-2 overflow-x-auto pb-2">


{
[
"pending",
"accepted",
"completed",
"rejected"
].map(tab=>(


<button

key={tab}

onClick={()=>setSelectedTab(tab)}

className={`
px-5 py-2 rounded-full text-sm font-bold capitalize

${
selectedTab===tab
?
"bg-blue-600 text-white"
:
"text-gray-500 hover:bg-gray-100"
}

`}

>

{tab}

(
{
appointments.filter(
a=>a.status===tab
).length
}
)

</button>


))
}


</div>


</div>




<div className="grid grid-cols-1 gap-4">


{
filteredAppointments.length >0

?

filteredAppointments.map((appt)=>(


<AppointmentCard

key={appt._id}

appt={appt}

onAccept={handleAccept}

onReject={handleReject}

/>


))


:

<div className="text-center py-20 bg-gray-50 rounded-3xl">

<p className="text-gray-500">
No {selectedTab} appointments found
</p>

</div>


}



</div>


</div>

  );

}







function AppointmentCard({
appt,
onAccept,
onReject
}){


return (

<Card className="overflow-hidden border-none shadow-sm rounded-3xl">


<CardContent className="p-0">


<div className="flex">


<div

className={`
w-2

${
appt.status==="pending"
?
"bg-orange-400"
:
appt.status==="accepted"
?
"bg-green-500"
:
"bg-gray-300"
}

`}

/>



<div className="p-5 flex-1 space-y-4">



<div className="flex justify-between">


<div className="flex gap-3">


<div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold">

{
appt.student?.name?.charAt(0)
}

</div>



<div>


<h3 className="font-bold text-lg">

{
appt.student?.name
}

</h3>



<div className="flex gap-2 mt-1">


<Badge>

Class {appt.course?.class}

</Badge>


<Badge>

{
appt.course?.name
}

</Badge>


</div>



</div>


</div>



<MoreVertical className="text-gray-400"/>


</div>






<div className="grid sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl">


<div className="flex gap-2">

<Calendar className="w-4 h-4 text-blue-500"/>

{
new Date(
appt.appointmentDate
).toLocaleDateString()
}

</div>



<div className="flex gap-2">

<Clock className="w-4 h-4 text-blue-500"/>

{
appt.startTime
}
-
{
appt.endTime
}

</div>



</div>





<p className="text-gray-500 italic">

"{appt.reason}"

</p>





<div className="flex gap-2">


{
appt.status==="pending" &&

<>

<button

onClick={()=>onAccept(appt._id)}

className="flex-1 bg-blue-600 text-white py-2 rounded-xl"

>

<Check className="inline w-4 h-4"/>

Approve

</button>



<button

onClick={()=>onReject(appt._id)}

className="flex-1 bg-gray-100 py-2 rounded-xl"

>

<X className="inline w-4 h-4"/>

Reject

</button>

</>

}





{
appt.status==="accepted" &&

<button className="w-full bg-green-50 text-green-700 py-2 rounded-xl">

<CheckCircle2 className="inline w-4 h-4"/>

Meeting Confirmed

</button>

}



{
appt.status==="completed" &&

<button className="w-full bg-gray-100 py-2 rounded-xl">

Completed

</button>

}



</div>




</div>


</div>


</CardContent>


</Card>


)

}