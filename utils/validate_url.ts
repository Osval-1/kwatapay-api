const validateUrl = (url: string): boolean => {
	// Regular expression for URL validation
	const urlRegex =
		/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;

	// Check if the URL matches the regular expression
	return urlRegex.test(url);
};

export default validateUrl;
