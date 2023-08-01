import React from "react";

export default function PetLabels({selected, onChange}) {

    function handleChange(ev) {
        const { checked, value } = ev.target;
        if (checked) {
            onChange([...selected, value]);
        } else {
            onChange(selected.filter((selectedValue) => selectedValue !== value));
        }
    }


   return (
       <>
           <h2 className="text-2xl mt-4">Description</h2>
           <textarea value={desc} onChange={ev => setDesc(ev.target.value)} placeholder="say anything about your pet" />


           <h2 className="text-2xl mt-4">Type</h2>
           <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
               <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                   <input id="cat-id"
                          type="radio"
                          name="type"
                          value="cat"
                          onChange={ev => setType(ev.target.value)}
                   />
                   <label htmlFor="cat-id">Cat</label>
               </label>
               <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                   <input id="dog-id"
                          type="radio"
                          name="type"
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
                          value="dating"
                          onChange={ev => setAvailableFor(ev.target.value)}
                   />
                   <label htmlFor="dating-id">Dating</label>
               </label>
               <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                   <input id="adoption-id"
                          type="radio"
                          name="availableFor"
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
                          value="male"
                          onChange={ev => setGender(ev.target.value)}
                   />
                   <label htmlFor="gender-id">Male</label>
               </label>
               <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                   <input id="female-id"
                          type="radio"
                          name="gender"
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
                          value="male"
                          onChange={ev => setInterestedGender(ev.target.value)}
                   />
                   <label htmlFor="interest-male-id">Male</label>
               </label>
               <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                   <input id="interest-female-id"
                          type="radio"
                          name="interestedGender"
                          value="female"
                          onChange={ev => setInterestedGender(ev.target.value)}
                   />
                   <label htmlFor="interest-female-id">Female</label>
               </label>
           </div>

       </>
   )
}