from eth_typing.evm import Address
from fastapi import FastAPI
from pydantic import BaseModel
from web3 import Web3, contract
import json
import os
import time
# from dotenv import load_dotenv

# load_dotenv()
# from scripts.helpful_scripts import get_account
app = FastAPI()
file_json_lottery = json.load(open("./build/contracts/lottery.json"))
abi = file_json_lottery["abi"]

file_json_LinkToken = json.load(open("./build/contracts/LinkToken.json"))
abi_link_token = file_json_LinkToken["abi"]

print("abi ok")
w3 = Web3(
    Web3.HTTPProvider("https://rinkeby.infura.io/v3/4a901a0fd16b4bba8be8a332c5762fe2")
)
lottery_address="0xe6F33345809575a0e6A2242294545171F3Ba22E4"
storage = w3.eth.contract(abi=abi, address=lottery_address)
storage_link_token = w3.eth.contract(abi=abi_link_token, address="0x01BE23585060835E02B77ef475b0Cc51aA1e0709")
print("storage ok")

ADDRESS_ACCOUNT = "0x0a38Ad8281202e11fEE8F1c0E1eBED6C8E410015"
PRIVATE_KEY = "0x4503118726f03f9ffca79c5884045dc139e613cf60fdd66f6acc9470df6b607e"


@app.get("/")
async def Lottery():
    return {
        "Lottery state": storage.functions.lottery_state().call(),
        "fee enter": storage.functions.getEntranceFee().call(),
        "USD entry fee": storage.functions.usdEntryFee().call(),
        "Recent winer": storage.functions.recentWinner().call(),
        # "Numbers players": storage.functions.recentWinner().call().length
    }


@app.post("/start")
async def StartLottery():
    tx = storage.functions.startLottery().buildTransaction(
        {
            "from": ADDRESS_ACCOUNT,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(ADDRESS_ACCOUNT),
        }
    )
    tx_sign = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(tx_sign.rawTransaction)
    tx_recipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return {
        "Lottery state": storage.functions.lottery_state().call(),
    }

@app.post("/enter")
async def EnterLottery(fee_enter: int):
    tx = storage.functions.enter().buildTransaction(
        {
            "from": ADDRESS_ACCOUNT,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(ADDRESS_ACCOUNT),
            "value": fee_enter
        }
    )
    tx_sign = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(tx_sign.rawTransaction)
    tx_recipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return {
        "" : "Welcome you go to our lottery!",
        "Lottery state": storage.functions.lottery_state().call(),
        "USD entry fee": storage.functions.usdEntryFee().call(),
        # "Numbers players": storage.functions.recentWinner().call().length
    }

@app.post("/end")
async def EndLottery():
    tx_fund_with_link = storage_link_token.functions.transfer(lottery_address, 100000000000000000).buildTransaction(
        {
            "from": ADDRESS_ACCOUNT,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(ADDRESS_ACCOUNT),
        }
    )
    tx_sign_funk_with_link = w3.eth.account.sign_transaction(tx_fund_with_link, PRIVATE_KEY)
    tx_hash_funk_with_link = w3.eth.send_raw_transaction(tx_sign_funk_with_link.rawTransaction)
    tx_recipt_fund_with_link = w3.eth.wait_for_transaction_receipt(tx_hash_funk_with_link)

    tx = storage.functions.endLottery().buildTransaction(
        {
            "from": ADDRESS_ACCOUNT,
            "gasPrice": w3.eth.gas_price,
            "nonce": w3.eth.get_transaction_count(ADDRESS_ACCOUNT),
        }
    )
    tx_sign = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(tx_sign.rawTransaction)
    tx_recipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    time.sleep(120)

    return {
        "Lottery state": storage.functions.lottery_state().call(),
        "USD entry fee": storage.functions.usdEntryFee().call(),
        "Recent winer": storage.functions.recentWinner().call(),
    }
