import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Grid, Snackbar } from '@mui/material';
import Navigation from '../components/navigation';
import '../App.css';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import {Buffer} from 'buffer';
import abi from "../abi/abi.json";
import { Chat } from '@pushprotocol/uiweb';
import loadingDog from '../Assets/detective-load.gif';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'bisque',
  border: '2px solid #000',
  boxShadow: '4px 6px 4px 6px black',
  p: 4,
  color:"black",
  maxHeight:"500px",
  overflowY:"auto",
  scrollbarWidth: "thin",
  fontFamily:"'Kalnia', serif",
};

function Home(){
  const [open, setOpen] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [proverAddress,setProverAddress] =  React.useState('');
  const [currentAddress,setCurrentAddress] =  React.useState('');
  const [openProof, setOpenProof] = React.useState(false);
  const [challenges,setChallenges] = React.useState([]);
  const [myChallenges,setMyChallenges] = React.useState([]);
  const [myGeneratedProofs,setMyGeneratedProofs] = React.useState([]);
  const [challengeId,setChallengeId] =  React.useState('');
  const [myProofs,setMyProofs] = React.useState([]);
  const [isSign,setIsSign] = React.useState(false);
  const [signature,setSignature] = React.useState('');
  const [amount,setAmount] = React.useState('');
  const [nickName,setNickName] = React.useState('');
  const ethers = require("ethers");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackError, setOpenSnackError] = React.useState(false);
  const [openSnackVerify, setOpenSnackVerify] = React.useState(false);
  const [openSnackVerifyError, setOpenSnackVerifyError] = React.useState(false);
  const [isChallengeCreated, setIsChallengeCreated] = React.useState(false);
  const [isVerifyLoading,setIsVerifyLoading] = React.useState(false);
  const [isVerified,setIsVerifed] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState(null);
  const [isOpenChat,setIsOpenChat] = React.useState(false);
  const [isOpenChatVerify,setIsOpenChatVerify] = React.useState(false);
  const [ethSigner,setEthSigner] = React.useState(null);
  const [pushAddr,setPushAddr] = React.useState(null);
  const [ethSignerVerify,setEthSignerVerify] = React.useState(null);
  const [pushAddrVerify,setPushAddrVerify] = React.useState(null);
  const  vertical  ="top";
  const horizontal = "right";

  const theme = {
    bgColorPrimary: '#003314',
    bgColorSecondary: '#000080',
    textColorPrimary: 'white',
    textColorSecondary: 'green',
    btnColorPrimary: '#E69D72',
    btnColorSecondary: 'purple',
    border: '2px solid black',
    borderRadius: '40px',
    boxShadow: "4px 6px 4px 6px black !important",
    moduleColor: 'bisque',
  
    // moduleColor: '#E69D72',
  };
  // var Web3 = require('web3');
  // var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');
