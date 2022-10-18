
function setClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

async function getData(ID) {
    fetch(`/getData${ID}`)
    .then((res) => res.json())
    .then((service) => {
        // document
        document.getElementById("hyperlink_edit").value = `${service.hyperlink}`
        document.getElementById("name_edit").value = `${service.name}`
        document.getElementById("hostname_edit").value = `${service.hostname}`
        document.getElementById("ip_addr_edit").value = `${service.ip_addr}`
        document.getElementById("username_edit").value = `${service.username}`
        document.getElementById("password_edit").value = `${service.password}`
        document.getElementById("editForm").action = `/editService${service.app_id}`
    })
    .catch(error => {
        console.log(error)
    })
}

function prep_deleteService(ID) {
    document.getElementById("divToDeleteService").innerHTML = `<button onclick="deleteService(${ID})" class="btn btn-danger" style="width: 100%;">YES</button>`
}

function pageReload() {
    location.reload()
}

async function deleteService(ID) {
    await fetch(`/deleteService${ID}`);
    setTimeout(pageReload, 1500)
}
