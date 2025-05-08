//

export function loadDataFromServerAndCreateList() {
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
    }, 2000)

}

// class loadNewItems {
//     constructor() {
//         console.log("Constructor called");
//     }
//
// }

