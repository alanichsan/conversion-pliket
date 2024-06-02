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

module.exports = { getUnits, getHistory, addToHistory, addCustomUnit };
