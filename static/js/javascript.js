let init = {
    prevPage: "",
    nextPage: "",
    findApi: function (url) {
        fetch(url)
            .then((response) => response.json())
            .then((response) => {
                init.prevPage = response['previous']
                if (!init.prevPage) document.querySelector('#prev').setAttribute('disabled', 'true')
                else document.querySelector('#prev').removeAttribute('disabled')
                init.nextPage = response['next']
                if (!init.nextPage) document.querySelector('#next').setAttribute('disabled', 'true')
                else document.querySelector('#next').removeAttribute('disabled')
                init.fillTable(response)
            })
    },

    fillTable: function (response) {
        let table = document.querySelector('#baseTable')
        table.innerHTML = ""
        let headers = ["name", "diameter", "climate", "terrain", "surface_water", "population", "residents"]
        for (record of response.results) {
            let newTr = document.createElement("tr")
            table.appendChild(newTr)
            for (header of headers) {
                let newTd = document.createElement("td")
                let text = record[header]
                if (header == 'diameter') {
                    text = init.numberWithCommas(text) + " km"
                } else if (header == "surface_water") {
                    if (text != 'unknown') text = text + '%'
                } else if (header == "population") {
                    if (text != 'unknown' && text != '0') text = init.numberWithCommas(text) + " people"
                } else if (header == "residents" && text.length > 0) {
                    newTd.insertAdjacentHTML("afterbegin", `<button type="button" class="btn btn-light" data-toggle="modal" 
                                                            data-target="#exampleModal" data-id="${record['name']}">
                                                            ${text.length} resident(s) </button>`)
                } else if (header == "residents" && text.length == 0) {
                    newTd.textContent = "No known residents"
                }
                if (header != "residents") {
                    newTd.textContent = text
                }
                newTr.appendChild(newTd)
            }
        }
        init.addEventToButtons(response.results)
    },
    addEventToButtons: function (data) {
        let buttons = document.querySelectorAll(".btn-light")
        for (button of buttons) {
            let planet = button.dataset.id
            button.addEventListener('click', () => init.modalModifier(planet, data))

        }
    },

    modalModifier: function (planet, data) {
        let title = document.querySelector('.modal-title')
        let body = document.querySelector('.modal-body')
        title.innerHTML = "Residents of " + planet
        let table = document.querySelector('#modalTableBody')
        table.innerHTML = ""
        for (i of data) {
            if (i['name'] == planet) {
                for (j of i['residents']) {
                    fetch(j)
                        .then((response) => response.json())
                        .then((response) => {

                            init.fillModalTable(response)
                        })
                }
            }
        }
    },

    fillModalTable: function (response) {
        console.log(response)
        let table = document.querySelector('#modalTableBody')
        let headers = ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender"]
        let newTr = document.createElement("tr")
        table.appendChild(newTr)
        for (header of headers) {
            let newTd = document.createElement("td")
            let text = response[header]
            newTd.textContent = text
            newTr.appendChild(newTd)``
        }
    },

    numberWithCommas: function (x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x;
    },

    switchPage: function () {
        let prevBtn = document.querySelector('#prev')
        let nextBtn = document.querySelector('#next')
        prevBtn.addEventListener("click", () => init.findApi(init.prevPage))
        nextBtn.addEventListener("click", () => init.findApi(init.nextPage))
    }
}


init.findApi('https://swapi.dev/api/planets/')
init.switchPage()