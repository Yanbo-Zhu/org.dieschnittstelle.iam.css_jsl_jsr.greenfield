
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
        const xmlHttpRequest_onreadystatechange_or_onload = "onload";
        const fetch_use_async_await = true;
        const fetch_use_then_chain = false;
        const fetch_use_responseTextPromise_or_responseJsonPromise = "responseTextPromise";

        if (xmlHttpRequest_or_fetch === "xmlHttpRequest") {
            //variant 1: use XMLHttpRequest to load the data from the server
            const req = new XMLHttpRequest();
            req.open("GET", dataUrl);
            req.send();
            console.log("xmlHttpRequest send has been executed .. ")

            if (xmlHttpRequest_onreadystatechange_or_onload === "onreadystatechange") {

                // req.onreadystatechange = () => {}
                // Semantisch: hier ist event handler/ event lister (eine spezifische event listen  ) for the request . event is load
                // Strukturtisch:  ist  an callback function, because it is called when the event is fired
                // Syntaktische ist eine lambda function

                //variant 1.1: use req.onreadystatechange to handle the response
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
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
                // variant 1.2: use req.onload to handle the response
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
            // promise has three states:
            // pending: the initial state, neither fulfilled nor rejected
            // fulfilled: meaning that the operation was completed successfully
            // rejected: meaning that the operation failed

            // the fetch method returns a promise that resolves to the Response object representing the response to the request. the response variable take the response of request. The then() method is called with this Response object as its argument.
            // The Response object contains the response data, including the status code and the response body.


            if (!fetch_use_async_await) {
                if (!fetch_use_then_chain) {

                    // variant 2.1: Do not use then chain to load the data from the server step by step

                    // resPromise is a promise, so we can use then() to handle the response
                    const resPromise = fetch(dataUrl);
                    console.log("res: ",resPromise);

                    resPromise.then(response => {
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

                            // variant 2.1.2: use response.json() to get the response json
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

                    // variant 2.2: use then chain to load the data from the server step by step
                    // then() chain to hande the response which is obtained the fetch method

                    if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseTextPromise") {

                        // variant 2.2.1: use response.text() to get the response text
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

                        // variant 2.2.2: use response.json() to get the response json
                        fetch(dataUrl)
                            .then(res => res.json())
                            .then(jsonObjs => jsonObjs.forEach(obj => addNewListElement(root, obj)));
                    }
                }

            } else {

                // variant 2.3: use async/await to load the data from the server
                // async/await is a syntactic sugar over promises, making asynchronous code look synchronous
                const res = await fetch(dataUrl);
                console.log("res: ", res);

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
    const ListElementTemplate = ListRoot.querySelector("template");

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
