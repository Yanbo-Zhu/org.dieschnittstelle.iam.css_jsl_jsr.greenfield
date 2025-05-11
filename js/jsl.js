

//import { loadDataFromServerAndCreateList, prepareAddingNewLiElements} from './jsr.js';

class ViewController {
    constructor() {
        console.log("Constructor called");
    }

    oncreate() {
        // here, the view will be initialised
        this.prepareViewSwitching();
        //this.prepareFading();
        this.prepareListitemSelection();
        loadDataFromServerAndCreateList(this.root)
        prepareAddingNewLiElements(this.root);
        prepareRefreshList(this.root);
    }

    prepareViewSwitching() {
        //const switchViewElement = this.root.getElementsByTagName('header')[0];

        const switchViewElement = this.root.querySelector("#myapp-start-view-switch-action");
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

        const startFadingAction = this.root.querySelector("#myapp-start-view-switch-action");

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
            const title = currentLi.querySelector(".title").textContent;
            const src = currentLi.querySelector("img").src

            if (evt.target.classList.contains("myapp-img-option")) {

                const confirmation = confirm(
                    "Please confirm whether you want to delete this item\n\n" +
                    "Titel: " + title + "\n" +
                    "URL: " + src
                );
                if (confirmation) {
                    // Element aus der Liste entfernen
                    currentLi.remove();
                }
            } else {
                alert("Title: " + title);
            }

        }
    }




}

window.onload = () => {

    const vc = new ViewController();
    vc.root = document.body; /* set the root arrtibute of vc object , is document body element*/

    vc.oncreate();
}

