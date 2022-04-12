const serverUrl="https://wnofl8kyjzv3.usemoralis.com:2053/server"
const appId="SDTlYXFWMrEKBtZ0rCHzeyUXYf8qAqjJoTCpMg7E";

Moralis.start({ serverUrl, appId });

async function login() {
	let user=Moralis.User.current();
	if (!user) {
		try {
			user=await Moralis.authenticate({ signingMessage: "Hello World" })
			console.log(user);
			console.log(user.get('ethAddress'))
		} catch (error) {
			console.log(error)
		}
	}
	else {
		console.log(user);
		console.log(user.get('ethAddress'))
	}
}

//async function logout() {
//	await Moralis.User.logout();
//	console.log("Logged Out");
//}

login();

//document.getElementById("btn-login").onclick=login;
//document.getElementById("btn-logout").onclick=logout;
