import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Bot,
  RefreshCw
} from "lucide-react";


import {
 BarChart,
 Bar,
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer
} from "recharts";



export function ReportSection(){


const [reports,setReports] = useState([]);

const [loading,setLoading] = useState(false);



useEffect(()=>{

fetchReports();

},[])



const fetchReports = async()=>{


try{

setLoading(true);


const response = await fetch(
"http://localhost:4000/api/getSuperAdminReport"
)


const data = await response.json()


if(data.success){

setReports(data.data);

}


}
catch(error){

console.log(
"Report Fetch Error",
error
)

}
finally{

setLoading(false);

}


}




const latestReport =
reports.length > 0 
?
reports[reports.length-1]
:
null;




const chartData = reports.map((item)=>({


month:
new Date(
2026,
item.month-1
)
.toLocaleString(
"default",
{
month:"short"
}
),


revenue:item.totalRevenue,


students:item.totalStudents



}))





return (

<div className="p-6 space-y-6">



{/* HEADER */}

<div className="flex justify-between items-center">


<div>

<h2 className="text-2xl font-bold">
Reports & Analytics
</h2>


<p className="text-gray-500">
Auto generated monthly reports
</p>


</div>



<Button
onClick={fetchReports}
>

<RefreshCw className="w-4 h-4 mr-2"/>

Refresh

</Button>



</div>





{
loading &&
<p>
Loading reports...
</p>
}





{
latestReport &&

<>



{/* KPI CARDS */}


<div className="grid grid-cols-1 md:grid-cols-4 gap-5">


<StatCard

icon={<DollarSign/>}

title="Revenue"

value={
`Rs ${latestReport.totalRevenue}`
}

/>



<StatCard

icon={<Building2/>}

title="Institutes"

value={
latestReport.totalInstitutes
}

/>



<StatCard

icon={<Users/>}

title="Students"

value={
latestReport.totalStudents
}

/>



<StatCard

icon={<Bot/>}

title="AI Requests"

value={
latestReport.aiUsage
?.totalAiRequests || 0
}

/>



</div>





{/* CHARTS */}


<div className="grid md:grid-cols-2 gap-6">


<Card>

<CardHeader>

<CardTitle>
Revenue Growth
</CardTitle>

</CardHeader>


<CardContent>


<ResponsiveContainer
width="100%"
height={300}
>


<BarChart data={chartData}>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="month"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="revenue"
/>


</BarChart>


</ResponsiveContainer>



</CardContent>


</Card>







<Card>


<CardHeader>

<CardTitle>
Student Growth
</CardTitle>

</CardHeader>


<CardContent>


<ResponsiveContainer
width="100%"
height={300}
>


<LineChart
data={chartData}
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="month"
/>


<YAxis/>


<Tooltip/>


<Line

dataKey="students"

/>


</LineChart>



</ResponsiveContainer>


</CardContent>


</Card>




</div>







{/* REPORT LIST */}



<Card>


<CardHeader>

<CardTitle>

<FileText className="inline mr-2"/>

Generated Reports

</CardTitle>

</CardHeader>



<CardContent
className="space-y-4"
>



{

reports.map((report)=>(



<div

key={report._id}

className="border rounded-lg p-5 flex justify-between items-center"

>



<div>


<h3 className="font-semibold">


{
new Date(
2026,
report.month-1
)
.toLocaleString(
"default",
{
month:"long"
}
)
}

{" "}

{report.year}


</h3>



<p className="text-sm text-gray-500">


<Calendar className="inline w-4 h-4 mr-1"/>


Generated Report


</p>




<div className="flex gap-2 mt-3">


<Badge>

Active Institutes:

{report.activeInstitutes}


</Badge>


<Badge>

New:

{report.newInstitutesThisMonth}


</Badge>


<Badge>

AI:

{report.aiUsage.totalAiRequests}

</Badge>



</div>



</div>




{

report.reportPdf &&


<Button

onClick={()=>window.open(
report.reportPdf,
"_blank"
)}

>


<Download className="w-4 h-4 mr-2"/>

PDF


</Button>


}




</div>


))


}





</CardContent>


</Card>



</>


}





</div>


)

}





function StatCard({
icon,
title,
value
}){


return (

<Card>


<CardContent className="p-5 flex gap-4 items-center">


<div className="bg-blue-50 text-blue-600 p-3 rounded">

{icon}

</div>



<div>


<p className="text-gray-500 text-sm">

{title}

</p>


<h2 className="text-2xl font-bold">

{value}

</h2>


</div>


</CardContent>


</Card>


)


}