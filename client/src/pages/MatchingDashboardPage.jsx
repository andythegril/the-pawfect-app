import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TinderCard from 'react-tinder-card';
import AccountNav from "../AccountNav.jsx";
import ChatContainer from "../ChatContainer.jsx";
import axios from "axios";



export default function MatchingDashboard() {
    const [matchedPets, setMatchedPets] = useState([]);
    // const [userPets, setUserPets] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        fetchMatchedPets(queryParams);
    }, [queryParams]);

    const fetchMatchedPets = async (params) => {
        try {
            const response = await axios.get('/match-pets',{
                params: {
                    type: params.get('type'),
                    gender: params.get('gender'),
                    availableFor: params.get('availableFor'),
                    interestedGender: params.get('interestedGender'),
                }
            });
            const matchedPetsData = response.data;
            console.log("API Response:", response.data); // Check the response from the API
            console.log("matchedPets:", matchedPets); // Check the matchedPetsData
            setMatchedPets(matchedPetsData);
            // setUserPets(userPets);
        } catch (error) {
            console.log('Error fetching matched pets: ', error);
        }
    }

    const handleSwipeRight = async (petId) => {
        try {
            const pet = matchedPets.find((pet) => pet._id === petId);
            if (pet) {
                const userPetId = userPets[0]._id;
                // Make a request to create a match between the user's pet and the swiped pet
                await axios.post('/match-pets', {
                    userPetId: userPetId, // Replace with the ID of the user's pet
                    swipedPetId: pet._id // Use the ID of the swiped pet
                });
                // Refresh the matched pets list to update the UI
                await fetchMatchedPets(queryParams);
            }
        } catch (error) {
            console.error('Error creating match:', error);
        }
    }

    const [lastDirection, setLastDirection] = useState()

    const swiped = (direction, nameToDelete) => {
        console.log('removing: ' + nameToDelete)
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    return (
        <div className="">
            <AccountNav />
            <div className="dashboard">
                <ChatContainer />
            <div className="swipe-container">
                <div className='cardContainer'>
                    {matchedPets.map((pet) =>
                        <TinderCard
                            className='swipe'
                            key={pet._id}
                            onSwipe={(dir) => swiped(dir, pet.name)}
                            onCardLeftScreen={() => outOfFrame(pet.name)}
                            onSwipeRight = {() => handleSwipeRight(pet._id)}
                        >

                            <div style={{ backgroundImage: `url(http://localhost:4000/uploads/${pet.photos[0]})` }}
                                 className='card'>
                                <h3>{pet.name}</h3>
                            </div>

                        </TinderCard>
                    )}

                    <div className="swipe-info">
                        {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                    </div>

                </div>
            </div>
        </div>
        </div>
    );
}
