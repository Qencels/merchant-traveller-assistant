import { PLANET_CODES_CONDITIONS } from "../../Constants";

function getAllowedValues(toParse) {

    let setOfValues = new Set();

    for (let i = 0; i < toParse.length; i++) {
        switch (toParse[i]) {
            case ',': 
                break;

            case '1': case '2': case '3': case '4': case '5': 
            case '6': case '7': case '8': case '9': case '0':
            case 'A': case 'B': case 'C': case 'D': 
            case 'E': case 'F':
                setOfValues.add(parseInt(toParse[i],16));
                break;

            case '+':
                //HEX (j < 16)
                for (let j = parseInt(toParse[i-1], 16); j < 16; j++) setOfValues.add(j);
                break;

            case '-':
                // 1-5 for example or 5-
                if (i === (toParse.length - 1) || !parseInt(toParse[i+1], 16)) {

                    for (let j = parseInt(toParse[i-1], 16); j >= 0; j--) {
                        setOfValues.add(j);
                    }

                } else {

                    for (let j = parseInt(toParse[i-1], 16); j < parseInt(toParse[i+1], 16); j++) {
                        setOfValues.add(j);
                    }

                }
                break;

            default:
                break;
        }
    }

    const result = Array.from(setOfValues)
    setOfValues.clear();
    return result;
} 

function codeParser(codeString) {
    const code = codeString.split(',');
    let typesOfCurrentPlanet = [];

    for (let type in PLANET_CODES_CONDITIONS) {
        const conditions = PLANET_CODES_CONDITIONS[type].split(' ');
        let isType = true;

        for (let i in conditions) {

            if (conditions[i] === 'U') continue;
            
            const allowedValues = getAllowedValues(conditions[i]);

            if (!allowedValues.includes(parseInt(code[i], 16))) {
                isType = false;
                break;
            }
        }

        if (isType) {
            typesOfCurrentPlanet.push(type);
        }
    }

    return typesOfCurrentPlanet;
}

export default function PlanetTypesSelector(props) {

    let planetTypes = codeParser(props.code);

    return ['all', ...planetTypes, props.code[16] + 'z'];
}
