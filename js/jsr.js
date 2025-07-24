
// die Funktion xhr() aus der Skriptdatei js/lib/xhr.js nutzen, die die Verwendung von XMLHttpRequest für den Zugriff auf den Server kapselt.
async function loadDataFromServerAndCreateList(root) {

    // reload the windows again and access the designated url address
    // setTimeout( () => {
    //     windows.location = "http://192.168.13.48:8395/data/listitems.json";
    // }, 1000)

    // delay several seconds , then send a request to the server
    setTimeout(async () => {

        //global variables
        const dataUrl = "./data/listitems.json";
        const xmlHttpRequest_or_fetch = "fetch";
        const xmlHttpRequest_onreadystatechange_or_onload = "onload"; // onreadystatechange or onload
        const fetch_use_async_await = true;
        const fetch_use_then_chain = false;
        const fetch_use_responseTextPromise_or_responseJsonPromise = "responseTextPromise";

        //variant 1: use XMLHttpRequest to load the data from the server
        if (xmlHttpRequest_or_fetch === "xmlHttpRequest") {
            const req = new XMLHttpRequest();
            req.open("GET", dataUrl);
            req.send();
            console.log("xmlHttpRequest send has been executed .. ")

            //Variant 1.1: use req.onreadystatechange to handle the response
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
            if (xmlHttpRequest_onreadystatechange_or_onload === "onreadystatechange") {

                // req.onreadystatechange = () => {}
                // Semantisch: hier ist event handler/ event lister (eine spezifische event listen  ) for the request . event is load
                // Strukturtisch:  ist  an callback function, because it is called when the event is fired
                // Syntaktische ist eine lambda function


                // jede readyState ist eine Zahl von 0 bis 4.  0 = unsent, 1 = opened, 2 = headers received, 3 = loading, 4 = done
                req.onreadystatechange = () => {
                    if (req.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                        console.log("request state changed: " + req.readyState);
                    } else if (req.readyState === XMLHttpRequest.LOADING) {
                        console.log("req.responseText: " + req.responseText);
                    } else if (req.readyState === XMLHttpRequest.DONE) {
                        console.log("request state changed: " + req.readyState);

                        if (req.status === 200) {
                            console.log("received response with request status: " + req.status);
                            const responseText = req.responseText;
                            // alert("response: " + responseText);
                            const responseObjs = JSON.parse(responseText);
                            console.log("Data loaded from server: ", responseObjs);

                            // create the list with the data
                            responseObjs.forEach(obj => {
                                addNewListElement(root, obj);
                            });
                        } else {
                            console.error("Error loading data from server: ", req.statusText);
                        }
                    }
                }

            } else if (xmlHttpRequest_onreadystatechange_or_onload) {
                // Variant 1.2: use req.onload to handle the response
                // req.onload is an event handler for an XMLHttpRequest that runs when the request completes successfully (i.e. the response is fully received, regardless of its status code).

                req.onload = () => {
                    if (req.status === 200) {
                        console.log("received response with request status: " + req.status);
                        const responseText = req.responseText;
                        // alert("response: " + responseText);
                        const responseObjs = JSON.parse(responseText);
                        console.log("Data loaded from server: ", responseObjs);

                        // create the list with the data
                        responseObjs.forEach(obj => {
                            addNewListElement(root, obj);
                        });
                    }
                }
            }

        } else if (xmlHttpRequest_or_fetch === "fetch") {

            // variant 2: use fetch to load the data from the server

            // promise-based API: promise is an object that represents the result of an asynchronous operation.
            // A Promise is a JavaScript object used to handle asynchronous operations, like fetching data from an API.
            // A Promise is a better alternative to callbacks. It represents a value that may be available now, later, or never.
            // promise has three states:
            // pending: the initial state, neither fulfilled nor rejected
            // fulfilled: meaning that the operation was completed successfully
            // rejected: meaning that the operation failed

            // the fetch method returns a promise that resolves to the Response object representing the response to the request. the response variable take the response of request.
            // The then() method is called with this Response object as its argument.
            // The catch() method is called with an error handler that will be called if the request fails. The Response object contains the response data, including the status code and the response body.
            // The Response object contains the response data, including the status code and the response body.


            // Variant 2.1: Do no use async_await
            if (!fetch_use_async_await) {

                // variant 2.1.1: Do not use then chain to load the data which is obtained from the fetch method
                if (!fetch_use_then_chain) {
                    // resPromise is a promise, so we can use then() to handle the response
                    const resPromise = fetch(dataUrl);
                    console.log("res: ",resPromise);

                    resPromise.then(response => {

                        // Variant 2.1.1.1: use response.text() to get the response, not response.json()
                        if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseTextPromise") {

                            // then is a method of the promise object that takes a callback function as an argument
                            // Why only one argument in the call function:
                            // in promises then function,  why only one argument in the call function
                            //  In a .then() function of a Promise, the callback receives only one argument because that argument represents the result of the previous promise — typically either: the fulfilled value (e.g., a Response object from fetch)  or, in a .then() chain, the return value from the previous .then()
                            // The callback function only need one argument to take the result of resPromise in Promise object.

                            console.log("response: ", response);


                            // variant 2.1.1: use response.text() to get the response text
                            const responseTextPromise = response.text();
                            console.log("responseTextPromise: ", responseTextPromise);

                            responseTextPromise.then(responseText => {
                                console.log("responseText: ", responseText);

                                const responseObjs = JSON.parse(responseText);
                                console.log("Data loaded from server: ", responseObjs);
                                // create the list with the data
                                responseObjs.forEach(obj => {
                                    addNewListElement(root, obj);
                                });
                            })

                        } else if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseJsonPromise") {

                            // variant 2.1.1.2: use response.json() to get the response json
                            // response.json() returns a promise, so we can use then() to handle the response. response.json() method returns a promise that resolves to the result of parsing the body text as JSON
                            const responseJsonPromise = response.json();
                            responseJsonPromise.then( jsonObjs  => {
                                console.log("jsonObjs: ", jsonObjs);
                                // create the list with the data
                                jsonObjs.forEach(obj => {
                                    addNewListElement(root, obj);
                                });
                            })
                        }
                    })

                } else {

                    // variant 2.1.2: use then chain to load the data which is obtained from the fetch method
                    // then() chain to hande the response which is obtained the fetch method


                    // Variant 2.1.2.1: use response.text() to get the response text
                    if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseTextPromise") {

                        // Variant 2.2.1: use response.text() to get the response text
                        fetch(dataUrl)
                            .then(response => response.text())
                            .then(responseText => {
                                console.log("responseText: ", responseText);
                                const responseObjs = JSON.parse(responseText);
                                console.log("Data loaded from server: ", responseObjs);
                                // create the list with the data
                                responseObjs.forEach(obj => {
                                    addNewListElement(root, obj);
                                });
                            })
                    } else if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseJsonPromise") {

                        // Variant 2.1.2.2: use response.json() to get the response json
                        fetch(dataUrl)
                            .then(res => res.json())
                            .then(jsonObjs => jsonObjs.forEach(obj => addNewListElement(root, obj)));
                    }
                }

            } else {

                // Variant 2.2: use async/await to load the data from the server
                // async/await is a syntactic sugar over promises, making asynchronous code look synchronous
                // async function is a function that returns a promise, and await is used to wait for the promise to resolve, until all data is loaded from the server, and then the code continues to execute
                const res = await fetch(dataUrl);
                console.log("res: ", res);

                // Variant 2.2.1: use response.text() or response.json() to get the response data
                if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseTextPromise") {

                    // variant 2.3.1: use response.text() to get the response text
                    const responseText = await res.text();
                    console.log("responseText: ", responseText);
                    const responseObjs = JSON.parse(responseText);
                    console.log("Data loaded from server: ", responseObjs);
                    // create the list with the data
                    responseObjs.forEach(obj => {
                        addNewListElement(root, obj);
                    });

                } else if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseJsonPromise") {

                    // Variant 2.3.2: use response.json() to get the response json
                    const jsonObjs = await res.json();
                    console.log("jsonObjs: ", jsonObjs);
                    jsonObjs.forEach(obj => {
                        addNewListElement(root, obj);
                    })
                }

            }

            console.log("finalising: call to fetch has finished ");
        }

    }, 2000);

}


