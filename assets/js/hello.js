console.log('hello.');

var paths = [
    'ins', 
    'iodine', 
    'properties.hardness',
    'properties.cleansing',
    'properties.bubbly',
    'properties.stable',
    'properties.longevity',
    'properties.condition'
];

// combinations of 1 oil that are within ranage
var matches = _.filter(
    data.build, (e) => { 
        return _.reduce(
            paths, (a, p) => { 
                return a && _.inRange(_.get(e, p), 
                    _.get(data.targets, p + '.min'), 
                    _.get(data.targets, p + '.max')
                ); 
            }, 
            true
        ); 
    }
)
