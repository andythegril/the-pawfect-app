import {useEffect, useState} from "react";
import axios from "axios";

export default function ChatHeader() {

    // const [pets, setPets] = useState([]);
    // useEffect(()=> {
    //     axios.get('/pets').then(({data}) => {
    //         setPets(data);
    //     });
    // },[]);

    return (
        // <div className="chat-container">
        //     <div className="profile">
        //       <div className="img-container">
        //           {pets.length > 0 && pets.map(pet => (
        //               <div key={pet._id} className="flex gap-4 bg-gray-100 mt-4 p-4 rounded-2xl">
        //                   <div className="flex w-40 h-40 bg-gray-300 grow shrink-0">
        //                       {pet.photos.length > 0 && (
        //                           <img className="object-cover" src={'http://localhost:4000/uploads/'+pet.photos[0]} alt=""/>
        //                       )}
        //                   </div>
        //               </div>
        //               ))}
        //       </div>
        //     </div>
        // </div>

        <div className="flex justify-around">
            <div className="">
                <div className="flex w-40 h-40">
                    <img className="object-cover rounded-3xl" src="https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTirTLZGJkc8CsFcR-FTUBvCuK0oW4Qlbi5zSZqfjdo8HBf8xWkrYv9M2QP0Ekpc9HGXe8l39aQZx95Od8" alt=""/>
                </div>

                    <h3 className="text-center">UserName</h3>
                </div>
        </div>
    )
}