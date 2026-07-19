import React, { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  Search,
  Shield,
  Mail,
  Phone,
  Eye,
  Ban,
  CheckCircle,
  Users,
} from "lucide-react";


export function UserManagement() {


const [users,setUsers] = useState([]);
const [dashboard,setDashboard] = useState({
    totalUsers:0,
    activeInstitutes:0,
    suspendedInstitutes:0,
    totalInstitutes:0,
    totalStaff:0,
    totalStudents:0
});

const [loading,setLoading] = useState(true);

const [searchQuery,setSearchQuery] = useState("");
const [filterRole,setFilterRole] = useState("all");


 useEffect(()=>{

const fetchUsers = async()=>{

try{

setLoading(true);

const response = await axios.get(
"https://univeristy-management-system.vercel.app/api/user-management"
);


console.log(response.data);


setUsers(response.data.institutes || []);

setDashboard(response.data.dashboard || {});


}
catch(error){

console.log(
"User Management Error:",
error.message
);

}
finally{

setLoading(false);

}

}


fetchUsers();


},[]);



  const getStatusColor=(status)=>{

    switch(status){

      case "Active":
        return "bg-green-100 text-green-700";

      case "Suspended":
        return "bg-red-100 text-red-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  }



  const getRoleBadgeColor=(role)=>{

    switch(role){

      case "Institute Admin":
        return "bg-blue-100 text-blue-700";

      case "Batch Manager":
        return "bg-purple-100 text-purple-700";


      case "Class Teacher":
        return "bg-orange-100 text-orange-700";


      default:
        return "bg-gray-100 text-gray-700";

    }

  }



const filteredUsers = users.filter((user)=>{

const matchesSearch =
user.instituteName
?.toLowerCase()
.includes(searchQuery.toLowerCase())
||
user.contactNo?.includes(searchQuery);


return matchesSearch;


});

  return (

<div className="space-y-6">


{/* Header */}

<div>

<h2 className="text-2xl font-semibold text-gray-900">
User Management
</h2>

<p className="text-gray-600">
Manage all users across institutes
</p>

</div>



{/* Stats */}


<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

<StatCard
icon={<Users/>}
title="Total Users"
value={dashboard.totalUsers}
/>


<StatCard
icon={<CheckCircle/>}
title="Active Institutes"
value={dashboard.activeInstitutes}
/>


<StatCard
icon={<Shield/>}
title="Total Staff"
value={dashboard.totalStaff}
/>


<StatCard
icon={<Ban/>}
title="Total Students"
value={dashboard.totalStudents}
/>

</div>





<Card>


<CardHeader>


<div className="flex flex-col md:flex-row gap-4">


<div className="flex-1 relative">


<Search className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>


<Input

placeholder="Search users..."

className="pl-10"

value={searchQuery}

onChange={(e)=>setSearchQuery(e.target.value)}

/>


</div>



<Select
value={filterRole}
onValueChange={setFilterRole}
>


<SelectTrigger className="w-[200px]">

<SelectValue placeholder="Role"/>

</SelectTrigger>


<SelectContent>

<SelectItem value="all">
All Roles
</SelectItem>


<SelectItem value="Institute Admin">
Institute Admin
</SelectItem>


<SelectItem value="Batch Manager">
Batch Manager
</SelectItem>


<SelectItem value="Class Teacher">
Class Teacher
</SelectItem>


</SelectContent>


</Select>



</div>


</CardHeader>






<CardContent>


{
loading ?

<p className="text-center">
Loading Users...
</p>


:

<div className="overflow-x-auto">


<Table>


<TableHeader>

<TableRow>

<TableHead>
User
</TableHead>


<TableHead>
Contact
</TableHead>


<TableHead>
Institute
</TableHead>


<TableHead>
Role
</TableHead>


<TableHead>
Status
</TableHead>


<TableHead>
Actions
</TableHead>


</TableRow>

</TableHeader>




<TableBody>



{

filteredUsers.map((user)=>(


<TableRow key={user._id}>


<TableCell>


<div className="flex items-center gap-3">


<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">


{
user.instituteName?.charAt(0)
}


</div>


<div>

<p className="font-medium">
{user.instituteName}
</p>


<p className="text-sm text-gray-500">

ID: {user._id}

</p>


</div>


</div>


</TableCell>





<TableCell>


<div>

<div className="flex gap-2">

<Mail size={15}/>

{user.email || "-"}

</div>



<div className="flex gap-2 mt-1 text-gray-500">

<Phone size={15}/>

{user.contactNo || user.mobileNo || "-"}

</div>


</div>


</TableCell>






<TableCell>

{
user.address || "-"
}

</TableCell>





<TableCell>


<Badge className="bg-blue-100 text-blue-700">
Institute
</Badge>


</TableCell>




<TableCell>


<Badge className="bg-green-100 text-green-700">
Active
</Badge>

</TableCell>






<TableCell>


<div className="flex gap-2">


<Button
variant="ghost"
size="sm"
>

<Eye size={16}/>

</Button>



<Button
variant="ghost"
size="sm"
className="text-red-600"
>


<Ban size={16}/>


</Button>


</div>


</TableCell>



</TableRow>


))


}



</TableBody>



</Table>


</div>


}


</CardContent>


</Card>



</div>

  );

}





function StatCard({icon,title,value}){


return (

<Card>

<CardContent className="p-6">


<div className="flex items-center gap-3">


<div className="bg-blue-50 text-blue-600 p-3 rounded-lg">

{icon}

</div>



<div>

<p className="text-sm text-gray-600">

{title}

</p>


<p className="text-2xl font-semibold">

{value}

</p>


</div>


</div>


</CardContent>


</Card>

)


}