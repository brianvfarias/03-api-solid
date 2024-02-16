export class UserAlreadyExistsErrors extends Error {
	constructor() {
		super('Email already exists');
	}
};
