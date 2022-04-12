const { base64 }=require("ethers/lib/utils");

const serverUrl="https://wnofl8kyjzv3.usemoralis.com:2053/server"
const appId="SDTlYXFWMrEKBtZ0rCHzeyUXYf8qAqjJoTCpMg7E";

Moralis.start({ serverUrl, appId });

async function login() {
	let user=Moralis.User.current();
	if (!user) {
		try {
			user=await Moralis.authenticate({ signingMessage: "Hello World" })
			initApp();
		} catch (error) {
			console.log(error)
		}
	}
	else {
		initApp();
		console.log(user);
		console.log(user.get('ethAddress'))
	}
}

function initApp() {
	document.querySelector("#app").style.display="block";
	document.querySelector("#submit_button").onclick=submit;
}

async function submit() {

	// Get Image Data
	const input=document.querySelector("#input_imge");
	let data=input.file[0];
	// Upload to IPFS
	const imageFile=new Moralis.File(data.name, data);
	await imageFile.saveIPFS();
	let imageHash=imageFile.hash();
	console.log(imageHash);
	console.log(imageFile.ipfs());
	// Create NFT Meta Data
	let metadata={
		name: document.querySelector("#input_name").value,
		description: document.querySelector("#input_description").value,
		image: "/ipfs/"+imageHash
	}
	// upload metadata to IPFS
	const jsonFile=new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
	await jsonFile.saveIPFS();
	let metadataHash=jsonFile.hash();

	console.log(metadataHash);

	// upload to Rareible


}
//async function logout() {
//	await Moralis.User.logout();
//	console.log("Logged Out");
//}

login();

//document.getElementById("btn-login").onclick=login;
//document.getElementById("btn-logout").onclick=logout;
