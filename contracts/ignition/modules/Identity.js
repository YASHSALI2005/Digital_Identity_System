const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("IdentityModule", (m) => {
  const identity = m.contract("Identity");
  return { identity };
});
