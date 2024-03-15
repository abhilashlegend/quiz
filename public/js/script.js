const addOptionBtns = document.getElementsByClassName("add-option-btn");

for(const addOptionBtn of addOptionBtns){
    addOptionBtn.addEventListener("click", (event) => {
        const qid = addOptionBtn.getAttribute("data-qid");
        document.getElementById("qId").value = qid;
    })
}

