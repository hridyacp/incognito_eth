import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import Navigation from '../components/navigation';
import '../App.css';
import Modal from '@mui/material/Modal';
import axios from 'axios';


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

      const handleOpen= (id) => {setOpen(true);setChallengeId(id)};
      const handleClose = () => {setOpen(false)}

      const handleOpenProof= (proof) => {setOpenProof(true);setMyProofs(proof)}
      const handleCloseProof = () => setOpenProof(false);

      const handleSubmit = async(event) => {
        let proverAdd=localStorage.getItem("walletAddress");
        setProverAddress(localStorage.getItem("walletAddress"))
       const proofResponse=await axios.post("http://localhost:3001/calculateProfit",{user_address:proverAdd,challenge_id:challengeId})
       console.log(proofResponse,"pres")
       if(proofResponse.data?.data!==null && proofResponse.data?.data!==''){
        setIsSign(true);
       }
       else{
        isSign(false);
       }
        // Do something with the input values, for example, log them
        
      };
      const handleSubmitSign=()=>{
setIsSign(false);
setOpen(false);
      }

      const handleSubmitVerify=()=>{
        console.log("verify")
      }

      React.useEffect(()=>{
        console.log(localStorage.getItem("nickName"),"local");
        const myAddress=localStorage.getItem("walletAddress");
        setCurrentAddress(myAddress);
        if(localStorage.getItem("nickName")!==null){
          setIsConnected(true);
          axios.post("http://localhost:3001/getMyChallenges",{wallet_address:myAddress}).then(async(res)=>{
            setMyChallenges(res.data.data);
            console.log(res.data.data,"Mychal")
           })
        }
        else{
          setIsConnected(false);
        }
      },[isConnected])

      React.useEffect(()=>{
   axios.post("http://localhost:3001/getChallenges").then(async(res)=>{
    setChallenges(res.data.data);
    console.log(res.data.data)
   })
   .catch((err)=>{
    console.log(err)
   })
      },[])

      console.log(myProofs,"connect")
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
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Address: {myChallenge?.challenger_address}
        </Typography>
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Challenge ID: {myChallenge?.challenge_id}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Holdings: { myChallenge?.holdings && myChallenge?.holdings?.length>0 && myChallenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Platform: {myChallenge?.platform}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Profit %: {myChallenge?.profit_percentage}
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get My Profit</Button>
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
      {challenge?.challenger_address!==currentAddress&&
<Grid item xs={4}>
    <Button onClick={isConnected?()=> handleOpen(challenge?.challenge_id):handleClose}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Address: {challenge?.challenger_address}
        </Typography>
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Challenge ID: {challenge?.challenge_id}
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Holdings: { challenge?.holdings && challenge?.holdings?.length>0 && challenge?.holdings?.map((holding,index)=>{
            console.log(holding,"hold")
    return(
      <div key={index}>
    {index+1} {holding}
      </div>
    )})}
        </Typography>
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
       <div>IPFS Proof: {proof?.ipfs_proof} </div>
       <div>Prover Nick Name: {proof?.prover_nick_name} </div>
       <div>Actual Profit: {proof?.actualProfit} </div>
     
      </div>
     
      <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",width:"250px",
       color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmitVerify()}}>Verify</Button>
   
      </div>
    )
  })}
  
  </div>
 
  <div className="button-verify">
 
  </div>


          </Typography>
        </Box>
      </Modal>
</Grid>  
            </header>
    )
}
export default Home;





