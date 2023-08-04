import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TinderCard from 'react-tinder-card';
import AccountNav from "../AccountNav.jsx";
import ChatContainer from "../ChatContainer.jsx";
import axios from "axios";


const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};
export default function MatchingDashboard() {
    const location = useLocation();
    const [userPetId, setUserPetId] = useState(null);
    const [matchedPets, setMatchedPets] = useState([]);
    const [swipedPets, setSwipedPets] = useState([])
    const [swipedRightPets, setSwipedRightPets] = useState([])
    const [newlyMatchedPetIds, setNewlyMatchedPetIds] = useState([]);
    const [lastDirection, setLastDirection] = useState()

    // useEffect(() => {
    //     const storedSwipedPets = JSON.parse(localStorage.getItem('swipedPets')) || [];
    //     setSwipedPets(storedSwipedPets);
    // }, []);

    const fetchUserPet = async (petId) => {
        try {
            const response = await axios.get(`/pets/${petId}`);
            setUserPetId(response.data);
        } catch (error) {
            console.error('Error fetching user pet details:', error);
        }
    };

    const fetchMatchedPets = async (params, userPetId) => {
        try {
            console.log('Fetching matched pets with params:', params.toString());
            const response = await axios.get(`/match-pets/${userPetId}`, {
                params: {
                    type: params.get('type'),
                    gender: params.get('gender'),
                    availableFor: params.get('availableFor'),
                    interestedGender: params.get('interestedGender'),
                },
            });
            const matchedPetsData = response.data;
            setMatchedPets(matchedPetsData);
            console.log("potential matches ne: ", matchedPetsData)
        } catch (error) {
            console.log('Error fetching matched pets: ', error);
        }
    };

    const fetchSwipedRightPets = async (petId) => {
        try {
            const response = await axios.get(`/check-match/${petId}`);
            const swipedRightPetsData = response.data;
            console.log("the first response: ", swipedRightPetsData);

            if (swipedRightPetsData.length > 0) {
                const updatedSwipedPets = [...swipedRightPets, ...swipedRightPetsData];
                setSwipedRightPets(updatedSwipedPets);
            }
        } catch (error) {
            console.error('Error fetching swiped right pets:', error);
        }
    }


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userPetIdFromQuery = queryParams.get('userPetId');
        fetchMatchedPets(queryParams, userPetIdFromQuery);
        fetchUserPet(userPetIdFromQuery);
        fetchSwipedRightPets(userPetIdFromQuery);
    }, [location.search]);

    const handleSwipeRight = async (matchedPetId) => {
        try {
            await axios.put('/create-match', {
                userPetId: userPetId._id,
                matchedPetId: matchedPetId,
            });
            fetchUserPet(userPetId._id)

            const updatedSwipedPets = [...swipedPets, matchedPetId];
            localStorage.setItem('swipedPets', JSON.stringify(updatedSwipedPets));
            setSwipedPets(updatedSwipedPets);
            console.log("swipedPets:", swipedPets )

            // Update matchedPets state to remove the matched pet
            const updatedMatchedPets = matchedPets.filter(pet => pet._id !== matchedPetId);
            setMatchedPets(updatedMatchedPets);
            console.log("updatedMatchedPets", updatedMatchedPets)

            setNewlyMatchedPetIds((prevIds) => [...prevIds, matchedPetId]);

        } catch (error) {
            console.error('Error handling swipe right:', error);
        }
    }


    const debouncedSwiped = debounce((direction, swipedUserId) => {
        if (direction === 'right') {
            handleSwipeRight(swipedUserId);
        }
        setLastDirection(direction);
    }, 1000);

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    // const matchedPetIds = userPetId?.matches.map(({_id}) => _id).concat(userPetId._id)
    const matchedPetIds = userPetId?.matches?.filter(({_id}) => _id !== userPetId._id).map(({_id}) => _id) || [];
    // const filterMatchedPetProfiles = matchedPets?.filter(matchedPet => !matchedPetIds.includes(matchedPet._id))
    // const filterMatchedPetProfiles = matchedPets?.filter(matchedPet =>
    //     !matchedPetIds.includes(matchedPet._id) && !swipedPets.includes(matchedPet._id)
    // );
    const filterMatchedPetProfiles = matchedPets?.filter(matchedPet =>
        !matchedPetIds.includes(matchedPet._id) && !swipedPets.includes(matchedPet._id)
    );

    console.log("filterMatchedPetProfiles", filterMatchedPetProfiles)
    useEffect(() => {
        fetchSwipedRightPets(userPetId?._id)
            .then((swipedRightPets) => {
                // Add the newly matched pet IDs to swipedRightPets
                setSwipedRightPets((prevSwipedRightPets) => [
                    ...prevSwipedRightPets,
                    ...newlyMatchedPetIds,
                ]);
            })
            .catch((error) => {
                console.error('Error fetching swiped right pets:', error);
            });
    }, [userPetId, newlyMatchedPetIds]);


    return (
        <div className="">
            <AccountNav />
            <div className="dashboard">
            <div className="z-1 text-left max-w-3xl max-h-full">
                <ChatContainer userPet={userPetId} matches={swipedRightPets} />
            </div>

            <div className="swipe-container">
                <div className='cardContainer'>
                    {filterMatchedPetProfiles?.length > 0 ? (
                        filterMatchedPetProfiles.map((matchedPet) =>
                            <TinderCard
                                className='swipe'
                                key={matchedPet._id}
                                onSwipe={(dir) => debouncedSwiped(dir, matchedPet._id)}
                                onCardLeftScreen={() => outOfFrame(matchedPet.name)}
                            >
                                <div style={{ backgroundImage: `url(http://localhost:4000/uploads/${matchedPet.photos[0]})` }}
                                     className='card'>
                                    <h3>{matchedPet.name}</h3>
                                </div>
                            </TinderCard>
                        )
                    ) : (
                        <p>No potential matches available.</p>
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
