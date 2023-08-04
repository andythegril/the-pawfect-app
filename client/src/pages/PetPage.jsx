import { Link } from "react-router-dom";
import AccountNav from "../AccountNav.jsx";
import {useEffect, useState} from "react";
import axios from "axios";




export default function PetPage() {

    const [pets, setPets] = useState([]);
    const [userPetId, setUserPetId] = useState(null);

    useEffect(()=> {
        axios.get('/pets').then(({data}) => {
            setPets(data);
        });
    },[]);


    return (
        <div>
            <AccountNav />
                <div className="text-center">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/pets/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                        Add new pet
                    </Link>
                </div>

                <div className="mt-10">
                    {pets.length > 0 && pets.map(pet => (
                        <div key={pet._id} className="flex gap-4 bg-gray-100 mt-4 p-4 rounded-2xl">
                            <div className="flex w-40 h-40 bg-gray-300 grow shrink-0">
                                {pet.photos.length > 0 && (
                                    <img className="object-cover" src={'http://localhost:4000/uploads/'+pet.photos[0]} alt=""/>
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-xl uppercase text-primary font-bold">{pet.name}</h2>
                                <h3 className="text-small mt-2 uppercase">{pet.gender}</h3>
                                <p className="text-small mt-2">For {pet.availableFor} | 📍{pet.address} </p>
                                <p className="text-small mt-2">{pet.desc}</p>
                            </div>
                            <div className="flex m-4 text-center py-10 gap-2 text-gray-500 ">
                                <Link className="border-2 m-4 px-4 py-2 rounded-2xl" to={'/account/pets/'+pet._id}>Edit</Link>
                                <Link
                                    className="bg-primary m-4 px-4 py-2 rounded-2xl text-white"
                                    to={`/account/matching?userPetId=${pet._id}&gender=${pet.gender}&interestedGender=${pet.interestedGender}&type=${pet.type}&availableFor=${pet.availableFor}`}
                                >
                                    Match
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}

