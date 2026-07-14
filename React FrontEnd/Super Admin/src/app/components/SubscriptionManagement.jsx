import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import {
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react';



export function SubscriptionManagement() {


const [subscriptions,setSubscriptions] = useState([])
const [summary,setSummary] = useState([])



useEffect(()=>{

getSubscriptionManagement()

},[])




const getSubscriptionManagement = async()=>{

try{

const response = await fetch(
"http://localhost:4000/api/subscriptionManagement"
)


const data = await response.json()


if(data.success){

setSubscriptions(data.data.subscriptions)

setSummary(data.data.summary)

}


}
catch(error){

console.log(
"Error fetching subscription management",
error
)

}


}




const getSummaryCount=(status)=>{

const found = summary.find(
(item)=>item._id===status
)


return found ? found.count : 0

}




const getStatusColor=(status)=>{


switch(status){


case "Active":
return "bg-green-100 text-green-700"


case "Expired":
return "bg-red-100 text-red-700"


case "Cancelled":
return "bg-gray-100 text-gray-700"


default:
return "bg-yellow-100 text-yellow-700"


}


}





return (

<div className="space-y-6">



<div className="flex justify-between items-center">


<div>

<h2 className="text-2xl font-semibold">
Subscription Management
</h2>


<p className="text-gray-600">
Manage all institute subscriptions
</p>


</div>



<Button 
onClick={getSubscriptionManagement}
className="bg-blue-600"
>

<RefreshCw className="w-4 h-4 mr-2"/>

Refresh

</Button>



</div>





{/* SUMMARY */}


<div className="grid grid-cols-1 md:grid-cols-3 gap-6">


<Card>

<CardContent className="p-6">

<div className="flex gap-3 items-center">

<div className="bg-green-50 p-3 rounded">

<CheckCircle className="text-green-600"/>

</div>


<div>

<p className="text-gray-600">
Active
</p>


<h2 className="text-2xl font-bold">

{getSummaryCount("Active")}

</h2>


</div>


</div>

</CardContent>

</Card>





<Card>

<CardContent className="p-6">

<div className="flex gap-3 items-center">


<div className="bg-red-50 p-3 rounded">

<AlertCircle className="text-red-600"/>

</div>


<div>

<p className="text-gray-600">
Expired
</p>


<h2 className="text-2xl font-bold">

{getSummaryCount("Expired")}

</h2>


</div>


</div>


</CardContent>

</Card>





<Card>

<CardContent className="p-6">


<div className="flex gap-3 items-center">


<div className="bg-gray-50 p-3 rounded">

<Clock className="text-gray-600"/>

</div>


<div>

<p className="text-gray-600">
Cancelled
</p>


<h2 className="text-2xl font-bold">

{getSummaryCount("Cancelled")}

</h2>


</div>


</div>


</CardContent>

</Card>



</div>







{/* TABLE */}



<Card>


<CardHeader>

<CardTitle>
All Subscriptions
</CardTitle>

</CardHeader>



<CardContent>


<div className="overflow-x-auto">


<Table>


<TableHeader>


<TableRow>


<TableHead>
Institute
</TableHead>


<TableHead>
Plan
</TableHead>


<TableHead>
Type
</TableHead>


<TableHead>
Price
</TableHead>


<TableHead>
Period
</TableHead>


<TableHead>
Status
</TableHead>


<TableHead>
Remaining Days
</TableHead>



</TableRow>


</TableHeader>





<TableBody>


{
subscriptions.map((item)=>(


<TableRow key={item._id}>


<TableCell className="font-medium">

{item.instituteName}

</TableCell>




<TableCell>

<Badge variant="outline">

{item.plan}

</Badge>

</TableCell>





<TableCell>

{item.scopeType}

</TableCell>





<TableCell>

Rs. {item.price}

</TableCell>





<TableCell>


<p>

{
new Date(item.startDate)
.toLocaleDateString()

}

</p>


<p className="text-gray-500">

to

{
new Date(item.endDate)
.toLocaleDateString()

}

</p>


</TableCell>






<TableCell>


<Badge 
className={
getStatusColor(item.status)
}
>

{item.status}

</Badge>


</TableCell>







<TableCell>


<div className="flex items-center gap-2">


<Calendar className="w-4 h-4"/>


{
item.daysRemaining > 0

?

`${item.daysRemaining} days`

:

"Expired"

}


</div>


</TableCell>




</TableRow>


))

}



</TableBody>



</Table>


</div>


</CardContent>


</Card>



</div>

)

}