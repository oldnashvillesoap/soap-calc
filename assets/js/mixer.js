var mixer = {};

mixer.result = {};

mixer.properties = [
    {
        id: 0,
        displayName: 'INS',
        bias: 0,
        target: { min: 136 , max: 165 },
        path: 'ins',
        notes: "With a higher INS value the soap firms up more quickly and is easier to unmold, but may be more harsh and drying."
    },
    {
        id: 1,
        displayName: 'Iodine',
        bias: 0,
        target: { min: 41 , max: 70 },
        path: 'iodine',
        notes: "Soap with a higher Iodine value may be softer at the time of unmolding, and may have a greater chance to become rancid."
    },
    {
        id: 2,
        displayName: 'Bubbly',
        bias: 0,
        target: { min: 14 , max: 46 },
        path: 'properties.bubbly',
        notes: "A measure of how much loose, fluffy lather is produced. A \"bubbly\" lather is produced quickly by a soap, but doesn't last long."
    },
    {
        id: 3,
        displayName: 'Cleansing',
        bias: 0,
        target: { min: 12 , max: 22 },
        path: 'properties.cleansing',
        notes: "A measure of how water soluble the soap is -- meaning it is a measure of how easily the soap dissolves in difficult situations such as hard water, cold water, or salt water. The Cleansing number does NOT tell you whether the soap will actually get your skin clean."
    },
    {
        id: 4,
        displayName: 'Conditioning',
        bias: 0,
        target: { min: 44 , max: 69 },
        path: 'properties.cleansing',
        notes: "A measure of the soap's ability to soften and soothe the skin. The \"anti tight-and-dry\" property, so to speak."
    },
    {
        id: 5,
        displayName: 'Hardness',
        bias: 0,
        target: { min: 29 , max: 54 },
        path: 'properties.hardness',
        notes: "A measure of the physical hardness-like-a-rock. It tells you how relatively easy it will be to unmold a particular soap after saponification. It does NOT necessarily tell you how long-lived the soap will be."
    },
    {
        id: 6,
        displayName: 'Longevity',
        bias: 0,
        target: { min: 20 , max: 50 },
        path: 'properties.longevity',
        notes: "The higher the number the longer lasting the soap. Too low and the soap doesn't last sufficiently long in the shower. Too high and the soap doesn't lather as well."
    },
    {
        id: 7,
        displayName: 'Stability',
        bias: 0,
        target: { min: 16 , max: 48 },
        path: 'properties.stable',
        notes: "How long the lather will stay fluffy with big bubbles."
    }
];

mixer.bom = [
    {
        position: 0,
        oil_id: 88,
        proportion: 1
    }
];

mixer.mix = function() {
    _.each(mixer.properties, function(prop) {
        var actual = _.reduce(mixer.bom, function(res, item) {
            var oil = _.find(data.build, { id: item.oil_id });
            return res + _.get(oil, prop.path) * item.proportion;
        }, 0);
        var mean = _.mean([prop.target.min, prop.target.max]);
        var range = prop.target.max - prop.target.min;
        var target = mean + prop.bias * range / 2;

        prop.target.value = target;
        prop.value = actual;
        prop.error = (actual - target) / target * 100;
    });

    actuals = _.map(mixer.properties, prop => { return { id: prop.id, value: prop.value }; });
    targets = _.map(mixer.properties, prop => { return { id: prop.id, value: prop.target.value }; });

    mixer.result.error = mixer.compare(targets, actuals);
};

mixer.compare = function(target, actual) {
    /* calculates root mean squared error, where
    error is the percent difference between 1-100
    expect a and b to be arrays of properties
    for example [{ id: 1, value: n }, ...] */

    var err = _.map(target, function(t) {
        a =  _.find(actual, { id: t.id }).value;
        t = t.value;
        return (a - t) / t * 100;
    });

    var sse = _.reduce(err, function(res, cur) {
        return res + Math.pow(cur, 2);
    }, 0);

    var mse = sse / err.length;

    return Math.sqrt(mse);
};


// compare return RMSE -- distance from middle of range
//     getOilProps -> map properties for oil { id: n, value: y }
//     reduce -> sqrt( sum(dif^2) / prop.length )

// determine ideal next oil
//     all values in range
//     reduce proportion to get max positive error within upper range
//     back into other property values

// find complemenary oil

// add oil

// re-balanace

// calculate actuals

// calculate recipe -- lye (including superfat), water, etc.

/*
// combinations of 1 oil that are within ranage
mixer.matches = _.filter(
    data.build, (e) => { 
        return _.reduce(
            mixer.paths, (a, p) => { 
                return a && _.inRange(_.get(e, p), 
                    _.get(data.targets, p + '.min'), 
                    _.get(data.targets, p + '.max')
                ); 
            }, 
            true
        ); 
    }
)
*/

/*

[1, 1, 1, 1, 1, 1, 1, 1] * w1
[1, 1, 1, 1, 1, 1, 1, 1] * w2
[1, 1, 1, 1, 1, 1, 1, 1] * w3

w1 + w2 + w3 = 1

s1_1 * w1 + s2_1 * w2 + s3_1 * w3 = S1

increments of 0.1

every combination of 2 oils --> 100         150*149
every combination of 3 oils --> 1000
every combination of 4 oils --> 10000
every combination of 5 oils --> 100000
every combination of 6 oils --> 1000000

*/