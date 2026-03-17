const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Identity", function () {
  let identity;
  let owner;
  let addr1;

  beforeEach(async function () {
    const Identity = await ethers.getContractFactory("Identity");
    [owner, addr1] = await ethers.getSigners();
    identity = await Identity.deploy();
  });

  it("Should allow a user to add a certificate and verify it", async function () {
    const hash = "0xabc123";
    const name = "Degree Certificate";

    await expect(identity.connect(addr1).addCertificate(hash, name))
      .to.emit(identity, "CertificateAdded")
      .withArgs(addr1.address, hash, name, addr1.address);

    const certs = await identity.getCertificates(addr1.address);
    expect(certs.length).to.equal(1);
    expect(certs[0].hash).to.equal(hash);
    expect(certs[0].name).to.equal(name);

    const isVerified = await identity.verifyCertificate(addr1.address, hash);
    expect(isVerified).to.be.true;
  });

  it("Should return false for invalid certificates", async function () {
    const isVerified = await identity.verifyCertificate(addr1.address, "0xinvalid");
    expect(isVerified).to.be.false;
  });
});
