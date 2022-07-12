// BIOEDITOR class component

this.state = {
    showTextArea: false,
    draftBio:""
};

//the bio that the user types in the bioeditor is the the draft bio,
//the bio the user submits and successfully goes through the database is the official bio and should live in APP

handleBioChange(){
    //in here keep track of the bio the user is typing
    //store the info in state (draft Bio)
}

submitBio(){
    //this should run whenever the user clicks save(done writing bio)

    //Todo 
    // make a fetch post reques, send along this.state.draftBio

    //2. after the draft bio was successfully inserted in the db, make sure the server sends it back to react 
    //3. once you get it back, this is now the official bio 

    //call the apps function set bio here and pass it to the official bio

}

render(){
    return(
        <div>
            {this.state.showTextArea && (
                <div>
                    <h1>I am the bio editor</h1>
                    <textarea></textarea>
                </div>
            )}
        </div>

        // if thetext area is hidden, check to see if there is a bio

        //if there is an existing bio, allow the user to EDIT
        // if there is no bio, allow the user to add a bio
        //whenever they click on the add or edit button, show the text area
    )
}
