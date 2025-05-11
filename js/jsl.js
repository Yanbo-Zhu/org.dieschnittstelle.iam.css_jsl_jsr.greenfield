

//import { loadDataFromServerAndCreateList } from './jsr.js';

class ViewController {
    constructor() {
        console.log("Constructor called");
    }

    oncreate() {
        // here, the view will be initialised
        this.prepareViewSwitching();
        //this.prepareFading();
        this.prepareListitemSelection();
        this.prepareAddingNewLiElements();
        console.log("now data loading");
        this.loadDataFromServerAndCreateList();
        console.log("evething has been loaded");
    }

    prepareViewSwitching() {
        //const switchViewElement = this.root.getElementsByTagName('header')[0];

        const switchViewElement = this.root.querySelector("#viewSwitcher");
        const switchViewTarget = this.root;

        const fadingTarget = this.root.getElementsByTagName('main')[0];

        // get the fading transition duration from the css file
        //const fadingDuration = getComputedStyle(fadingTarget).transitionDuration; // get the transition duration from the css file = 1s, not 2s.
        const rootStyles = getComputedStyle(document.documentElement);
        const fadingDuration = parseFloat(rootStyles.getPropertyValue('--myapp-fading-transition-duration').trim());
        console.log("fadingDuration: " + Number(fadingDuration));

        switchViewElement.onclick = function () {

            fadingTarget.classList.toggle('myapp-faded');

            fadingTarget.addEventListener('transitionend', () => {
                fadingTarget.classList.toggle('myapp-faded');
            }, {once: true}); // remove the event handler after it is called once

            setTimeout(() => {
                switchViewTarget.classList.toggle('myapp-tiles');

                // Icon für Kachel- bzw. Listenansicht wird angepasst
                if (switchViewElement.classList.contains("myapp-img-tile")) {
                    switchViewElement.classList.replace("myapp-img-tile", "myapp-img-list");
                } else if (switchViewElement.classList.contains("myapp-img-list")) {
                    switchViewElement.classList.replace("myapp-img-list", "myapp-img-tile");
                }
            }, fadingDuration * 1000); // wait for the transition to finish before switching the view

        }


    }

    prepareFading() {
        // this.root.getElementsById does not exist, because getElementsById is not a method of the root element, it is a method of the document object. document.getElementsById  works
        // always return the first element with the specified id
        //const startFadingAction = this.root.querySelector('#myapp-start-fading-action');



        const startFadingAction = this.root.querySelector("#viewSwitcher");

        const fadingTarget = this.root.getElementsByTagName('main')[0];

        startFadingAction.onclick = () => {

            // refresh button: nicht neu laden . sondern list loschen, und dann bauen eine list ();   ul element , nochmals datan fetchen and data einspielen
            //window.location = "http://141.64.196.6:8396".  (das erwarte ich nicht, da es ganz Seite refresht.)

            //alert("Fading started");
            fadingTarget.classList.toggle('myapp-faded');

            // variant 1: setTimeout`
            // Problem: Dass die beiden Zeiteinheiten in unterschiedlichen Umgebungen festgelegt werden. css selector .myapp-faded und hier in js
            // setTimeout(function () {
            //     fadingTarget.classList.toggle('myapp-faded');
            // }, 3000);

            // variant 2: use transitionend event
            // when the transition ends, the event is fired. This transition is immer periodisch aufgelöst/angestosst. weil die Transition immer wieder endet.  Das event heisst transition-end
            // fadingTarget.ontransitionend = () => {
            //     fadingTarget.classList.toggle('myapp-faded');
            //     fadingTarget.ontransitionend = null;  // remove the event handler, so it is only called once
            // }

            // variant 3: use Eventlisten to implement the same function as above

            fadingTarget.addEventListener('transitionend', () => {
                fadingTarget.classList.toggle('myapp-faded');
            }, {once: true}); // remove the event handler after it is called once

        }


    }

