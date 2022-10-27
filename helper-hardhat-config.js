const networkConfig ={
    "5":{
        name:"gorl",
        ethUsdPriceFeed:"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"

    },
    56:{
        name:"bsc",
        ethUsdPriceFeed:"0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"

    },

}

const developmentChains =["hardhat","localhost"]

const DECIMALS =8
const INITIAL_ANSWER =2000000000000
module.exports={
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}

