import React, { useEffect, useState } from "react";
import axios from "axios";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "./ui/card";

import {
  Building2,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";



export function DashboardOverview() {


const [dashboardData,setDashboardData] = useState(null);
const [loading,setLoading] = useState(true);


const colors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b"
];


// temporary
// future me super admin login se ayegi

useEffect(()=>{


const getDashboardOverview = async()=>{


try{


const response = await axios.get(
"http://localhost:4000/api/dashboardOverview"
);


console.log(
"Super Admin Dashboard:",
response.data
);


setDashboardData(
response.data.data
);


}
catch(error){


console.log(
"Dashboard Overview Error",
error
);


}
finally{

setLoading(false);

}


}



getDashboardOverview();


},[]);





if(loading){

return (

<div className="p-6">

<h2>
Loading Dashboard...
</h2>

</div>

)

}





if(!dashboardData){

return(

<div className="p-6">

<h2>
No Dashboard Data Found
</h2>

</div>

)

}






const stats=[

{
title:"Total Institutes",
value:dashboardData.totalInstitutes,
icon:Building2,
color:"text-blue-600",
bgColor:"bg-blue-50"
},


{
title:"Active Subscriptions",
value:dashboardData.activeSubscriptions,
icon:CheckCircle,
color:"text-green-600",
bgColor:"bg-green-50"
},


{
title:"Total Users",
value:dashboardData.totalUsers,
icon:Users,
color:"text-orange-600",
bgColor:"bg-orange-50"
}



];





return (

<div className="space-y-6">



{/* Header */}

<div>

<h2 className="text-2xl font-semibold text-gray-900">

Dashboard Overview

</h2>


<p className="text-gray-600 mt-1">

Welcome back! Here's your platform overview.

</p>


</div>






{/* Stats Cards */}


<div className="grid grid-cols-1 md:grid-cols-3 gap-6">


{
stats.map((stat,index)=>{


const Icon = stat.icon;


return(


<Card key={index}>


<CardContent className="p-6">


<div className="flex items-center justify-between">


<div>


<p className="text-sm text-gray-600">

{stat.title}

</p>


<p className="text-3xl font-semibold text-gray-900 mt-2">

{stat.value}

</p>


</div>



<div 
className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}
>


<Icon className="w-6 h-6"/>


</div>



</div>


</CardContent>


</Card>



)


})

}



</div>








{/* Subscription Distribution */}


<Card>


<CardHeader>

<CardTitle>

Subscription Distribution

</CardTitle>


</CardHeader>




<CardContent>


<div className="flex justify-center">


<ResponsiveContainer width="100%" height={300}>


<PieChart>


<Pie

data={
dashboardData.subscriptionDistribution
}

cx="50%"

cy="50%"

outerRadius={100}

dataKey="value"

label={({name,value})=>
`${name}: ${value}`
}


>


{

dashboardData.subscriptionDistribution.map(
(entry,index)=>(


<Cell

key={index}

fill={
colors[index % colors.length]
}

/>


)

)

}



</Pie>



<Tooltip />



</PieChart>


</ResponsiveContainer>


</div>


</CardContent>


</Card>







</div>


)


}