    prepareListitemSelection() {
        const lis = this.root.getElementsByTagName("li");

        // do not use var to declare currentLi in the for loop, because it will create a closure and the value of i will be the last value of the loop
        // var creates a function scope, so the value of i will be the last value of the loop
        // let and const create a block scope, so the value of i will be the value of the loop at the time the function is called

        // variant 1: use var to declare currentLi in the for loop
        // for (let i = 0; i < lis.length; i++) {
        //     let currentLi = lis[i];
        //     currentLi.onclick = () => {
        //         alert("Selected:" + currentLi.querySelector("h2").textContent);
        //     };
        // }

        // variant 2: use forEach to iterate over the list items
        // this.root.querySelectorAll("main li")
        //     .forEach(currentLi => {
        //             currentLi.onclick = () => {
        //                 alert("Selected:" + currentLi.querySelector("h2").textContent);
        //
        //             }
        //         }
        //     );

        // variant 3: use event bubbling to handle the click event on the parent element
        const LiRoot = this.root.querySelector("main ul");

        LiRoot.onclick = (evt) => {
            //let currentLi = evt.target;
            let currentLi = evt.target.closest("li"); // closest will find the closest ancestor of the element that matches the selector
            console.log(currentLi);

            if (evt.target.classList.contains("myapp-img-option")) {
                const title = currentLi.querySelector("h2").textContent;
                const owner = "yzh"

                alert("slected: " + title + " " + owner);

            } else {
                const title = currentLi.querySelector("h2").textContent;
                alert("slected: " + title);
            }

        }
    }

    prepareAddingNewLiElements() {
        const addAction = this.root.querySelector("#myapp-add-action");

        this.ListRoot = this.root.querySelector("main ul");
        this.ListElementTemplate = this.ListRoot.querySelector("template") // get the first li element as a template for the new li elements

        // this.ListElementTemplate.classList.remove('.myapp-template');
        // this.ListElementTemplate.parentNode.removeChild(this.ListElementTemplate); // remove the template element from the list, so it is not displayed in the list

        // to see the flackern effect
        // setTimeout( () => {
        //     this.ListElementTemplate.parentNode.removeChild(this.ListElementTemplate); // remove the template element from the list, so it is not displayed in the list
        //     this.ListElementTemplate.classList.remove('.myapp-template');
        // }, 2000)

        addAction.onclick = (evt) => {
            evt.stopPropagation(); // stop the event from bubbling up to the parent element
            //alert("Adding new li element");
            const newObj = {
                title: "New Object " + Date.now(),
                src: "data/iaming/200_150_adispicing.jpg",
            }

            this.addNewListElement(newObj)
        }
    }

