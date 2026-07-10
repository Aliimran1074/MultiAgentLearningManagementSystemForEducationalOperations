import { useState, useEffect } from 'react';
import axios from 'axios';

import { 
  Bell, 
  AlertCircle, 
  Activity, 
  Menu,
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Bot
} from 'lucide-react';


import AgentCommandCenter from './components/AgentCommandCenter';
import MasterContentLibrary from './components/MasterContentLibrary';
import StudentProgress from './components/StudentProgress';
import FacultyDirectory from './components/FacultyDirectory';



export default function App() {


  const [activeView,setActiveView] = useState("dashboard");

  const [selectedSession,setSelectedSession] = 
  useState("Session A 2025");


  const [sidebarOpen,setSidebarOpen] =
  useState(true);


  const [dashboardData,setDashboardData] =
  useState(null);


  const [loading,setLoading] =
  useState(true);



  // temporary institute id
  // later login response se ayegi

  const instituteId =
  "6a02e3cf54202521c3af340e";




  useEffect(()=>{


    const fetchDashboard = async()=>{


      try{


        const response = await axios.get(
          `http://localhost:4000/api/instituteDashboard/${instituteId}`
        );


        console.log(
          "Institute Dashboard Data",
          response.data
        );


        setDashboardData(
          response.data.data
        );


      }
      catch(error){


        console.log(
          "Dashboard API Error",
          error
        );


      }
      finally{

        setLoading(false);

      }


    };



    fetchDashboard();



  },[]);





  if(loading){

    return(

      <div className="h-screen flex items-center justify-center">

        Loading Dashboard...

      </div>

    )

  }





  const navItems=[

    {
      id:"dashboard",
      label:"Dashboard",
      icon:LayoutDashboard
    },


    {
      id:"master-content",
      label:"Master Content",
      icon:BookOpen
    },


    {
      id:"faculty",
      label:"Faculty Directory",
      icon:Users
    },


    {
      id:"students",
      label:"Student Data",
      icon:GraduationCap
    },


    {
      id:"agents",
      label:"Agent Operations",
      icon:Bot
    }


  ];






return(


<div className="min-h-screen bg-gray-50 flex">



{/* Sidebar */}

<aside className="w-64 bg-white border-r">


<div className="p-6 flex items-center gap-3">


<div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">

<Activity className="text-white"/>

</div>


<div>

<h2 className="font-bold">
MIT LMS
</h2>

<p className="text-xs text-gray-500">
Admin Portal
</p>

</div>


</div>





<nav className="p-4">


{
navItems.map(item=>{


const Icon=item.icon;


return(

<button

key={item.id}

onClick={()=>setActiveView(item.id)}

className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 ${
activeView===item.id
?"bg-blue-100 text-blue-700"
:"hover:bg-gray-100"
}`}


>


<Icon size={20}/>


{item.label}


</button>


)


})

}



</nav>



</aside>








{/* Main */}


<div className="flex-1">





<header className="bg-white border-b p-4 flex justify-between">


<div className="flex items-center gap-4">


<button>

<Menu/>

</button>



<select

value={selectedSession}

onChange={(e)=>
setSelectedSession(e.target.value)
}

className="border rounded p-2"

>


<option>
Session A 2025
</option>


<option>
Batch B 2025
</option>


</select>




<h1 className="font-bold">

Massachusetts Institute of Technology

</h1>


</div>





<div className="flex gap-3 items-center">


<div className="bg-red-50 border border-red-400 p-2 rounded flex gap-2">


<AlertCircle className="text-red-600"/>


<span className="text-red-600">

{
dashboardData?.students?.total || 0
}
 Students

</span>


</div>



<Bell/>


</div>



</header>










<main className="p-6">



{
activeView==="dashboard" &&

<AgentCommandCenter

selectedSession={selectedSession}

dashboardData={dashboardData}

/>

}






{
activeView==="agents" &&

<AgentCommandCenter

selectedSession={selectedSession}

dashboardData={dashboardData}

/>

}





{
activeView==="master-content" &&

<MasterContentLibrary

selectedSession={selectedSession}

/>

}






{
activeView==="faculty" &&

<FacultyDirectory

selectedSession={selectedSession}

dashboardData={dashboardData}

/>

}





{
activeView==="students" &&

<StudentProgress

selectedSession={selectedSession}

dashboardData={dashboardData}

/>

}




</main>



</div>



</div>


)


}