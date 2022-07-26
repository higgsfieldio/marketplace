from pydantic import BaseModel


class TransactionHash(BaseModel):
    transaction_hashes: list
