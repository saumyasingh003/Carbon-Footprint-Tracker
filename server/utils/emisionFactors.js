export const emissionFactors = {

  transport: {
    car: 0.21,
    suv: 0.26,
    ev: 0.05,
    bike: 0.10,
    motorbike: 0.10,
    bus: 0.05,
    train: 0.04,
    metro: 0.03,
    cycle: 0.01,
    walk: 0,
    flight: 0.15,
    airplane: 0.15,
    scooter: 0.08,
    auto: 0.09,
    taxi: 0.18,
  },

  electricity: {
    electricity: 0.85,
    gas: 2.0,
    solar: 0.02,
    generator: 2.5,
  },

  food: {
    veg: 1.5,
    nonveg: 3.5,
    vegan: 0.5,
    dairy: 2.1,
    chicken: 2.9,
    beef: 6.0,
    pork: 4.0,
    fish: 2.5,
    egg: 1.2,
    fastfood: 3.0,
  },

  waste: {
    recycle: -0.2,
    plastic: 0.5,
    landfill: 0.7,
    compost: -0.1,
    burn: 1.0,
    ewaste: 1.5,
  },

  water: {
    shower: 0.03,
    laundry: 0.2,
    dishwasher: 0.15,
  },

  shopping: {
    clothes: 5.0,
    electronics: 20.0,
    furniture: 15.0,
    groceries: 2.0,
  },

};