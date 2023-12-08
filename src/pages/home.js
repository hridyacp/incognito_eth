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
import abi from "../abi/abi.json"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#2B2A3A',
  border: '2px solid #000',
  boxShadow: '4px 6px 4px 6px black',
  p: 4,
  color:"#b9b8c6",
  maxHeight:"500px",
  overflowY:"auto",
  scrollbarWidth: "thin"
};

function Home(){
  const [open, setOpen] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [proverAddress,setProverAddress] =  React.useState('');
  const [currentAddress,setCurrentAddress] =  React.useState('');
  const [openProof, setOpenProof] = React.useState(false);
  const [challenges,setChallenges] = React.useState([]);
  const [myChallenges,setMyChallenges] = React.useState([]);
  const [challengeId,setChallengeId] =  React.useState('');
  const [myProofs,setMyProofs] = React.useState([]);
  const [isSign,setIsSign] = React.useState(false);
  const [signature,setSignature] = React.useState('');
  const [amount,setAmount] = React.useState('');
  const [nickName,setNickName] = React.useState('');
  const ethers = require("ethers");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackError, setOpenSnackError] = React.useState(false);
  const [isChallengeCreated, setIsChallengeCreated] = React.useState(false);

  const fetch = require('node-fetch');

      const handleOpen= (id) => {setOpen(true);setChallengeId(id)};
      const handleClose = () => {setOpen(false)}

      const handleOpenProof= (proof) => {setOpenProof(true);setMyProofs(proof)}
      const handleCloseProof = () => setOpenProof(false);

      const handleOpenSnack=()=>setOpenSnack(true)
      const handleCloseSnack=()=>setOpenSnack(false);

      const handleOpenSnackError=()=>setOpenSnackError(true)
      const handleCloseSnackError=()=>setOpenSnackError(false);

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

      const handleSubmitVerify=async(cid,chalngID)=>{
        console.log( await downloadFile(cid),"cccccccccc")
        const proof= await downloadFile(cid);
        console.log(proof,"ddddddd")
        try{
        const hashNick=await axios.post("http://localhost:3001/user/nickHash",{nick_name:nickName})
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x634F9Bc798A228C6Ed8fD4A14A2b907498146809",abi,signer);
        contract.getVerified(chalngID,`0x${proof}`,hashNick.data.data);
        }
        catch{
          console.log("err");
        }
      }
      async function downloadFile(cid){
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
        return Buffer.from(await response.arrayBuffer()).toString()
      };
      React.useEffect(()=>{
        console.log(localStorage.getItem("nickName"),"local");
        const myAddress=localStorage.getItem("walletAddress");
        setCurrentAddress(myAddress);
        if(localStorage.getItem("nickName")!==null){
          const nickNm=localStorage.getItem("nickName")
          setIsConnected(true);
          setNickName(nickNm)
        getMyChallenges(myAddress)
        }
        else{
          setIsConnected(false);
        }
      },[isConnected])

      const getMyChallenges=async(addrs)=>{
        try{
         const getMyChalResponse= await axios.post("http://localhost:3001/challenge/getMyChallenges",{wallet_address:addrs})
            setMyChallenges(getMyChalResponse.data.data);
            console.log(getMyChalResponse.data.data,"Mychal")
          }
          catch{
            console.log("err");
          }
      }

      React.useEffect(()=>{
     getChallenges();
      },[])

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
      },[isChallengeCreated,challenges])

      console.log(currentAddress,"connect")
    return (
        <header className="main-detail-header">
            <Grid container  rowSpacing={{ xs: 1, sm: 2, md: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
      <Navigation setIsConnected={(isConnected)=>setIsConnected(isConnected)} isConnected={isConnected}/>
  </Grid>
  {isConnected &&
  <>
  <Grid container item xs={12} sx={{paddingBottom:"1%"}}>
 
           
                <Button sx={{height:"40px",color:"#b9b8c6",backgroundColor:"#2B2A3A",boxShadow:"none",cursor:"default"}} >
                  <h3>My Challanges</h3></Button>
                
                </Grid>
          
  <Grid container item xs={12} >
  <div className='private-container'>
  <Grid container item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {myChallenges && myChallenges?.length>0 && myChallenges?.map((myChallenge)=>{
    return(
<Grid item xs={4}>
    <Button onClick={()=>{handleOpenProof(myChallenge?.proofs)}}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Address: {myChallenge?.challenger_address}
        </Typography> */}
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Challenge ID: {myChallenge?.challenge_id}
        </Typography>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Holdings: { myChallenge?.holdings && myChallenge?.holdings?.length>0 && myChallenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography> */}
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Platform: {myChallenge?.platform}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Profit %: {myChallenge?.profit_percentage}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Verify</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
    )
  })}

</Grid>
</div>
</Grid>
</>}

<Grid item xs={12} justifyContent={"left"} alignContent={"left"}>
<Button sx={{height:"40px",color:"#b9b8c6",backgroundColor:"#2B2A3A","&:hover": { backgroundColor:"#2B2A3A",cursor:"default"}}}> <h3 style={{color:"#b9b8c6"}}>Challenges</h3></Button>
</Grid>
<Grid container item xs={12} >
                     <div className='private-container'>
<Grid container item rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  {challenges && challenges?.length>0 && challenges?.map((challenge)=>{
    return(
      <>
      {(challenge?.challenger_address).toLowerCase()!==currentAddress&&
<Grid item xs={4}>
    <Button onClick={isConnected?()=> handleOpen(challenge?.challenge_id):handleClose}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Address: {challenge?.challenger_address}
        </Typography> */}
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Challenge ID: {challenge?.challenge_id}
        </Typography>
        {/* <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Holdings: { challenge?.holdings && challenge?.holdings?.length>0 && challenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography> */}
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Platform: {challenge?.platform}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Profit %: {challenge?.profit_percentage}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get My Profit</Button>
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
  </Grid>
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
  {isSign?
  <h4>Sign your message!</h4>:
  <h4> OK, lets get the profit!</h4>}
   
  </div>
  <div className="button-verify">
  {isSign? <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small" onClick={()=>{handleSubmitSign()}}>Sign</Button>
        :   <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmit()}}>Get My Profit</Button>}
 
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
          <Button sx={{height:"40px",color:"#b9b8c6",backgroundColor:"#2B2A3A",boxShadow:"none",cursor:"default"}} >
                  <h3>Proofs</h3></Button>
                
  <div className="verify-content-flex">
  {myProofs?.map((proof,index)=>{
    return(
      <div className="content-container">
       <div className="verify-content-flex-inner" key={index}>
       <div>Challenge ID: {proof?.challenge_id} </div>
       <div className="ipfs">IPFS Proof: {truncateString(proof?.ipfs_proof,16)} </div>
       <span className="tooltiptext">{proof?.ipfs_proof}</span>
       <div>Prover Nick Name: {proof?.prover_nick_name} </div>
       <div>Actual Profit: {proof?.actualProfit} </div>
     
      </div>
     
      <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",width:"250px",
       color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmitVerify(proof?.ipfs_proof,proof?.challenge_id)}}>Verify</Button>
   
      </div>
    )
  })}
  
  </div>
 
  <div className="button-verify">
 
  </div>


          </Typography>
        </Box>
      </Modal>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
  <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
    Proof successfully created!
  </Alert>
</Snackbar>
<Snackbar open={openSnackError} autoHideDuration={6000} onClose={handleCloseSnackError}>
  <Alert onClose={handleCloseSnackError} severity="error" sx={{ width: '100%' }}>
    Proof not successful!
  </Alert>
</Snackbar>
</Grid>  
            </header>
    )
}
export default Home;





