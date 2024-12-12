import { Router } from "express";
import { updateWalletPin } from "../controllers/wallet/update_pin";
import { createWalletPin } from "../controllers/wallet/create_new_pin";
import { makeP2PTransfer } from "../controllers/wallet/make_transfer";
import { topupWallet } from "../controllers/wallet/topup_wallet";
import { withdrawFromWallet } from "../controllers/wallet/withdraw_cash";
import { getWalletInformationById } from "../controllers/wallet/get_wallet_info_by_id";
import { verifyJWTToken } from "../middlewares/validate_jwt_token";
import { initiateWithdrawal } from "../controllers/wallet/initiate_withdrawal";
import { approveWithdrawalRequest } from "../controllers/wallet/approve_withdrawal";
import { getWithdrawalRequestsByWalletId } from "./get_withdrawal_requests_by_wallet_id";

const router = Router();

router.get("/:id", getWalletInformationById);
router.post("/create_pin", createWalletPin);
router.patch("/:walletId/pin", verifyJWTToken, updateWalletPin);
router.post("/p2ptransfer", makeP2PTransfer);
router.post("/topup", topupWallet);
router.post("/withdraw", withdrawFromWallet);
router.post("/initiate_withdrawal", initiateWithdrawal);
router.post("/approve_withdrawal", approveWithdrawalRequest);
router.get("/:walletId/withdrawal_requests", getWithdrawalRequestsByWalletId);

export default router;
