import React from 'react';



export const HomePage = () => {

    return (
        <div>
           <h1>
               Home Page
           </h1>
            <div className="progress">
                <div className="indeterminate"/>
            </div>
            <h5>
                Reactive e-commerce store with React + NodeJS + MongoDB!
            </h5>
            <p>
                A small demo of a real working store based on 100% JavaScript: Frontend, and Backend.
            </p>
            <p>
                All sorts of effects, animations, changes to page content - everything happens right inside the page, without page reloads.
            </p>
            <p>
                Unlike monoliths like WordPress, OpenCart, there are no unnecessary requests and drawings.
            </p>
            <p>
                Through the API, we receive "raw" data in JSON format and render them in React.
            </p>

        </div>
    );
}