console.log(ethSigner,isOpenChat,"signer")
  const fetch = require('node-fetch');

      const handleOpen= (id) => {setOpen(true);setChallengeId(id)};
      const handleClose = () => {setOpen(false)}

      const handleOpenProof= (proof) => {setOpenProof(true);setMyProofs(proof)}
      const handleCloseProof = () => setOpenProof(false);

      const handleOpenSnack=()=>setOpenSnack(true)
      const handleCloseSnack=()=>setOpenSnack(false);

      const handleOpenSnackError=()=>setOpenSnackError(true)
      const handleCloseSnackError=()=>setOpenSnackError(false);

      const handleOpenSnackVerify=()=>setOpenSnackVerify(true)
      const handleCloseSnackVerify=()=>setOpenSnackVerify(false);

      const handleOpenSnackVerifyError=()=>setOpenSnackVerifyError(true)
      const handleCloseSnackVerifyError=()=>setOpenSnackVerifyError(false);

      const handleOpenChat=(pushAdd)=>{setIsOpenChat(true);setIsOpenChatVerify(false);  const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = new ethers.Wallet(localStorage.getItem("pushID")); setEthSigner(signer);setPushAddr(pushAdd);}

        const handleOpenChatVerify=(pushAdd)=>{
            setIsOpenChat(false); setOpenProof(false);  setIsOpenChatVerify(true);  const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = new ethers.Wallet(localStorage.getItem("pushID")); setEthSignerVerify(signer);setPushAddrVerify(pushAdd);
        }
      const handleSubmit = async(event) => {
        let proverAdd=localStorage.getItem("walletAddress");
        setProverAddress(localStorage.getItem("walletAddress"))
        try{
       const proofResponse=await axios.post("http://localhost:3001/calculateProfit",{user_address:proverAdd,challenge_id:challengeId})
       console.log(proofResponse,"pres")
       if(proofResponse?.data?.data!==null && proofResponse?.data?.data!==''){
        setAmount(proofResponse.data.data)
        setIsSign(true);
       }
       else{
        isSign(false);
       }
      }
      catch{
        console.log("err");
      }
        // Do something with the input values, for example, log them
        
      };
      const handleSubmitSign=async()=>{
        setIsVerifyLoading(true);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
          if (!signer) {
            console.error("Signer is not set");
            return;
          }
      
          try {
            const signatureValue = await signer.signMessage(String(amount*100));
            setSignature(signatureValue);
            console.log("Signature:", signatureValue,amount);
            const signatureResult=await getSignatureInfo(amount,signatureValue);
            console.log(signatureResult)
            try{
          const signatureProof=  await axios.post("http://localhost:3001/generateProof",{challenge_id:challengeId,nick_name:nickName,actual_profit:amount*100,hashed_message:signatureResult.messageDigestBytes,pub_key_x_solver:signatureResult.publicKeyXBytes,
          pub_key_y_solver:signatureResult.publicKeyYBytes,signature_solver:signatureResult.signatureBytes});
           if(signatureProof.data.res===true){
            handleOpenSnack();
            setIsVerifyLoading(false);
            getMyProofs(nickName);
           }
           else{
            handleOpenSnackError();
           }
            }
            catch{
              console.log("error");
            }
            setIsSign(false);
            
          } catch (error) {
            console.error("Error signing message:", error);
          }
        setOpen(false);
      }

      const getSignatureInfo = async (message, signature) => {
        // Compute the message's digest
        const messageDigest = ethers.utils.hashMessage(message);
        const messageDigestBytes = ethers.utils.arrayify(messageDigest);
    
        // Recover the public key
        const publicKey = ethers.utils.recoverPublicKey(messageDigest, signature);
    
        // Remove the '0x04' prefix from the uncompressed public key
        const publicKeyNoPrefix = publicKey.slice(4);
    
        // Extract X and Y coordinates (each coordinate is 64 characters long in hex)
        const publicKeyX = publicKeyNoPrefix.substring(0, 64);
        const publicKeyXBytes = ethers.utils.arrayify("0x" + publicKeyX);
        const publicKeyY = publicKeyNoPrefix.substring(64);
        const publicKeyYBytes = ethers.utils.arrayify("0x" + publicKeyY);
    
        // Split the signature into r, s, and v components
        const r = signature.slice(0, 66); // First 32 bytes
        const s = "0x" + signature.slice(66, 130); // Next 32 bytes
    
        // Convert r and s to byte arrays
        const rBytes = ethers.utils.arrayify(r);
        const sBytes = ethers.utils.arrayify(s);
    
        // Concatenate r and s to get a 64-byte array
        const signatureBytes = new Uint8Array([...rBytes, ...sBytes]);
    
        return {
          messageDigestBytes,
          publicKeyXBytes,
          publicKeyYBytes,
          signatureBytes,
        };
      };

      const handleSubmitVerify=async(cid,chalngID,nicknam,index)=>{
        console.log( await downloadFile(cid),"cccccccccc")
        const proof= await downloadFile(cid);
        console.log(proof,"ddddddd");
        setIsVerifyLoading(true);
        setActiveButton(index)
        try{
        const hashNick=await axios.post("http://localhost:3001/user/nickHash",{nick_name:nicknam})
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x634F9Bc798A228C6Ed8fD4A14A2b907498146809",abi,signer);
       const contr= await contract.getVerified(chalngID,`0x${proof}`,hashNick.data.data);
        provider.once(contr.hash, (transaction,error) => {
          // Emitted when the transaction has been mined
      if(transaction){
       handleOpenSnackVerify();
       setIsVerifyLoading(false);
       setIsVerifed(true)
       getProofVerified(chalngID,nicknam)
      }
      else{
        handleOpenSnackVerifyError();
        console.log(error)
      }})
        }
        catch{
          console.log("err");
        }
      }
      async function downloadFile(cid){
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
        return Buffer.from(await response.arrayBuffer()).toString()
      };

      const getProofVerified=async(chalngID,nicknam)=>{
        try{
      const myProofs=await axios.post("http://localhost:3001/challenge/proofVerified",{challenge_id:chalngID,nick_name:nicknam});
      if(myProofs.data){
        let myAddressNick=localStorage.getItem("walletAddress")
        getMyChallenges(myAddressNick);
      }
        }
        catch{
          console.log("error")
        }
      }
      React.useEffect(()=>{
        console.log(localStorage.getItem("nickName"),"local");
        const myAddress=localStorage.getItem("walletAddress");
        setCurrentAddress(myAddress);
        if(localStorage.getItem("nickName")!==null){
          const nickNm=localStorage.getItem("nickName")
          setIsConnected(true);
          setNickName(nickNm);
    
        getMyChallenges(myAddress)
        }
        else{
          setIsConnected(false);
        }
      },[isConnected])

      const getMyChallenges=async(addrs)=>{
      const addr= await ethers.utils.getAddress(addrs);
        try{
         const getMyChalResponse= await axios.post("http://localhost:3001/challenge/getMyChallenges",{wallet_address:addr})
            setMyChallenges(getMyChalResponse.data.data);
            console.log(getMyChalResponse.data.data,"Mychal");
          }
          catch{
            console.log("err");
          }
      }

      React.useEffect(()=>{
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = new ethers.Wallet("0x7f0b5eb1ab623c9be57aabfce8f538a4558c7400a56e332c45f34a2a4d73c672"); setEthSigner(signer);
     getChallenges();
      },[])

      React.useEffect(()=>{
     getMyProofs();
      },[isConnected])

      const getMyProofs=async()=>{
        let nicks=localStorage.getItem("nickName")
        try{
        const getMyproofResponse= await axios.post("http://localhost:3001/challenge/getmyproofs",{nick_name:nicks})
        setMyGeneratedProofs(getMyproofResponse?.data?.data);
        }catch{
          console.log("error")
        }
      }

      const getChallenges= async() => {
        try{
         const getChallResponse= await  axios.post("http://localhost:3001/challenge/getChallenges")
           setChallenges(getChallResponse.data.data);
           console.log(getChallResponse.data.data)
         }
         catch{
           console.log("err");
         }
      }

      const truncateString=(str, num)=> {
        // If the length of str is less than or equal to num
        // just return str--don't truncate it.
        if (str.length <= num) {
          return str
        }
        // Return str truncated with '...' concatenated to the end of str.
        return str.slice(0, num) + '...'
      }

      React.useEffect(()=>{
console.log("challeneg created")
      },[isChallengeCreated,myChallenges,myGeneratedProofs])

      console.log(currentAddress,"connect")
    return (
        <div className="main-detail-header">
            <Grid container  rowSpacing={{ xs: 1, sm: 2, md: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
      <Navigation setIsConnected={(isConnected)=>setIsConnected(isConnected)} isConnected={isConnected} setMyChallenges={(myChallenges)=>setMyChallenges(myChallenges)}/>
  </Grid>
  {isConnected &&
  <>
  <Grid container item xs={12} sx={{paddingBottom:"1%"}}>
 
           
            
                  <h4 className='heading-main'>My Challanges</h4>
                
                </Grid>
               { myChallenges && myChallenges?.length>0?
  <Grid container item xs={12} >
  <div className='private-container'>
  <Grid container item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {myChallenges && myChallenges?.length>0 && myChallenges?.map((myChallenge)=>{
    return(
<Grid item xs={4}>
    <Button onClick={()=>{handleOpenProof(myChallenge?.proofs)}}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"bisque",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Address: {myChallenge?.challenger_address}
        </Typography> */}
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"black"}} color="text.secondary">
         Challenge ID: {myChallenge?.challenge_id}
        </Typography>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Holdings: { myChallenge?.holdings && myChallenge?.holdings?.length>0 && myChallenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography> */}
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Platform: {myChallenge?.platform}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Profit %: {myChallenge?.profit_percentage}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif","&:hover": { color: 'black',backgroundColor:"#E69D72",}}} size="small">Verify</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
    )
  })}

</Grid>
</div>
</Grid>
:<Grid xs={12}><h4 className='heading-nodata'>Challenge-less?Let's 'Sherlock' around for some mysteries!</h4></Grid>}
</>}

{!isConnected &&
<>
  <Grid container item xs={12} >
 
 <h4 className='heading-main'>About Us</h4>
</Grid>
<Grid container item xs={12} sx={{ padding:0}}>
  <div className='private-container-about'>
Create your own quest by choosing a DeFi swap protocol, selecting pools, and setting a profit goal. 
Then, watch as savvy provers step up to the plate, armed with nothing but their address and a keen strategy 
to meet your challenge. Once they prove their prowess and your conditions are met, 
a new door opens for a direct chat - all while keeping addresses under wraps. And the cherry on top? 
Our cutting-edge zero-knowledge proofs ensure the prover's success is verified without ever giving away your challenge secrets. 
It's not just finance; it's an exciting game of skill and strategy!
</div>
  </Grid>
  </>
}

<Grid container item xs={12}>
 <h4 className='heading-main'>Challenges</h4>
</Grid>
{challenges && challenges?.length>0?
<Grid container item xs={12} >
                     <div className='private-container'>
<Grid container item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {challenges && challenges?.length>0 && challenges?.map((challenge)=>{
    return(
      <>
      {(challenge?.challenger_address).toLowerCase()!==currentAddress&&
<Grid item xs={4}>
    <Button onClick={isConnected?()=> handleOpen(challenge?.challenge_id):handleClose}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"bisque",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Address: {challenge?.challenger_address}
        </Typography> */}
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"black"}} color="text.secondary">
         Challenge ID: {challenge?.challenge_id}
        </Typography>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Holdings: { challenge?.holdings && challenge?.holdings?.length>0 && challenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography> */}
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Platform: {challenge?.platform}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Profit %: {challenge?.profit_percentage}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif","&:hover": { color: 'black',backgroundColor:"#E69D72",}}} size="small">Get My Profit</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
    }
    </>
    )
  })}

 
  </Grid>
  </div>
  </Grid>:<Grid xs={12}><h4 className='heading-nodata'>Our Challenge board's as empty as a detective's 'lead' pencil. Time to draw up some clues?</h4></Grid>}

  
  {isConnected &&
  <>
  <Grid container item xs={12} >
<h4 className='heading-main'>My Proofs</h4>
</Grid>

{myGeneratedProofs && myGeneratedProofs?.length>0?
<Grid container item xs={12} >
                     <div className='private-container'>
<Grid container item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {myGeneratedProofs && myGeneratedProofs?.length>0 && myGeneratedProofs?.map((challenge)=>{
    return(
      <>
<Grid item xs={4}>
    <Button>
    <Card sx={{ minWidth: 375 , height: "180px",backgroundColor:"bisque",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
       
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"black"}} color="text.secondary">
         Challenge ID: {challenge?.challenge_id}
        </Typography>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Holdings: { challenge?.holdings && challenge?.holdings?.length>0 && challenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography> */}
        <Typography className="ipfs" sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          IPFS Proof: {truncateString(challenge?.ipfs_proof,16)}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Nick Name: {challenge?.prover_nickname}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"black" }} color="text.secondary">
          Actual Profit: {challenge?.actualProfit}
        </Typography>
      </CardContent>
      {challenge?.is_proved &&
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif",
        "&:hover": { color: 'black',backgroundColor:"#E69D72",}}} size="small"  onClick={()=>handleOpenChat(challenge?.prover_push_address)}>Chat</Button>
      </CardActions>}
    </Card>
    </Button>
  </Grid>
    
    </>
    )
  })}

 
  </Grid>
  </div>
  </Grid>:<Grid xs={12}><h4 className='heading-nodata'>Proofs not found? Let's 'integrate' our creativity and 'differentiate' a new one!</h4></Grid>}

  </>}
  <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="form-main">
