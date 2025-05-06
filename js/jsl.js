class ViewController {
    constructor() {
        console.log("Constructor called");
    }

    oncreate() {
        // here, the view will be initialised
        this.prepareViewSwitching();
        this.prepareFading();
        this.prepareListitemSelection();
        this.prepareAddingNewLiElements();
        this.loadDataFromServerAndCreateList();
    }

    prepareViewSwitching() {
        const switchViewAction = this.root.getElementsByTagName('header')[0];
        const switchViewTarget = this.root;

        switchViewAction.onclick = function () {
            switchViewTarget.classList.toggle('myapp-tiles');
        }
    }

    prepareFading() {
        // this.root.getElementsById does not exist, because getElementsById is not a method of the root element, it is a method of the document object. document.getElementsById  works
        // always return the first element with the specified id
        const startFadingAction = this.root.querySelector('#myapp-start-fading-action');
        const fadingTarget = this.root.getElementsByTagName('main')[0];

        startFadingAction.onclick = () => {
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
            // use Eventlisten to implement the same function as above
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
            alert("slected:" + currentLi.querySelector("h2").textContent);
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
        const newLi =  document.importNode(this.ListElementTemplate.content, true).querySelector("li"); // clone the template element
        console.log("newLi: " +newLi);
        newLi.querySelector("img").src = obj.src;
        newLi.querySelector("h2").textContent = obj.title;

        this.ListRoot.appendChild(newLi);
        newLi.scrollIntoView();
        
        // This is all implementation of Data binding: use data binding to bind the data to the view

    }

    loadDataFromServerAndCreateList() {
        //
        // setTimeout( () => {
        //     windows.location = "http://192.168.13.48:8395/data/listitems.json";
        // }, 1000)

        // delay 5 seconds , then send a request to the server
        setTimeout( () => {
                const req= new XMLHttpRequest();
                req.open("GET", "./data/listitems.json", );
                req.send();
                req.onreadystatechange = () => {
                    if (req.readyState === XMLHttpRequest.DONE) {
                        if (req.status === 200) {
                            const responseText = req.responseText;
                            alert("response: " + responseText);
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
            }, 2000)






    }



}

window.onload = () => {

    const vc = new ViewController();
    vc.root = document.body; /* set the root arrtibute of vc object , is document body element*/

    vc.oncreate();
}

