const units = {
  kg: { factor: 1000, name: "Kilogram" },
  ons: { factor: 100, name: "Ons" },
  gram: { factor: 1, name: "Gram" },
  karton: { factor: 20, name: "Karton" },
  bungkus: { factor: 10, name: "Bungkus" },
};

const history = [];

const getUnits = () => units;

const getHistory = () => history;

const addToHistory = (item) => {
  history.push(item);
};

const addCustomUnit = (unit, factor, name) => {
  units[unit] = { factor, name };
};

const editUnit = (unit, newFactor, newName) => {
  if (!(unit in units)) {
    throw new Error(`Unit '${unit}' does not exist.`);
  }
  if (unit === 'gram') {
    throw new Error("Cannot edit the base unit 'gram'.");
  }
  units[unit].factor = parseFloat(newFactor);
  units[unit].name = newName || units[unit].name;
};

const deleteUnit = (unit) => {
  if (!(unit in units)) {
    throw new Error(`Unit '${unit}' does not exist.`);
  }
  if (unit === 'gram') {
    throw new Error("Cannot delete the base unit 'gram'.");
  }
  delete units[unit];
};

module.exports = { getUnits, getHistory, addToHistory, addCustomUnit, editUnit, deleteUnit};
