const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function() {
  let fundMe;
  let deployer;
  let mockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async function() {
    //
    // const accounts= await ethers.getSigners()
    // const accountZero =accounts[0]

    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async function() {
    it("sets the aggreagator address correctly", async function() {
      const resposne = await fundMe.priceFeed();
      assert.equal(resposne, mockV3Aggregator.address);
    });
  });

  describe("fund", async function() {
    it("Fails if u dont send enough ETH", async function() {
      await expect(fundMe.fund()).to.be.reverted;
    });

    it("correct update value", async function() {
      await fundMe.fund({ value: sendValue });
      const respone = await fundMe.founderList(deployer);

      assert.equal(respone.toString(), sendValue.toString());
    });
  });
  describe("withdraw", function() {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraws ETH from a single funder", async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait();
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      // Assert
      // Maybe clean up to understand the testing
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });
  });

  it("is allows us to withdraw with multiple funders", async () => {
    // Arrange
    const accounts = await ethers.getSigners();
    for (i = 1; i < 6; i++) {
      const fundMeConnectedContract = await fundMe.connect(accounts[i]);
      await fundMeConnectedContract.fund({ value: sendValue });
    }
    const startingFundMeBalance = await fundMe.provider.getBalance(
      fundMe.address
    );
    const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

    // Act
    const transactionResponse = await fundMe.withdraw();
    // Let's comapre gas costs :)
    // const transactionResponse = await fundMe.withdraw()
    const transactionReceipt = await transactionResponse.wait();
    const { gasUsed, effectiveGasPrice } = transactionReceipt;
    const withdrawGasCost = gasUsed.mul(effectiveGasPrice);
    console.log(`GasCost: ${withdrawGasCost}`);
    console.log(`GasUsed: ${gasUsed}`);
    console.log(`GasPrice: ${effectiveGasPrice}`);
    const endingFundMeBalance = await fundMe.provider.getBalance(
      fundMe.address
    );
    const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
    // Assert
    assert.equal(
      startingFundMeBalance.add(startingDeployerBalance).toString(),
      endingDeployerBalance.add(withdrawGasCost).toString()
    );
    // Make a getter for storage variables
    await expect(fundMe.fonder(0)).to.be.reverted;

    for (i = 1; i < 6; i++) {
      assert.equal(
        await fundMe.founderList(accounts[i].address),
        0
      );
    }

  });
  it("Only allows the owner to withdraw", async function () {
    const accounts = await ethers.getSigners()
    const fundMeConnectedContract = await fundMe.connect(
        accounts[1]
    )
    await expect(
        fundMeConnectedContract.withdraw()
    ).to.be.reverted
})

});