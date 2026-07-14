import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search, Download, Eye, Edit, Trash2, Plus, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';




export function InstituteList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [instituteArray, setInstituteArray] = useState([])
  const [subscriptionPlanArray, setSubscriptionPlanArray] = useState([])
  const [instituteName, setInstituteName ] = useState('')
  const [instituteAddress, setInstituteAddress] = useState('')
  const [instituteContact, setInstituteContact] = useState('')
  const [subscriptionId, setSubscriptionId] = useState('')
  const[open,setOpen]=useState(false)
  // Placeholder data - ensure this matches your actual data structure
  const institutes = [
    {
      id: 1,
      name: "Cambridge Institute",
      email: "admin@cambridge.edu",
      subscriptionType: "Complete Institute",
      status: "Active",
      currentUsers: 850,
      userLimit: 1000,
      contact: "012231"
    },
    {
      id: 2,
      name: "Tech Academy",
      email: "contact@techacademy.io",
      subscriptionType: "Batch",
      status: "Expiring Soon",
      currentUsers: 180,
      userLimit: 200,
      contact: "0000"
    }
  ]


  useEffect(() => {
    detailsOfAllSubscriptionPlans()
    getInfoOfAvailableInstitutes()
  }, [])

  const detailsOfAllSubscriptionPlans = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/getAllSubscriptionPlanDetails")
      const data = await response.json()
      if (!response.ok) {
        console.log("Server error while fetching all plan details")
        return
      }
      // console.log("data is :",data)
      const finalData = data.checkAllPlanInfo
      console.log("Final data is :", finalData)
      const finalArray = finalData.map(item => ({
        id: item._id,
        name: item.subscriptionName
      }))
      setSubscriptionPlanArray(finalArray)
      console.log("Final Array :", finalArray)
    }
    catch (error) {
      console.log("Error in Fetching all subscription Details", error)
    }
  }

  const getInfoOfAvailableInstitutes = async () => {
    try {
      const gettingInfoOfInstituteFromServer = await fetch("http://localhost:4000/api/allInstituteInfo")
      const data = await gettingInfoOfInstituteFromServer.json()
      if (!gettingInfoOfInstituteFromServer.ok) {
        console.log("Server error while fetching institutes")
        return
      }
      const finalData = data.data
      console.log("Institutes Info:", finalData)
      !Array.isArray(finalData) ? console.log('This is not an array') :
        setInstituteArray(finalData)
    } catch (error) {
      console.log("Issue in Getting Info From Server", error)
    }
  }
  
  const createNewInstitute=async()=>{
    try {
      console.log(instituteName)
      console.log(instituteAddress)
      console.log(instituteContact)
      console.log(subscriptionId)
      if(instituteName==''||instituteAddress==''||subscriptionId==''){
        console.log('Please Fill all the Required Fields')
      }
      else if(instituteContact.length!=11){
        console.log("Please Write contact no consist of 11 numbers")
      }
      else{
      const response = await fetch("http://localhost:4000/api/instituteCreation",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({instituteName:instituteName,address:instituteAddress,contactNo:instituteContact,subscriptionPlanId:subscriptionId})
      })
      const data = await response.json()
      const message= data.message
      if(message=="Institute Created and Subscription Done Succesfully"){
        console.log("Institute Creation Successfully")
        setInstituteName('')
        setInstituteContact('')
        setInstituteAddress('')
        setSubscriptionId('')
        setOpen(false)
        await getInfoOfAvailableInstitutes()
      }
      console.log("Data is :",data)
      
      }
    } catch (error) {
      console.log("Error in Institute Creation Function",error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Inactive': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  const filteredInstitutes = instituteArray.filter((institute) => {
    const matchesSearch =
      institute.name.toLowerCase().includes(searchQuery.toLowerCase())
    // institute.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || institute.scopeType === filterType;
    const matchesStatus = filterStatus === 'all' || institute.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Institutes</h2>
          <p className="text-sm text-gray-500">Manage all subscribed institutes</p>
          {/* <button onClick={()=>getInfoOfAvailableInstitutes()}> Click Me</button> */}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Institute
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-2xl overflow-y-auto max-h-[90vh] rounded-lg">
            <DialogHeader>
              <DialogTitle>Add New Institute</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Institute Name</Label>
                <Input value={instituteName} onChange={(e) => {
                  setInstituteName(e.target.value)
                }} placeholder="Enter institute name" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={instituteAddress} onChange={(e) => setInstituteAddress(e.target.value)} placeholder="Enter Institute Address Here" />
              </div>
              <div className="space-y-2">
                <Label>Subscription Type</Label>
                <Select value={subscriptionId}
                onValueChange={(value)=>setSubscriptionId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      subscriptionPlanArray.map((item) => {
                        return (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        )
                      })
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact No</Label>
                <Input placeholder="92******" value={instituteContact}
                 onChange={(e)=>setInstituteContact(e.target.value)}/>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full sm:w-auto" onClick={()=>setOpen(false)}>Cancel</Button>
              <Button onClick={()=>createNewInstitute()} className="w-full sm:w-auto bg-blue-600">Save Institute</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTER BAR */}
      <Card className="border-none shadow-sm bg-gray-50/50">
        <CardHeader className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search name .."
                className="pl-10 bg-white border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="institute">Institute</SelectItem>
                  <SelectItem value="batch">Batch</SelectItem>
                  <SelectItem value="individual">Class</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expiring Soon">Expiring</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {/* <Button variant="outline" className="hidden sm:flex bg-white border-gray-200">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button> */}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* MOBILE LIST VIEW (Hidden on md+) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredInstitutes.map((inst) => (
          <Card key={inst._id} className="p-4 space-y-4 border-gray-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900">{inst.name}</h3>
                <div className="flex items-center text-xs text-gray-500">
                  {/* <Mail className="w-3 h-3 mr-1" /> {inst.email} */}
                </div>
              </div>
              <Badge className={getStatusColor(inst.status)} variant="secondary">
                {inst.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-y border-gray-50">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Usage</p>
                <p className="font-semibold text-sm">{inst.totalAiRequests}</p>
                <div className="h-1.5 w-full bg-gray-100 rounded-full mt-1.5">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(inst.totalAiRequests / 100) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Contact</p>
                <p className="font-bold text-blue-600">{inst.contactNo}</p>
                <p className="text-[10px] text-gray-400 mt-1">{inst.scopeType}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Badge variant="outline" className="text-[10px]">{inst.scopeType}</Badge>
            
            </div>
          </Card>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on mobile) */}
      <Card className="hidden md:block overflow-hidden border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[250px]">Institute</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutes.length > 0 ? (
                filteredInstitutes.map((institute) => (
                  <TableRow key={institute._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <p className="font-semibold text-gray-900">{institute.name}</p>
                      {/* <p className="text-xs text-gray-500">{institute.email}</p> */}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-gray-600">
                        {institute.scopeType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(institute.status)}>
                        {institute.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-24 lg:w-32">
                        <div className="flex justify-between text-[10px] mb-1 font-medium text-gray-500">
                          <span>{Math.round((institute.totalAiRequests / 100) * 100)}%</span>
                          <span>{institute.totalAiRequests}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${(institute.totalAiRequests / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">{institute.contactNo}</TableCell>
                    <TableCell className="text-right">
                     
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No institutes found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

    </div>
  )
}





// edit or delete function backend me bana kar yahan aik dialogue box create karna hoga , revenue wala kaam bhi karna hoga