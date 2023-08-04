export default function MatchesDisplay( { matches, setClickedUser} ) {

    console.log("Matches Display: matchedPets from parent component", matches)

    return (
        <div>
            <div className="flex flex-col">
                {matches !== null && matches?.length > 0 ? (
                    matches.map((matchedPet, _index) => (
                        <div
                            key={matchedPet._id || _index}
                            className="flex items-center gap-2 mb-2"
                            onClick={() => setClickedUser(matchedPet)}
                        >
                            <img
                                className="ml-2 w-12 h-12 rounded-full"
                                src={`http://localhost:4000/uploads/${matchedPet.photos[0]}`}
                                alt={matchedPet.name}
                            />
                            <p>{matchedPet.name}</p>
                        </div>
                    ))
                ) : (
                    <p>No matches found.</p>
                )}
            </div>
        </div>
    );
}