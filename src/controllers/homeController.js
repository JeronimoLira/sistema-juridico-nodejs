// 📁 src/controllers/homeController.js
const menuService = require('../services/menuService');

exports.paginaInicial = async (req, res) => {
  const menu = await menuService.obterMenu();
  res.render('dashboard', { menu });
};
