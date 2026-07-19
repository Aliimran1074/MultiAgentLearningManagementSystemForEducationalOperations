import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Download } from "lucide-react";

export default function AssignmentChecker() {

  const [selectedTab, setSelectedTab] = useState("uncheck");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const teacherId = import.meta.env.VITE_TEACHER_ID;


  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    const fetchData = async () => {
      try {

        const res = await fetch(
          `https://univeristy-management-system.vercel.app/api/teacherDashboard/${teacherId}/assignmentSubmission`
        );

        const data = await res.json();

        console.log("📦 ASSIGNMENT DATA:", data);

        setSubmissions(data);

      } catch (error) {
        console.log("❌ FETCH ERROR:", error);
      }
    };


    if (teacherId) {
      fetchData();
    }

  }, [teacherId]);



  // =========================
  // FILTER DATA
  // =========================

  const uncheck = useMemo(() => {

    return submissions.filter(
      s => s.status === "uncheck"
    );

  }, [submissions]);



  const checked = useMemo(() => {

    return submissions.filter(
      s => s.status === "checked"
    );

  }, [submissions]);



  const currentList =
    selectedTab === "uncheck"
      ? uncheck
      : checked;



  // =========================
  // DOWNLOAD FILE
  // =========================

  const handleDownload = (url)=>{

    if(!url){
      alert("File not available");
      return;
    }

    window.open(url,"_blank");

  };



  // =========================
  // MARK ASSIGNMENT
  // =========================

  const handleMark = async(
    submission,
    marks,
    comments
  )=>{

    try {


      const res = await fetch(
        "https://univeristy-management-system.vercel.app/api/manualAssignmentMarksUploading",
        {
          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            staffId:teacherId,

            assignmentId:
            submission.assignmentId,

            studentId:
            submission.studentId,

            marks:Number(marks)

          })

        }
      );



      const data = await res.json();


      console.log(
        "📦 MARK RESPONSE:",
        data
      );



      if(res.ok){


        alert(
          data.message ||
          "Marks Assigned Successfully"
        );


        // update frontend state
        setSubmissions(prev=>

          prev.map(item=>

            item.submissionId === submission.submissionId

            ?
            {
              ...item,
              status:"checked",
              marks:Number(marks)
            }

            :
            item

          )

        );


        setSelectedSubmission(null);

      }


    }
    catch(error){

      console.log(
        "❌ MARK ERROR:",
        error
      );

    }

  };




  // =========================
  // MODAL
  // =========================

  const Modal = ({submission})=>{


    const [marks,setMarks]=useState(
      submission.marks || ""
    );


    const [comments,setComments]=useState("");



    return (

      <div className="
      fixed inset-0 
      bg-black/60 
      flex items-center 
      justify-center 
      z-50
      ">


        <Card className="w-full max-w-xl">


          <CardHeader
          className="
          flex flex-row 
          justify-between 
          items-center
          "
          >

            <CardTitle>
              Check Assignment
            </CardTitle>


            <button
            onClick={()=>
              setSelectedSubmission(null)
            }
            >

              <X/>

            </button>


          </CardHeader>




          <CardContent
          className="space-y-4"
          >


            <div className="text-sm space-y-1">


              <p>
                <b>
                Student:
                </b>{" "}
                {submission.studentName}
              </p>


              <p>
                <b>
                Course:
                </b>{" "}
                {submission.courseName}
              </p>


              <p>
                <b>
                Max Marks:
                </b>{" "}
                {submission.maxMarks}
              </p>


            </div>




            <button

            onClick={()=>
              handleDownload(
                submission.uploadedFile
              )
            }

            className="
            flex items-center gap-2
            bg-gray-100
            px-3 py-2
            rounded
            "

            >

              <Download size={16}/>

              Download File

            </button>




            <input

            type="number"

            value={marks}

            onChange={
              e=>setMarks(e.target.value)
            }

            placeholder="Enter Marks"

            className="
            w-full
            border
            p-2
            rounded
            "

            />





            <textarea

            value={comments}

            onChange={
              e=>setComments(e.target.value)
            }

            placeholder="Comments"

            className="
            w-full
            border
            p-2
            rounded
            "

            />





            <button

            onClick={()=>
              handleMark(
                submission,
                marks,
                comments
              )
            }

            className="
            w-full
            bg-blue-600
            text-white
            py-2
            rounded
            "

            >

              Check Assignment

            </button>




          </CardContent>


        </Card>


      </div>

    );

  };






  // =========================
  // UI
  // =========================

  return (

    <div className="max-w-5xl mx-auto p-6">


      <h1 className="text-2xl font-bold mb-4">
        Assignment Checker
      </h1>




      <div className="flex gap-4 border-b mb-4">


        {
          ["uncheck","checked"].map(tab=>(


            <button

            key={tab}

            onClick={()=>
              setSelectedTab(tab)
            }

            className={`
            pb-2
            ${
              selectedTab===tab
              ?
              "border-b-2 border-blue-600 text-blue-600"
              :
              ""
            }
            `}

            >

              {
                tab==="uncheck"
                ?
                "Unchecked"
                :
                "Checked"
              }


            </button>


          ))
        }


      </div>





      <div className="space-y-3">


        {
          currentList.length===0

          ?

          (

            <div
            className="
            text-center
            py-10
            text-gray-500
            "
            >

              {
                selectedTab==="uncheck"
                ?
                "No unchecked assignments available"
                :
                "No checked assignments available"
              }


            </div>

          )


          :


          currentList.map(s=>(


            <Card
            key={s.submissionId}
            >


              <CardContent
              className="
              flex 
              justify-between 
              items-center 
              p-4
              "
              >



                <div>


                  <h3 className="font-bold">

                    {s.assignmentTitle}

                  </h3>


                  <p className="text-sm text-gray-500">

                    {s.studentName}
                    {" • "}
                    {s.courseName}

                  </p>


                  <p className="text-xs text-gray-400">

                    Status:
                    {" "}
                    {s.status}

                  </p>


                </div>





                <div className="flex gap-2">



                  <button

                  onClick={()=>
                    handleDownload(
                      s.uploadedFile
                    )
                  }

                  className="
                  p-2
                  bg-gray-100
                  rounded
                  "

                  >

                    <Download size={16}/>


                  </button>





                  {
                    s.status==="uncheck"
                    &&

                    (

                    <button

                    onClick={()=>
                      setSelectedSubmission(s)
                    }

                    className="
                    bg-blue-600
                    text-white
                    px-3
                    py-1
                    rounded
                    "

                    >

                      Check

                    </button>

                    )

                  }



                </div>



              </CardContent>


            </Card>


          ))

        }



      </div>





      {
        selectedSubmission
        &&
        <Modal
        submission={selectedSubmission}
        />
      }



    </div>


  );

}