    addNewListElement(obj) {
        console.log("Adding new list element: ", obj);

        // A) Element as strings: missing separation of concerns, difficult ro read.
        // inefficient because browser has to  create the whole list with all li elements again
        // const newLi = `<li><img src="${obj.src}" class="myapp-align-left"/><h2>${obj.title}</h2><button class="myapp-img-edit myapp-imgbutton myapp-align-right"></button></li>`;
        //
        //
        // const ListRoot = this.root.querySelector("main ul");
        // ListRoot.innerHTML += newLi; // append the new li element to the list

        // B) Element as objects: better separation of concerns, easier to read, more efficient
        // elements with DOM API and createElement(): more effient, because the browser does not have to create the whole list again. but still kind of intransparent
        // const newLi = document.createElement("li");
        //
        // const img  = document.createElement("img");
        // newLi.appendChild(img);
        // img.src = obj.src;
        // img.classList.add("myapp-align-left");
        //
        // const h2 = document.createElement("h2");
        // newLi.appendChild(h2);
        // h2.textContent = obj.title;
        // h2.classList.add("myapp-align-left");
        //
        // const button = document.createElement("button");
        // newLi.appendChild(button);
        // button.setAttribute("class", "myapp-img-edit myapp-imgbutton myapp-align-right");
        //
        // this.ListRoot.appendChild(newLi);

        // C) Dolly-Verfahren: use a template to create the new li element. This is the best way to create new elements, because it is easy to read and maintain.
        // // efficient, because the browser does not have to create the whole list again. The template is a hidden element that is used to create new elements. The template is cloned and the data is bound to the new element. This is the best way to create new elements, because it is easy to read and maintain.
        // But Reinvention of the wheel: we have to implement the data binding ourselves. We have to bind the data to the new element. This is not a good way to create new elements, because it is not easy to read and maintain.

        // const newLi = this.ListElementTemplate.cloneNode(true); // clone the template element
        // console.log(newLi);
        // newLi.querySelector("img").src = obj.src;
        // newLi.querySelector("h2").textContent = obj.title;

        // D) Standerd Html templates
        const newLi = document.importNode(this.ListElementTemplate.content, true).querySelector("li"); // clone the template element
        console.log("newLi: " + newLi);
        newLi.querySelector("img").src = obj.src;
        newLi.querySelector("h2").textContent = obj.title;

        this.ListRoot.appendChild(newLi);
        newLi.scrollIntoView();

        // This is all implementation of Data binding: use data binding to bind the data to the view

    }

    async loadDataFromServerAndCreateList_test() {

        // reload the windows again and access the designated url address
        // setTimeout( () => {
        //     windows.location = "http://192.168.13.48:8395/data/listitems.json";
        // }, 1000)

        // delay 5 seconds , then send a request to the server
        setTimeout(async () => {


            // variant 1: use XMLHttpRequest to load the data from the server
            // const req = new XMLHttpRequest();
            // req.open("GET", "./data/listitems.json",);
            // req.send();
            // console.log("send has been called .. ")
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
            // req.onreadystatechange = () => {
            //
            //     // if (req.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            //     //     console.log("request state changed: " + req.readyState);
            //     // }
            //     // else if (req.readyState === XMLHttpRequest.LOADING) {
            //     //     console.log("req.responseText: " + req.responseText);
            //     // }
            //     // else if (req.readyState === XMLHttpRequest.DONE) {
            //     //     // jede readyState ist eine Zahl von 0 bis 4.  0 = unsent, 1 = opened, 2 = headers received, 3 = loading, 4 = done
            //     //
            //     //     console.log("request state changed: " + req.readyState);
            //     //     if (req.status === 200) {
            //     //         console.log("received response with request status: " + req.status);
            //     //         const responseText = req.responseText;
            //     //         // alert("response: " + responseText);
            //     //         const responseObjs = JSON.parse(responseText);
            //     //         console.log("Data loaded from server: ", responseObjs);
            //     //
            //     //         // create the list with the data
            //     //         responseObjs.forEach(obj => {
            //     //             this.addNewListElement(obj);
            //     //         });
            //     //     } else {
            //     //         console.error("Error loading data from server: ", req.statusText);
            //     //     }
            //     // }
            //
            //
            //     // Semantisch: hier ist event handler/ event lister (eine spezifische event listen  ) for the request . event is load
            //     // Strukturtisch:  ist  an callback function, because it is called when the event is fired
            //     // Syntaktische ist eine lambda function
            //     req.onload = () => {
            //         if (req.status === 200) {
            //             console.log("received response with request status: " + req.status);
            //             const responseText = req.responseText;
            //             // alert("response: " + responseText);
            //             const responseObjs = JSON.parse(responseText);
            //             console.log("Data loaded from server: ", responseObjs);
            //
            //             // create the list with the data
            //             responseObjs.forEach(obj => {
            //                 this.addNewListElement(obj);
            //             });
            //         }
            //     }
            //
            //     console.log("finalisering");}


            // variant 2: use fetch to load the data from the server

            // promise-based API: promise is an object that represents the result of an asynchronous operation.
            // promise has three states:
            // pending: the initial state, neither fulfilled nor rejected
            // fulfilled: meaning that the operation was completed successfully
            // rejected: meaning that the operation failed

            // const resPromise = fetch("./data/listitems.json");
            // console.log("res: ",resPromise);
            // // res is a promise, so we can use then() to handle the response
            // // then is a method of the promise object that takes a callback function as an argument
            // resPromise.then(response => {
            //     // console.log("response: ", response);
            //     // const  responseTextPromise = response.text();
            //     // console.log("responseTextPromise: ", responseTextPromise);
            //     //
            //     // responseTextPromise.then( responseText  => {
            //     //     console.log("responseText: ", responseText);
            //     //
            //     //     const responseObjs = JSON.parse(responseText);
            //     //     console.log("Data loaded from server: ", responseObjs);
            //     //     // create the list with the data
            //     //     responseObjs.forEach(obj => {
            //     //         this.addNewListElement(obj);
            //     //     });
            //     // })
            //
            //     // response.json() returns a promise, so we can use then() to handle the response
            //     // why only jsonObjs, only one argument ?
            //     // because the response.json() method returns a promise that resolves to the result of parsing the body text as JSON
            //     // const responseJsonPromise = response.json();
            //     // responseJsonPromise.then( jsonObjs  => {
            //     //     console.log("jsonObjs: ", jsonObjs);
            //     //     // create the list with the data
            //     //     jsonObjs.forEach(obj => {
            //     //         this.addNewListElement(obj);
            //     //     });
            //     // })
            //
            //
            //
            // })

            // in promises then function,  why only one argument in the call function
            //  In a .then() function of a Promise, the callback receives only one argument because that argument represents the result of the previous promise — typically either: the fulfilled value (e.g., a Response object from fetch)  or, in a .then() chain, the return value from the previous .then()
            // fetch("./data/listitems.json")
            //     .then(res => res.json())
            //     .then(jsonObjs => jsonObjs.forEach(obj => this.addNewListElement(obj)));


            // variant 3: use async/await to load the data from the server
            // async/await is a syntactic sugar over promises, making asynchronous code look synchronous
            const res = await fetch("./data/listitems.json");
            console.log(res);
            const jsonObjs = await res.json();
            console.log("jsonObjs: ", jsonObjs);
            jsonObjs.forEach(obj => {
                this.addNewListElement(obj);
            })

            console.log("finalisering: call to fetch has finisched ");
            alert("fetch has been called .. ");

        }, 200);




    }