<div className="verify-container">
  <div className="verify-content">
  {!isVerifyLoading?
    <>
  {isSign?
  <h2 style={{textAlign:"center",fontFamily:"'Kalnia', serif",fontWeight:700}}>Sign your message!</h2>:
  <h2 style={{textAlign:"center",fontFamily:"'Kalnia', serif",fontWeight:700}}> OK, lets get the proof!</h2>}</>
  :<h2 style={{textAlign:"center",fontFamily:"'Kalnia', serif",fontWeight:700}}> Time for the reveal!</h2>}
   
  </div>
  <div className="button-verify">
    {!isVerifyLoading?
    <>
  {isSign? <Button sx={{backgroundColor:"#E69D72",color:"black" ,fontFamily:"'Kalnia', serif",fontWeight:700,"&:hover": { color: 'black',backgroundColor:"#E69D72"}}} size="small" onClick={()=>{handleSubmitSign()}}>Sign</Button>
        :   <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",color:"black" ,fontFamily:"'Kalnia', serif",fontWeight:700,"&:hover": { color: 'black',backgroundColor:"#E69D72"}}} onClick={()=>{handleSubmit()}}>Get My Proof</Button>}</>
 :<img src={loadingDog} width={"140px"} height={"160px"} style={{marginBottom:"2%"}} alt="loadinnng"></img>}
  {/* <Button type="button"> <h4 style={{fontWeight:700,fontFamily:"'Kalnia', serif",color:"black"}}>Loading...</h4></Button> */}
  </div>
 
</div>
</div>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={openProof}
        onClose={handleCloseProof}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <Box sx={style}>
        
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <h3  className='heading-main' style={{textAlign:"centre"}}>Proofs</h3>
          
                 
  <div className="verify-content-flex">
  {myProofs?.map((proof,index)=>{
    return(
      <div className="content-container">
       <div className="verify-content-flex-inner" key={index}>
       <div>Challenge ID: {proof?.challenge_id} </div>
       <div className="ipfs">
       <div >IPFS Proof: {truncateString(proof?.ipfs_proof,16)} </div>
       <span className="tooltiptext">{proof?.ipfs_proof}</span>
       </div>
       <div>Prover Nick Name: {proof?.prover_nickname} </div>
       <div>Actual Profit: {proof?.actualProfit} </div>
     
      </div>
     {!proof?.is_proved ?
      <Button type="button" sx={{backgroundColor:activeButton === index ?"none":"#E69D72",padding:"2%",width:"250px",fontWeight:700,fontFamily:"'Kalnia', serif",
       color:activeButton === index?"black":"black" ,"&:hover": { color: 'black',backgroundColor:activeButton===index?"none":"#E69D72"}}} onClick={()=>{activeButton===index && isVerified?handleOpenChatVerify(proof?.prover_push_address):handleSubmitVerify(proof?.ipfs_proof,proof?.challenge_id,proof?.prover_nickname,index)}}>{activeButton===index && isVerified?"Chat":activeButton===index?"Loading...":"Verify"}</Button>
      : <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",width:"250px",fontWeight:700,fontFamily:"'Kalnia', serif",
      color:activeButton === index?"black":"black" ,"&:hover": { color: 'black',backgroundColor:"#E69D72"}}} onClick={()=>{handleOpenChatVerify(proof?.prover_push_address)}}>{"Chat"}</Button>}
      </div>
    )
  })}
{/* <img src={loadingDog} width={"140px"} height={"160px"} alt="loadinnng"></img> */}
  </div>
 
  <div className="button-verify">
 
  </div>


          </Typography>
        </Box>
      </Modal>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack} anchorOrigin={{ vertical, horizontal }}>
  <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
    Proof successfully created!
  </Alert>
