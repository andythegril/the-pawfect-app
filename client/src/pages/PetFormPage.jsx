import PhotoUploader from "../PhotoUploader.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav.jsx";
import {Navigate, useParams} from "react-router-dom";

export default function PetFormPage() {
    const {id} = useParams();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhoto, setAddedPhoto] = useState([]);
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [availableFor, setAvailableFor] = useState('');
    const [gender, setGender] = useState('');
    const [interestedGender, setInterestedGender] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if(!id) {
            return;
        }
        axios.get('/pets/' + id).then(response => {
            const {data} = response;
            setName(data.name);
            setAddress(data.address);
            setAddedPhoto(data.photos);
            setDesc(data.desc);
            setType(data.type);
            setAvailableFor(data.availableFor);
            setGender(data.gender);
            setInterestedGender(data.interestedGender);

        })
    }, [id])
    async function addNewPet(ev){
        ev.preventDefault();
        const petData = {
            name, address, addedPhoto, desc,
            type, availableFor, gender, interestedGender
        }
        if (id) {
            await axios.put('/pets', {
                id,
                ...petData
            });
            setRedirect(true);

        } else {
            await axios.post('/pets', petData);
            setRedirect(true);
        }

    }

    if (redirect) {
        return <Navigate to={'/account/pets'} />
    }

    return (
        <>
            <div>
                <AccountNav />
                <form onSubmit={addNewPet}>
                    <h2 className="text-2xl mt-4">Name</h2>
                    <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder="Your pet's name"/>

                    <h2 className="text-2xl mt-4">City</h2>
                    <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Ho Chi Minh, Ha Noi, Da Nang, etc."/>

                    <h2 className="text-2xl mt-4">Photos</h2>
                    <PhotoUploader addedPhoto={addedPhoto} onChange={setAddedPhoto}/>

                    <h2 className="text-2xl mt-4">Description</h2>
                    <textarea className="w-full border my-1 py-2 px-3 rounded-2xl" value={desc} onChange={ev => setDesc(ev.target.value)} placeholder="say anything about your pet" />


                    <h2 className="text-2xl mt-4">Type</h2>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="cat-id"
                                   type="radio"
                                   name="type"
                                   checked={type === 'cat'}
                                   value="cat"
                                   onChange={ev => setType(ev.target.value)}
                            />
                            <label htmlFor="cat-id">Cat</label>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="dog-id"
                                   type="radio"
                                   name="type"
                                   checked={type === 'dog'}
                                   value="dog"
                                   onChange={ev => setType(ev.target.value)}
                            />
                            <label htmlFor="dog-id">Dog</label>
                        </label>
                    </div>

                    <h2 className="text-2xl mt-4">Available for</h2>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="dating-id"
                                   type="radio"
                                   name="availableFor"
                                   checked={availableFor === 'dating'}
                                   value="dating"
                                   onChange={ev => setAvailableFor(ev.target.value)}
                            />
                            <label htmlFor="dating-id">Dating</label>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="adoption-id"
                                   type="radio"
                                   name="availableFor"
                                   checked={availableFor === 'adoption'}
                                   value="adoption"
                                   onChange={ev => setAvailableFor(ev.target.value)}
                            />
                            <label htmlFor="adoption-id">Adoption</label>
                        </label>
                    </div>


                    <h2 className="text-2xl mt-4">Gender</h2>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="male-id"
                                   type="radio"
                                   name="gender"
                                   checked={gender === 'male'}
                                   value="male"
                                   onChange={ev => setGender(ev.target.value)}
                            />
                            <label htmlFor="gender-id">Male</label>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="female-id"
                                   type="radio"
                                   name="gender"
                                   checked={gender === 'female'}
                                   value="female"
                                   onChange={ev => setGender(ev.target.value)}

                            />
                            <label htmlFor="gender-id">Female</label>
                        </label>
                    </div>


                    <h2 className="text-2xl mt-4">Interested Gender</h2>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="interest-male-id"
                                   type="radio"
                                   name="interestedGender"
                                   checked={interestedGender === 'male'}
                                   value="male"
                                   onChange={ev => setInterestedGender(ev.target.value)}
                            />
                            <label htmlFor="interest-male-id">Male</label>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input id="interest-female-id"
                                   type="radio"
                                   name="interestedGender"
                                   checked={interestedGender === 'female'}
                                   value="female"
                                   onChange={ev => setInterestedGender(ev.target.value)}
                            />
                            <label htmlFor="interest-female-id">Female</label>
                        </label>
                    </div>


                    <button className="primary my-4">Save</button>
                </form>
            </div>
        </>
    )
}