    async loadDataFromServerAndCreateList() {

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
            const fetch_use_async_await = false;
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
                                    this.addNewListElement(obj);
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
                                this.addNewListElement(obj);
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
                                        this.addNewListElement(obj);
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
                                        this.addNewListElement(obj);
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
                                        this.addNewListElement(obj);
                                    });
                                })
                        } else if (fetch_use_responseTextPromise_or_responseJsonPromise === "responseJsonPromise") {

                            // variant 2.2.2: use response.json() to get the response json
                            fetch(dataUrl)
                                .then(res => res.json())
                                .then(jsonObjs => jsonObjs.forEach(obj => this.addNewListElement(obj)));
                        }
                    }

                } else {

                    // variant 2.3: use async/await to load the data from the server
                    // async/await is a syntactic sugar over promises, making asynchronous code look synchronous
                    const res = await fetch(dataUrl);
                    console.log("res: ", res);
                    const jsonObjs = await res.json();
                    console.log("jsonObjs: ", jsonObjs);
                    jsonObjs.forEach(obj => {
                        this.addNewListElement(obj);
                    })

                }

                console.log("finalising: call to fetch has finisched ");
                //alert("fetch has been called .. ");
            }


        }, 2000);

    }
}

window.onload = () => {

    const vc = new ViewController();
    vc.root = document.body; /* set the root arrtibute of vc object , is document body element*/

    vc.oncreate();
}

