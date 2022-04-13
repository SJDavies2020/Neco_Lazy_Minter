const serverUrl="https://wnofl8kyjzv3.usemoralis.com:2053/server"
const appId="SDTlYXFWMrEKBtZ0rCHzeyUXYf8qAqjJoTCpMg7E";

Moralis.start({ serverUrl, appId });
let user;
async function login() {
	user=Moralis.User.current();
	if (!user) {
		try {
			user=await Moralis.authenticate({ signingMessage: "Hello World" })
			initApp();
		} catch (error) {
			console.log(error)
		}
	}
	else {
		Moralis.enableWeb3();
		initApp();
		console.log(user);
		console.log(user.get('ethAddress'))
	}
}

function initApp() {
	document.querySelector("#app").style.display="block";
	document.querySelector("#submit").onclick=submit;
}

async function submit() {

	// Get Image Data
	const input=document.querySelector("#input_image");
	let data=input.files[0];
	// Upload to IPFS
	const imageFile=new Moralis.File(data.name, data);
	await imageFile.saveIPFS();
	let imageHash=imageFile.hash();
	console.log(imageHash);
	console.log(imageFile.ipfs());
	document.querySelector("#input_status").value="Status: Uploading Image"

	// Create NFT Meta Data
	let metadata={
		name: document.querySelector("#input_name").value,
		description: document.querySelector("#input_description").value,
		image: "/ipfs/"+imageHash
	}
	document.querySelector("#input_status").value="Status: Creating Meta Data"
	// upload metadata to IPFS
	const jsonFile=new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
	await jsonFile.saveIPFS();
	let metadataHash=jsonFile.hash();
	console.log(metadataHash);
	// upload to Rareible
	document.querySelector("#input_status").value="Status: Uploading to Rarible!"
	let res=await Moralis.Plugins.rarible.lazyMint(
		{
			chain: 'rinkeby', userAddress: user.get("ethAddress"),
			tokenType: 'ERC721',
			tokenUri: '/ipfs/'+metadataHash,
			royaltiesAmount: 100,
			// 1% royalty. Optional
		}
	)
	if (res) {
		document.querySelector("#input_name").value="";
		document.querySelector("#input_description").value="";
		document.querySelector("#input_image").value="";
	}

	console.log(res);
	document.querySelector("#input_status").value="Status: Lazy Mint Complete!";
	let token_address=res.data.result.token_address;
	let token_id=res.data.result.tokenId;
	let url=`https://rinkby.rarible.com/token/${token_address}:${token_id}`;
	document.querySelector("#link").innerHTML=`Link: <a target="_blank" href="${url}"> View NFT</a>`;

}

login();