

function getHumanDate(date) {
    const thisDate = new Date(date);
    return `${thisDate.getMonth()}/${thisDate.getDate()}/${thisDate.getFullYear()} - ${thisDate.getHours() > 12 ? thisDate.getHours() - 12 : thisDate.getHours()}:${thisDate.getMinutes()} ${thisDate.getHours() > 12 ? 'PM' : 'AM'}`

}

function loadChart(data) {
    console.log(data.map);
    console.log(data.map((element) => { return getHumanDate(element.time) }))
    console.log(data.map((element) => { return element.weight }))

    var chartData = {
        labels: data.map( (element) => { return getHumanDate(element.time) } ),
        series: [data.map( (element) => { return element.weight })]
    }

    new Chartist.Line('.ct-chart', chartData);
}

function getData() {

    let userID = window.location.pathname;
    userID = userID.slice(8);

    const url = `/people/${userID}/raw`;
    const request = new XMLHttpRequest();
    request.open('GET', url);

    request.addEventListener('load', (event) => {
        data = JSON.parse(event.target.response);
        loadChart(data);
    });

    request.send();

}

getData();
