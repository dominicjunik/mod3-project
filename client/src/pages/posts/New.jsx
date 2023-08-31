export default function New({username}){

    
    console.log(username)
    return(
        <div className="flex flex-col items-center">
            <h1>Create a Trick or Treat</h1>
            <form onSubmit={null} className="flex flex-col w-screen items-center">
                <label htmlFor="teaser">Set the scene:</label>
                <textarea name="teaser" id="teaser" cols="50" rows="4" className="p-1" placeholder="You see an old crooked house with an overgrown lawn, a single light illuminates a pumpkin filled with candy on the doorstep..." />

                
                <fieldset>
                    <legend>Is this a Trick or a Treat?</legend>
                    <div className="flex justify-center">
                        <label htmlFor="trick">Trick</label>
                        <input type="radio" id="trick" name="trick" value={true}/>
                        <p className="mx-2">or</p>
                        <label htmlFor="treat">Treat</label>
                        <input type="radio" id="treat" name="trick" value={false}/>
                    </div>
                </fieldset>

                <label htmlFor="spoiler">If they guess correct?</label>
                <textarea name="teaser" id="teaser" cols="50" rows="2" className="p-1" placeholder="The motherload! fullsized candy bars with a note saying, take as many as you want :)"/>
                <label htmlFor="spoiler">If they get it wrong...</label>
                <textarea name="teaser" id="teaser" cols="50" rows="2" className="p-1" placeholder=""/>

            </form>
        </div>
    )
}