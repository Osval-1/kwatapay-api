export const validateWalletPin = (pin: string | number) => {
	const trimmed = pin.toString().replace(/\D/g, "");
	return trimmed.length === 5;
};
