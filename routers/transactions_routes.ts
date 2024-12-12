import { Router } from "express";
import { getTransactionById } from "../controllers/transaction/get_transaction_by_id";
import { getAllTransactionsByWalletId } from "../controllers/transaction/get_all_transactions_by_wallet_id";

const router = Router();

router.get("/", getAllTransactionsByWalletId);
router.get("/:id", getTransactionById);

export default router;
