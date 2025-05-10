
function loadDataFromServerAndCreateList(root) {
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
    }, 2000);
}

function prepareAddingNewLiElements(root) {
    const addAction = root.querySelector("#myapp-add-action");

    addAction.onclick = (evt) => {
        evt.stopPropagation();
        const newObj = {
            title: "New Object " + Date.now(),
            src: "data/iaming/200_150_adispicing.jpg",
        };

        addNewListElement(root, newObj);
    };
}

function addNewListElement(root, obj) {
    console.log("Adding new list element: ", obj);

    const ListRoot = root.querySelector("main ul");
    const ListElementTemplate = ListRoot.querySelector("template");

    const newLi = document.importNode( ListElementTemplate.content, true).querySelector("li");
    console.log("newLi: ", newLi);
    newLi.querySelector("img").src = obj.src;
    //newLi.querySelector("#title").textContent = obj.title;

    ListRoot.appendChild(newLi);
    newLi.scrollIntoView();
}