function loadDataFromServerAndCreateList_test(root) {
    setTimeout(() => {
        const req = new XMLHttpRequest();
        req.open("GET", "./data/listitems.json");
        req.send();
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === 200) {
                    const responseText = req.responseText;
                    const responseObjs = JSON.parse(responseText);
                    console.log("Data loaded from server: ", responseObjs);

                    responseObjs.forEach(obj => {
                        addNewListElement(root, obj);
                    });
                } else {
                    console.error("Error loading data from server: ", req.statusText);
                }
            }
        };
    }, 200);
}

function prepareAddingNewLiElements(root) {
    const addAction = root.querySelector("#myapp-add-action");

    addAction.onclick = (evt) => {

        // evt.stopPropagation() — What does it do?
        // When an event happens (like a click), it "bubbles" up through the DOM tree — from the innermost element where it happened up through its ancestors, triggering any event listeners on those ancestors for the same event type.
        // evt.stopPropagation() prevents this bubbling, meaning the event will stop at the current element and won't be triggered on parent elements.
        // Disadvantage: 1 Prevent parent event handlers from running:, 2 Isolate component behavior:  3 Improve user experience:
        // Wenn ein Ereignis (z.B. ein Klick) auf einem Element ausgelöst wird, blubbert es normalerweise nach oben durch die DOM-Hierarchie — also vom innersten Element über die Eltern bis ganz nach oben, und dabei werden alle passenden Event-Handler auf den übergeordneten Elementen ebenfalls ausgeführt.
        // Das bedeutet: Das Ereignis wird nur auf dem aktuellen Element behandelt und nicht weiter an die Eltern weitergegeben.
        // Vorteil: 1 Verhindert das Auslösen von Event-Handlern der Eltern:, 2 Isolation von Komponenten-Verhalten.  3 Verbessert die Nutzererfahrung:
        evt.stopPropagation();
        const newObj = {
            title: "New Object ",
            owner: "placekitten.com",
            added:  new Date().toLocaleDateString("de-DE", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            src: "https://picsum.photos/100/100",
            numOfTags: Math.floor(Math.random() * 100) + 1
        };

        addNewListElement(root, newObj);
    };
}

function addNewListElement(root, obj) {
    console.log("Adding new list element: ", obj);

    const ListRoot = root.querySelector("main ul");

    // ListElementTemplate is a reference to a <template> element in your HTML.
    // The .content property gives you the document fragment inside the template — basically the DOM nodes defined inside the template, but not rendered on the page yet.
    const ListElementTemplate = ListRoot.querySelector("template");

    //  document.importNode(..., true)
    // The method importnode creates a deep clone (copy) of the node you pass it.
    // The first argument is the node to clone (ListElementTemplate.content here).
    // The second argument true means a deep clone (copy all child nodes as well).
    // This lets you create a fresh copy of the template content to use without modifying the original template.
    // .querySelector("li")
    // After cloning, this finds the first <li> element inside the cloned content. So you get the actual <li> element defined inside the template.
    const newLi = document.importNode( ListElementTemplate.content, true).querySelector("li");

    newLi.querySelector("img").src = obj.src;
    newLi.querySelector(".owner").textContent = obj.owner;
    newLi.querySelector(".date").textContent = obj.added;
    newLi.querySelector(".title").textContent = obj.title;
    newLi.querySelector(".tags-value").textContent = obj.numOfTags;

    console.log("newLi: ", newLi);

    ListRoot.appendChild(newLi);
    newLi.scrollIntoView();
}

function prepareRefreshList(root) {

    // reload the windows again and access the designated url address
    // setTimeout( () => {
    //     windows.location = "http://127.0.0.1:8395//data/listitems.json";
    // }, 1000)

    const refreshAction = root.querySelector("#myapp-start-refresh-action");

    refreshAction.onclick = (evt) => {
        // evt.stopPropagation() — What does it do?
        // When an event happens (like a click), it "bubbles" up through the DOM tree — from the innermost element where it happened up through its ancestors, triggering any event listeners on those ancestors for the same event type.
        // Wenn ein Ereignis (z.B. ein Klick) auf einem Element ausgelöst wird, blubbert es normalerweise nach oben durch die DOM-Hierarchie — also vom innersten Element über die Eltern bis ganz nach oben, und dabei werden alle passenden Event-Handler auf den übergeordneten Elementen ebenfalls ausgeführt.
        // evt.stopPropagation() prevents this bubbling, meaning the event will stop at the current element and won't be triggered on parent elements.
        // Das bedeutet: Das Ereignis wird nur auf dem aktuellen Element behandelt und nicht weiter an die Eltern weitergegeben.
        evt.stopPropagation();
        const ListRoot = root.querySelector("main ul");
        //const ListElementTemplate = ListRoot.querySelector("template");

        // remove all list items
        const listItems = ListRoot.querySelectorAll("li");
        listItems.forEach(item => {
            ListRoot.removeChild(item);
        });

        loadDataFromServerAndCreateList(root);
    }
}