</Snackbar>
<Snackbar open={openSnackError} autoHideDuration={6000} onClose={handleCloseSnackError} anchorOrigin={{ vertical, horizontal }}>
  <Alert onClose={handleCloseSnackError} severity="error" sx={{ width: '100%' }}>
    Proof not successful!
  </Alert>
</Snackbar>
<Snackbar open={openSnackVerify} autoHideDuration={6000} onClose={handleCloseSnackVerify} anchorOrigin={{ vertical, horizontal }}>
  <Alert onClose={handleCloseSnackVerify} severity="success" sx={{ width: '100%' }}>
    Verification successfull!
  </Alert>
</Snackbar>
<Snackbar open={openSnackVerifyError} autoHideDuration={6000} onClose={handleCloseSnackVerifyError} anchorOrigin={{ vertical, horizontal }}>
  <Alert onClose={handleCloseSnackVerifyError} severity="error" sx={{ width: '100%' }}>
   Verification not successful!
  </Alert>
</Snackbar>
</Grid>  
{isOpenChat && isConnected &&
  <Chat
   //support address, this belongs to you
   account={ethSigner.address}
  supportAddress={(new ethers.Wallet(pushAddr)).address}
  signer={ethSigner}
  theme={theme}
  env="staging" // can be "prod" or "staging"
/>
}
{isOpenChatVerify && isConnected &&
  <Chat
   //support address, this belongs to you
   account={ethSignerVerify.address}
  supportAddress={(new ethers.Wallet(pushAddrVerify)).address}
  signer={ethSignerVerify}
  theme={theme}
  env="staging" // can be "prod" or "staging"
/>
}
  
       </div>
    )
}
export default Home;





