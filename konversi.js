const readline = require("readline");
const db = require("./db");

const units = db.getUnits();

const convert = (value, fromUnit, toUnit) => {
  const fromUnitFactor = units[fromUnit];
  const toUnitFactor = units[toUnit];

  if (!fromUnitFactor || !toUnitFactor) {
    throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`);
  }

  const convertedValue = (value * fromUnitFactor.factor) / toUnitFactor.factor;

  return convertedValue;
};

const main = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const getUnitList = () => {
    const unitList = Object.keys(units)
      .map((unit) => `- ${unit} (${units[unit].name})`)
      .join("\n");
      console.log(unitList);
  };

  const getConversion = (value, fromUnit, toUnit) => {
    try {
      const result = convert(value, fromUnit, toUnit);
      return `Success: ${value} ${fromUnit} is equal to ${result} ${toUnit}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const getHistory = () => {
    const history = db.getHistory();
    const historyList = history
      .map(
        (item, index) =>
          `${index + 1}. ${item.value} ${item.fromUnit} to ${item.toUnit}`
      )
      .join("\n");
    return historyList;
  };

  const addToHistory = (value, fromUnit, toUnit) => {
    db.addToHistory({ value, fromUnit, toUnit });
  };

  const addCustomUnit = (unit, factor, name) => {
    db.addCustomUnit(unit, factor, name);
  };

  const mainMenu = () => {
    console.log("Unit Conversion System");
    console.log("----------------------");
    console.log("1. Convert");
    console.log("2. History");
    console.log("3. Add custom unit");
    console.log("4. Exit");
  };

  const convertMenu = () => {
    console.log("Convert");
    console.log("-------");
    getUnitList();
    console.log("-------");
    console.log("Enter value | Enter from unit | Enter to unit");
  };

  const historyMenu = () => {
    console.log("History");
    console.log("--------");
    console.log(getHistory());
  };

  const customUnitMenu = () => {
    console.log("Add custom unit");
    console.log("----------------");
    console.log("Enter unit | Enter factor | Enter name");
  };

  const mainLoop = () => {
    mainMenu();
    rl.question("Select option: ", (option) => {
      switch (parseInt(option)) {
        case 1:
          convertMenu();
          rl.question("Enter value (example: 100): ", (value) => {
            rl.question("Enter from unit (example: kg): ", (fromUnit) => {
              rl.question("Enter to unit (example: kg): ", (toUnit) => {
                console.log(getConversion(value, fromUnit, toUnit));
                addToHistory(value, fromUnit, toUnit);
                mainLoop();
              });
            });
          });
          break;
        case 2:
          historyMenu();
          mainLoop();
          break;
        case 3:
          customUnitMenu();
          rl.question("Enter unit: ", (unit) => {
            rl.question("Enter factor: ", (factor) => {
              rl.question("Enter name: ", (name) => {
                addCustomUnit(unit, factor, name);
                mainLoop();
              });
            });
          });
          break;
        case 4:
          console.log("Goodbye!");
          rl.close();
          break;
        default:
          console.log("Invalid option");
          mainLoop();
      }
    });
  };

  mainLoop();
};

main();
