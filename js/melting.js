const bullets = {
    volvo: 1,
    ford: 5,
    fiat: 12,
    golf: 21,
    porsche911: 33,
    golf3: 47,
    vw: 64,
    renault: 83,
    alfa: 105,
    audi: 130,
    lambo: 157,
    carrera: 187,
    ferrari: 220,
    custom: 220,
}

const carNames = {
    "Volvo 440 GL": "volvo",
    "Volvo S60": "volvo",
    "Ford focus 2015": "ford",
    "Ford focus": "ford",
    "Fiat 500 Abarth": "fiat",
    "Fiat Punto": "fiat",
    "Volkswagen Golf cabrio": "golf",
    "Volkswagen Golf": "golf",
    "Porsche 911 cabrio": "porsche911",
    "Porsche 911": "porsche911",
    "Volkswagen Golf III GTI": "golf3",
    "Volkswagen Golf III": "golf3",
    "VW Passat": "vw",
    "VW Polo": "vw",
    "Renault Megane R.S": "renault",
    "Renault Clio Sport": "renault",
    "Alfa Romeo 33 Stradale": "alfa",
    "Alfa Romeo GT": "alfa",
    "Audi A8": "audi",
    "Audi TT": "audi",
    "Lamborghini Gallardo": "lambo",
    "Lamborghini Miura": "lambo",
    "Porsche Carrera GT": "carrera",
    "Porsche Carrera 4S": "carrera",
    "Ferrari GTO 250": "ferrari",
    "Ferrari Enzo": "ferrari",
}

function calculateFromPoints() {
    const pricePerPointInput = document.getElementById("pricePerPoint");
    const pricePerBulletInput = document.getElementById("pricePerBulletPoints");

    if (!pricePerPointInput || !pricePerBulletInput) {
        return;
    }

    const pricePerPoint = parseInt(filterNumbers(pricePerPointInput.value));
    const pricePerBullet = Math.round((pricePerPoint * 15) / 1000);
    const pricePerBulletUsd = pricePerBullet.toLocaleString("en", {style:'currency', currency:'USD', maximumFractionDigits: 0});

    pricePerBulletInput.innerText = `It costs ${pricePerBulletUsd} per bullet to buy with points.`
    pricePerBulletInput.hidden = false;
}

function calculateFromCar() {
    const carInput = document.getElementById("car");
    const damageInput = document.getElementById("damage");
    const priceInput = document.getElementById("price");
    const pricePerBulletResult = document.getElementById("pricePerBulletCar");

    if (!carInput || !damageInput || !priceInput || !pricePerBulletResult) {
        return;
    }

    const car = carInput.value;
    const damage = parseInt(filterNumbers(damageInput.value));
    const price = parseInt(filterNumbers(priceInput.value));
    const bullets = calcBullets(car, damage);
    const pricePerBulletUsd = costFromCar(bullets, price);

    pricePerBulletResult.innerText = `It costs ${pricePerBulletUsd} per bullet melting the selected car`;
    pricePerBulletResult.hidden = false;
}

function calcBullets(car, damage) {
    return Math.ceil((100 - damage) * bullets[car] / 100);
}

function costFromCar(bullets, price) {
    const pricePerBullet = Math.round(price / bullets);
    return formatUsd(pricePerBullet);
}

function formatUsd(price) {
    return price.toLocaleString("en", {style:'currency', currency:'USD', maximumFractionDigits: 0});
}

function filterNumbers(input) {
    return input.toString().replaceAll(/[^0-9]/g, "");
}

function parseBulk() {
    const bulkInput = document.getElementById("carPrices");
    const bulkResult = document.getElementById("bulkResults");
    const bulkResultBody = document.getElementById("bulkResultsBody");

    bulkResultBody.innerHTML = "";

    if (!bulkInput || !bulkResult || !bulkResultBody) {
        return;
    }

    let carEntries = [];

    const pattern = /^\s*([a-zA-Z0-9]+( [a-zA-Z0-9.]+)*)\s*([0-9]+%) damage\s*\$([0-9,]+)\s*$/
    for (const line of bulkInput.value.toString().split("\n")) {
        const match = pattern.exec(line);
        if (match) {
            const carName = match[1];
            const car = carNames[carName];
            const damage = parseInt(filterNumbers(match[3]));
            const price = parseInt(filterNumbers(match[4]));
            const bullets = calcBullets(car, damage);
            const costPerBullet = Math.round(price / bullets);
            const entry = {
                car: carName,
                damage,
                price,
                bullets,
                costPerBullet
            };
            carEntries.push(entry);
        }
    }

    carEntries = carEntries.sort((a, b) => a.costPerBullet - b.costPerBullet);
    for (const entry of carEntries) {
        const row = document.createElement("tr");
        const carTd = document.createElement("td");
        carTd.innerText = entry.car;
        row.appendChild(carTd);
        const damageTd = document.createElement("td");
        damageTd.innerText = `${entry.damage}%`;
        row.appendChild(damageTd);
        const priceTd = document.createElement("td");
        priceTd.innerText = formatUsd(entry.price);
        row.appendChild(priceTd);
        const bulletsTd = document.createElement("td");
        bulletsTd.innerText = entry.bullets.toString();
        row.appendChild(bulletsTd);
        const costTd = document.createElement("td");
        costTd.innerText = formatUsd(entry.costPerBullet);
        row.appendChild(costTd);
        bulkResultBody.appendChild(row);
    }

    bulkResult.hidden = false;
}
