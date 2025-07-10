import { faBuildingColumns, faCloudSun, faPiggyBank, faTree, IconDefinition } from "@fortawesome/free-solid-svg-icons";

export class Plan {
    key: string;
    title: string;
    colors: Colors;
    averageTemperature: number;
    totalDuration: number;
    countries: [{ code: string, label: string }];
    start: Date;
    end: Date;
    averagePrices: AveragePrices;
    outboundTravel: Travel;
    returnTravel: Travel;
    rentCarDays: number;
    extras: Extra[];
    costs: Costs;
    persons: number;
    program: Day[];
    points: Points;
    pro: string[];
    cons: string[];
    meta: Meta;
    links: Link[];

    public static calcCosts(plan: Plan): Costs {
        let extrasCost = -1;
        if (plan.extras) {
            extrasCost = 0;
            plan.extras.forEach(e => {
                extrasCost += e.price;
            });
        }
        let internalTravelCost = -1;
        if (plan.program) {
            internalTravelCost = 0;
            plan.program.forEach(d => {
                if (d.internalTravel)
                    internalTravelCost += d.internalTravel.price;
            });
        }
        let carCost = -1
        if (plan.averagePrices.car && plan.averagePrices.car > 0)
            carCost = Math.round(plan.averagePrices.car * plan.totalDuration / plan.persons);
        return new Costs((plan.outboundTravel.price + plan.returnTravel.price),
            plan.totalDuration * plan.averagePrices.food,
            Math.round(plan.totalDuration * plan.averagePrices.sleep / plan.persons), carCost, extrasCost, internalTravelCost);

    }
}

export class Colors {
    border: string;
    background: string;
    secondary: string;
}
export class AveragePrices {
    food: number;
    sleep: number;
    car: number;
}

export class Day {
    date: Date;
    what: string;
    where: string;
    note: string;
    internalTravel: Travel;
}

export class Travel {
    price: number;
    description: string;
    company: string;
    duration: string;
    stopover: Stopover[];
    takeoff: SingleTravel;
    landing: SingleTravel;
}

export interface Stopover {
    duration: string;
    location: string
}
export interface SingleTravel {
    time: Date,
    location: string;
}

export interface Extra {
    title: string;
    price: number;
    location: string;
    photos: string[]
}

export class Points {
    culture: { value: number, icon: IconDefinition, label: string };
    wheater: { value: number, icon: IconDefinition, label: string };
    nature: { value: number, icon: IconDefinition, label: string };
    price: { value: number, icon: IconDefinition, label: string };

    constructor(cultureValue: number, wheaterValue: number, natureValue: number, priceValue: number) {
        this.culture = { value: cultureValue, icon: faBuildingColumns, label: "Cultura" }
        this.wheater = { value: wheaterValue, icon: faCloudSun, label: "Periodo dell'anno" }
        this.nature = { value: natureValue, icon: faTree, label: "Natura" }
        this.price = { value: priceValue, icon: faPiggyBank, label: "Costo" }
    }
}

export class Costs {
    mainTravel: number;
    internalTravel: number;
    food: number;
    sleep: number;
    car: number;
    extras: number;
    total: number;
    constructor(mainTravel: number,
        food: number,
        sleep: number,
        car: number,
        extras: number,
        internalTravel: number,
    ) {
        this.mainTravel = mainTravel;
        this.food = food;
        this.sleep = sleep;
        this.car = car;
        this.extras = extras;
        this.internalTravel = internalTravel;


        this.total = mainTravel;
        if (food && food > 0) this.total += food;
        if (sleep && sleep > 0) this.total += sleep;
        if (car && car > 0) this.total += car;
        if (extras && extras > 0) this.total += extras;
        if (internalTravel && internalTravel > 0) this.total += internalTravel;
    }

}

export interface Meta {
    image: string;
    fontSize: number
}

export interface Link {
    label: string;
    url: number
}