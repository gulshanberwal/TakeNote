"use client";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';



const id = uuidv4();

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // optional
  variable: "--font-roboto", // optional for CSS variable
});

export default function Home() {

  const { data: session, status } = useSession()
  const [datafetcher, setDatafetcher] = useState("pkg")
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notesArray, setNotesArray] = useState([])
  const [inputhidden, setInputhidden] = useState(false);
  const [itemsSee, setItemsSee] = useState(false)
  const [forEditNote, setForEditNote] = useState(false)
  const [titleChangeEdit, settitleChangeEdit] = useState("")
  const [noteChangeEdit, setnoteChangeEdit] = useState("")
  const [editNoteValues, seteditNoteValues] = useState({})

  let editNoteValuesHandle = {
    id: editNoteValues.id,
    title: titleChangeEdit,
    note: noteChangeEdit
  }

  const TitleChange = (e) => {
    setTitle(`${e.target.value}`);
  };
  const NoteChange = (e) => {
    setNote(`${e.target.value}`);
  };

  const propgationHidden = (e) => {
    e.stopPropagation();
    setInputhidden(true);
  };

  useEffect(() => {
    if (status == "loading") return
    const datafetch = async () => {
      let a = await fetch(`/api/users?email=${session?.user?.email}`)
      let res = await a.json()
      setNotesArray([...res])
    }
    datafetch()
  }, [itemsSee == true, datafetcher])




  const SaveToDB = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session?.user?.email,
        title: title,
        note: note,
        id: id,
      }),
    })

    const data = await res.json()
    console.log('Response:', data)
    setTitle("")
    setNote("")
    setDatafetcher(!datafetcher)
  }



  const deleteNote = async (id) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    console.log('Response:', data)
    setDatafetcher(!datafetcher)
  }


  const editNote = async (id, uuid) => {
    let a = await fetch(`/api/users?uuid=${uuid}`)
    let res = await a.json()
    settitleChangeEdit(`${res.title}`)
    setnoteChangeEdit(`${res.note}`)
    seteditNoteValues({ id: id, title: titleChangeEdit, note: noteChangeEdit })
  }

  const saveEditedNote = async (id, title, note) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id, // replace with actual id
        title: title,
        note: note,
      }),
    });
    setDatafetcher(!datafetcher)
    setForEditNote(false)
  }

  const editTitleChange = (e) => {
    settitleChangeEdit(`${e.target.value}`)
  }

  const editNoteHandleChange = (e) => {
    setnoteChangeEdit(`${e.target.value}`)
  }



  return (
    <div onClick={() => { setInputhidden(false); }} className={poppins.className}>
      {session ? <div>
        <div className={`flex flex-col items-center`}>
          <div
            onClick={(e) => propgationHidden(e)} className={`transition-colors duration-300 ease-in-out hover:bg-[#0000000a] flex justify-between md:w-[50vw] p-4 rounded-2xl shadow-lg border border-gray-200 my-8 ${inputhidden == true ? "hidden" : ""}`}>
            <input  type="text" placeholder="Take a note" className="outline-none" />
            <Image className="rounded-full" src="/plusicon.svg" width={30} height={30} alt="Picture of the author" />
          </div>

          <div onClick={(e) => { e.stopPropagation(); }} className={`lg:w-[40vw] w-[80vw] p-4 rounded-2xl shadow-lg border border-gray-200 my-8 ${inputhidden == true ? "" : "hidden"}`}>
            <input value={title} type="text" placeholder="Title" className="w-full mb-2 outline-none text-lg font-medium placeholder-gray-500" onChange={(e) => { TitleChange(e) }} />
            <textarea value={note} placeholder="Take a note..." className="w-full h-40 outline-none placeholder-gray-500" onChange={(e) => { NoteChange(e); }} ></textarea>
            {title.length >= 1 && note.length >= 1 &&
              <button onClick={() => { SaveToDB() }} type="button" className=" bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 text-center">Save</button>}
          </div>


          {itemsSee == false ? <button onClick={() => { setItemsSee(true) }} className="transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-lg px-3 hover:px-3.5 py-1.5 hover:py-2  mt-4"><span>See your Notes</span></button> :
           <div className="items w-[80vw] flex gap-6 mx-auto flex-wrap items-center mb-8 justify-center">
             <div className="w-full flex justify-center">{itemsSee == true && <button onClick={() => { setItemsSee(false) }} className="transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-lg px-3 hover:px-4 py-1.5 hover:py-2 mt-4">Unvisible your Notes</button>}</div>
            {notesArray.map((item) => {
              return <div key={item._id}>
                {forEditNote == false && <> <div className="transition-colors duration-300 ease-in-out hover:bg-[#0000000a] item flex flex-col gap-1.5 border border-gray-200 p-6 pb-2 rounded-2xl md:max-w-[75vw] max-w-[90vw] sm:min-w-[250px] min-w-[90vw] h-fit">
                  <div className="text-2xl break-words">{item.title}</div>
                  <div className="break-words">{item.note}</div>
                  <div className="button flex justify-end gap-1">
                    <button onClick={() => { editNote(item._id, item.id); setForEditNote(true) }} className="transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-full px-3 hover:px-4 py-1.5 hover:py-2.5 mt-4"><img src="/edit.svg" alt="" /></button>
                    <button onClick={() => { deleteNote(item.id) }} className="transition-all duration-300 ease-in-out bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-full px-3 hover:px-4 py-1.5 hover:py-2.5 mt-4"><img src="/delete.svg" alt="" /></button>
                  </div>
                </div></>}
              </div>
            })}
            {forEditNote == true && <>
              <div className="fixed inset-0 bg-[#0000001f] z-10"></div>
              <div className="item z-20 bg-white w-[40vw] max-xl:w-[90vw] flex flex-col gap-4 items-center p-4 rounded-2xl ">
                <input onChange={(e) => { editTitleChange(e) }} value={editNoteValuesHandle.title} type="text" placeholder="Title" className="w-full mb-2 outline-none text-2xl font-medium placeholder-gray-500" />
                <textarea onChange={(e) => { editNoteHandleChange(e) }} value={editNoteValuesHandle.note} placeholder="Take a note..." className="w-full h-24 outline-none placeholder-gray-500"></textarea>
                <button onClick={() => { saveEditedNote(editNoteValuesHandle.id, editNoteValuesHandle.title, editNoteValuesHandle.note); setForEditNote(false) }} className="bg-black text-white rounded-2xl px-3 py-1.5 mt-4">Save</button>
              </div></>
            }
          </div>}
        </div>
      </div> : <div className="font-bold text-2xl w-full h-[80vh] flex flex-col text-center justify-center items-center gap-2 px-10"><span>Please click on Sign In to Create Notes</span><button onClick={() =>signIn()} type="button" className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign In</button></div>}
    </div>
  );
}
