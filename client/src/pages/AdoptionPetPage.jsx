import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";
import { useLocation } from "react-router-dom";

export default function AdoptionPetsPage() {
    const location = useLocation();
    const [adoptionPets, setAdoptionPets] = useState([]);

    const fetchAdoptionPets = async (params) => {
        try {
            const response = await axios.get("/adoption-pets", {
                params: {
                    availableFor: "adoption",
                },
            });

            setAdoptionPets(response.data);
        } catch (error) {
            console.error("Error fetching adoption pets:", error);
        }
    };

    const handleEnquireClick = async (petName, ownerEmail) => {
        // Open a Gmail compose window
        const emailSubject = encodeURIComponent(`Inquiry about ${petName}`);
        const emailBody = encodeURIComponent(
            `Name:\nAddress:\nPhone Number:\nWhy you want to adopt ${petName}:`
        );
        const emailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${ownerEmail}&su=${emailSubject}&body=${emailBody}`;

        window.open(emailLink);
    };

    useEffect(() => {
        fetchAdoptionPets();
    }, []);

    return (
        <div className="flex flex-wrap justify-center">
            <AccountNav />
            {adoptionPets.map((pet) => (
                <div
                    key={pet._id}
                    className="max-w-xs bg-white border rounded-lg shadow-lg m-4"
                >
                    <img
                        className="w-full h-48 object-cover object-center"
                        src={`http://localhost:4000/uploads/${pet.photos[0]}`}
                        alt={pet.name}
                    />
                    <div className="p-4">
                        <h2 className="text-lg font-semibold">
                            {pet.name} | The {pet.type}
                        </h2>
                        <p className="text-gray-600"> 📍{pet.address} </p>
                        <p className="text-gray-700 m-2">{pet.desc}</p>
                        <div className="flex">
                            <button
                                className="w-full bg-primary border-transparent border-b-4 hover:border-black m-2 px-2 py-2 rounded-2xl text-white"
                                onClick={() => handleEnquireClick(pet.name, pet.owner.email)}
                            >
                                Enquire about {pet.name}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
