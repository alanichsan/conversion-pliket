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
    console.log("4. Manage units");
    console.log("5. Exit");
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

  const manageUnitsMenu = () => {
    console.log("Manage Units");
    console.log("------------");
    console.log("1. List all units");
    console.log("2. Edit a unit");
    console.log("3. Delete a unit");
    console.log("4. Back to main menu");
  };

  const listAllUnits = () => {
    console.log("All Units:");
    console.log("---------");
    const units = db.getUnits();
    Object.entries(units).forEach(([symbol, unit]) => {
      console.log(`- ${symbol}: ${unit.name} (1 ${symbol} = ${unit.factor} gram)`);
    });
    console.log("\n(Note: 'gram' is the base unit and cannot be edited or deleted.)");
  };

  const editUnitMenu = () => {
    console.log("Edit a Unit");
    console.log("----------");
    listAllUnits();
    console.log("\nEnter the unit symbol to edit (e.g., 'kg'):");
  };

  const editUnit = () => {
    editUnitMenu();
    rl.question("Unit to edit: ", (unit) => {
      rl.question("New factor (press Enter to keep current): ", (newFactor) => {
        rl.question("New name (press Enter to keep current): ", (newName) => {
          try {
            const currentUnit = db.getUnits()[unit];
            newFactor = newFactor.trim() === '' ? currentUnit.factor : newFactor;
            newName = newName.trim() === '' ? currentUnit.name : newName;
            db.editUnit(unit, newFactor, newName);
            console.log(`Unit '${unit}' updated successfully.`);
          } catch (error) {
            console.log(`Error: ${error.message}`);
          }
          manageUnits();
        });
      });
    });
  };

  const deleteUnit = () => {
    console.log("Delete a Unit");
    console.log("------------");
    listAllUnits();
    console.log("\nEnter the unit symbol to delete (e.g., 'ons'):");
    rl.question("Unit to delete: ", (unit) => {
      try {
        db.deleteUnit(unit);
        console.log(`Unit '${unit}' deleted successfully.`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
      manageUnits();
    });
  };


  const manageUnits = () => {
    manageUnitsMenu();
    rl.question("Select option: ", (option) => {
      switch (parseInt(option)) {
        case 1:
          listAllUnits();
          manageUnits();
          break;
        case 2:
          editUnit();
          break;
        case 3:
          deleteUnit();
          break;
        case 4:
          mainLoop();
          break;
        default:
          console.log("Invalid option");
          manageUnits();
      }
    });
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
            manageUnits();
            break;
        case 5:
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
