const blockUser = (user) => {
	if (user?.isBlocked) {
		throw new Error(`AcCess Denied, ${user?.firstName} ${user?.firstName} is blocked`)
	}

}

module.exports = blockUser;