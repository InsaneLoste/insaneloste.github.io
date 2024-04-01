// Generate a random number between 1 and 27876 (both included)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function getAnchor() {
    // Get the index entered by the user
    //const index = parseInt(document.getElementById("indexInput").value);
	
    // const index = getRandomNumber(1, 27876);
	const index = getRandomNumber(1, 15000);

    // Get the <ol> element
    const olElement = document.getElementById("myList");

    // Get the <li> element at the specified index
    const liElement = olElement.querySelectorAll("li")[index - 1];

    // Get the <a> element within the selected <li>
    const anchor = liElement.querySelector("a");

    return {"index": index, "li": liElement.innerHTML, "anchor": anchor}
}

let n_powers_probs = {
    // 1: 0.25,
    // 2: 0.65,
    // 3: 0.85,
    // 4: 0.95,
    // 5: 1.0,
	1: 1.0 // always one power only
}

function getPowers() {
    var rnd = Math.random();
    for (var power in n_powers_probs) {
        if (rnd < n_powers_probs[power]) {
            n_powers = power;
            break;
        }
    }

    var indexes = [];
    var anchors = [];
    var lis = [];

    for (var i = 0; i < n_powers; i++) {
        var result = getAnchor();
        var anchor = result.anchor;
        var index = result.index;
        var li = result.li;

        if (indexes.indexOf(index) == -1) {
            indexes.push(index);
            anchors.push(anchor);
            lis.push(li);
        } else {
            i--;
        }       
        
    }

    var promises = [];

    for (var i = 0; i < lis.length; i++) {
        var capabilitiesPromise = fetchAndProcess("Capabilities", lis[i], indexes[i]);
        var limitationsPromise = fetchAndProcess("Limitations", lis[i], indexes[i]);

        promises.push(capabilitiesPromise, limitationsPromise);
    }

    function fetchAndProcess(type, li, index) {
        var file = "all_pages/" + index + "_" + type.toLowerCase() + ".html";
    
        return fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                if (type == "Capabilities") {
                    return "<h3>" + li + "</h3>" + "<h4>" + type + "</h4>" + data;
                }
                else {
                    return "<h4>" + type + "</h4>" + data;
                }
            });
    }

    Promise.all(promises)
        .then(outputs => {
            document.getElementById("output").innerHTML = "<hr/>" + outputs.join("");
        })
        .catch(error => {
            console.error('There was a problem:', error);
        });

}
  
// Listen for Enter key press on the input field
const inputField = document.getElementById("indexInput");
inputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getAnchor();
    }
});


