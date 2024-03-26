const addOptionBtns = document.getElementsByClassName("add-option-btn");

for(const addOptionBtn of addOptionBtns){
    addOptionBtn.addEventListener("click", (event) => {
        const qid = addOptionBtn.getAttribute("data-qid");
        document.getElementById("qId").value = qid;
    })
}

// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

(() => {
    // Get the accordion items
var accordionItems = document.querySelectorAll('.accordion-item');

// Loop through each item
accordionItems.forEach(function(item, index) {
    // Get the collapse element
    var collapse = item.querySelector('.accordion-collapse');

    // Check if there's a cookie for this item
    var cookieName = 'accordionItem' + index;
    var cookieValue = getCookie(cookieName);
    if (cookieValue === 'collapsed') {
        collapse.classList.remove('show');
    }

    // Add event listener to track accordion state changes
    collapse.addEventListener('shown.bs.collapse', function () {
        setCookie(cookieName, 'expanded', 30);
    });
    collapse.addEventListener('hidden.bs.collapse', function () {
        setCookie(cookieName, 'collapsed', 30);
    });
});    
})();

