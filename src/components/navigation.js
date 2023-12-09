import './navigation.css';
import Button from '@mui/material/Button';
// import ethers from "ethers";
import { useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Alert, Grid, Snackbar } from '@mui/material';
import { FormControl, FormLabel, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import abi from "../abi/abi.json";
import loadingDog from '../Assets/detective-load.gif';
import logo from '../Assets/logo.png';

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
  color:"#b9b8c6",
};
const stylesNick = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'bisque',
  border: '2px solid #000',
  boxShadow: '4px 6px 4px 6px black',
  p: 4,
  color:"#b9b8c6",
  height:"220px"
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: "bisque"
    },
  },
};

const platforms = [
 "Sushi Swap"
];
const holdings = [
  "USDC",
  "BTC",
  "WETH"
];

function getStyles(platform, platformName, theme) {
  return {
    fontWeight:
      platformName.indexOf(platform) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function Navigation({setIsConnected,isConnected,setMyChallenges}) {
  const [account,setAccount]=useState();
  const [open, setOpen] = React.useState(false);
  const [signedValue, setSignedValue] = useState('');
  const [isNickName,setIsNickName] = useState(false);
  const [nickName,setNickName] = useState('');
  const [platformtype, setPlatformType] = useState('');
  const [holdingType, setHoldingType] = useState([]);
  const ethers = require("ethers");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackError, setOpenSnackError] = React.useState(false);
  const [isVerified,setIsVerified] = React.useState(false);

  const theme = useTheme();
  const connectWallet=async()=>{      
    if (window.ethereum) {
     const accounts= await window.ethereum.request({ method: 'eth_requestAccounts' });
     console.log(accounts,"accounts")
     setAccount(accounts[0])
     localStorage.setItem("walletAddress",accounts[0]);
     try{
      console.log(accounts[0],"check")
    let response= await axios.post('http://localhost:3001/user/checkUser',{wallet_address:accounts[0]})
    console.log(response,"res")
      if(response.data.res===true){
        setNickName(response.data.nick_name)
        setIsConnected(true);
        setIsNickName(false);
        localStorage.setItem("nickName",response.data.nick_name);
        localStorage.setItem("pushID",response.data.push_address);
      }else{
        setIsConnected(false);
        setIsNickName(true);
      }
    }
    catch{
      console.log("err");
    }
   
     //If yes
     //setIsConnected(true);
     //setIsNickName(false)
     //else
   
     //send another api with nickname and wallet address
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }
 
  React.useEffect(()=>{
    console.log(localStorage.getItem("nickName"),"wallet")
    if(localStorage.getItem("nickName")!==null){
      let nickNames=localStorage.getItem("nickName")
      console.log(localStorage.getItem("walletAddress"),"accnthhh")
      setAccount(localStorage.getItem("walletAddress"));
      setNickName(nickNames)
      if(nickNames!==null){
      setIsConnected(true)
      }
    }
  },[])

  const handleOpen = () => {setOpen(true); setIsVerified(false);}
  const handleClose = () => setOpen(false);

  const handleCloseNick = () => setIsNickName(false);

 console.log(account,"account")
    
 const handleOpenSnack=()=>setOpenSnack(true)
 const handleCloseSnack=()=>setOpenSnack(false);

 const handleOpenSnackError=()=>setOpenSnackError(true)
 const handleCloseSnackError=()=>setOpenSnackError(false);
  // Event handler for input
  const handleInputChange = (event,type) => {
    setSignedValue(event.target.value);
  };

  const handleNickChange = (event,type) => {
    setNickName(event.target.value);
 
  };

  const handleChange = (event)=>{
   setPlatformType(event.target.value);
  }

  const handleChangeHolding = (event)=>{
    const {
      target: { value },
    } = event;
    setHoldingType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
   }
 

  // Event handler for form submission
  const handleSubmit = async(event) => {
    // event.preventDefault();
    // Do something with the input values, for example, log them
    console.log('Input 1:', signedValue);
    console.log('Input 2:', platformtype);
    console.log('Input 3:', holdingType);
    console.log(account,signedValue,"wal")
    setIsVerified(true);
    const acc=localStorage.getItem("walletAddress");
    await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0x634F9Bc798A228C6Ed8fD4A14A2b907498146809",abi,signer);
       const contr= await contract.createChallenge(acc,signedValue*100,["0x634F9Bc798A228C6Ed8fD4A14A2b907498146809","0x634F9Bc798A228C6Ed8fD4A14A2b907498146809","0x634F9Bc798A228C6Ed8fD4A14A2b907498146809","0x634F9Bc798A228C6Ed8fD4A14A2b907498146809","0x634F9Bc798A228C6Ed8fD4A14A2b907498146809"],"0x634F9Bc798A228C6Ed8fD4A14A2b907498146809");
       provider.once(contr.hash, (transaction,error) => {
        // Emitted when the transaction has been mined
    if(transaction){
      getMyChallenge()
    }
    else{
      console.log(error)
    }
    })
         console.log(contr,"contr")
       
      

       setOpen(false)
        //   if(window.ethereum){
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const signer = provider.getSigner()
  //   const tx = await signer.sendTransaction({
  //       to: waladdress,
  //       value: signedValue
  //   })
  //   return tx.hash
  // }
  };
  
  const getMyChallenge=async()=>{
     const addr= await ethers.utils.getAddress(account);
      try{
       const getMyChalResponse= await axios.post("http://localhost:3001/challenge/getMyChallenges",{wallet_address:addr})
          setMyChallenges(getMyChalResponse.data.data);
          console.log(getMyChalResponse.data.data,"Mychal")
        }
        catch{
          console.log("err");
        }
    }

  //Event handler for nick name form
  const handleSubmitNick = async(event) => {
    // event.preventDefault();
    // Do something with the input values, for example, log them
    console.log('Input 1:', nickName);
    setIsNickName(false);
    try{
      console.log(account,"add user")
    let response=await axios.post('http://localhost:3001/user/addUser',{wallet_address:account,nick_name:nickName})
    //API to send nickname
  
    if(response.data.res===true){
      localStorage.setItem("nickName",nickName)
      localStorage.setItem("pushID",response.data.push_address)
      setIsConnected(true);
    }
  }catch{
    console.log("err");
  }
  };
  React.useEffect(()=>{
console.log(isConnected)
  },[isConnected])

  React.useEffect(()=>{
   if(window.ethereum){
    window.ethereum.on('accountsChanged', (accounts) => {
    if(accounts?.length===0){
    localStorage.clear();
    setIsConnected(false);
    }
  });
   }
  },[])


    return (
      <div className="mainHeader">
        <div className='main-logo'>
        <img src={logo} width={"160px"} height={"100px"}alt="logo"/>
         </div>
        <div className='main-logo'>
         INCOGNITO INSIGHT
         </div>
         <div className='connect-button'>
          {!isConnected?
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif",fontSize:"16px","&:hover": { color: 'black',backgroundColor:"#E69D72"},}} onClick={connectWallet}>CONNECT WALLET</Button>
        : <Button sx={{backgroundColor:"#E69D72",color:"black",fontWeight:700,fontFamily:"'Kalnia', serif",fontSize:"16px","&:hover": { color: 'black',backgroundColor:"#E69D72"},}} onClick={handleOpen}>CREATE</Button>}
        </div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
          <div className="form-main">
<form className="convert-form">
  {!isVerified ?
<label className="form-head">Create Challenge</label>
: <label className="form-head">The Game's Afoot!!</label>}
<div className="form-content-modal">
{!isVerified ?
<>
<FormControl sx={{ m: 1, mt: 2, mb:2, borderRadius: "5px", background: "transparent",border: "none",
    backgroundColor: "bisque",opacity:0.5,width: "280px",height:"40px",color:"black",fontSize: "large" }}>
       <InputLabel focused={false} sx={{color:"black",fontSize: "large","&:focus": { borderColor: "black",outline:"none",position:"relative"}}}>Platform</InputLabel>
        <Select
          displayEmpty
          value={platformtype}
          onChange={handleChange}
         
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' , border:"none"}}
          sx={{ width: "280px",height:"42px", width: "284px",borderColor: "black","&:focus": { borderColor: "black",outline:"none"}}}
        >
        
          {platforms.map((platform) => (
            <MenuItem
              key={platform}
              value={platform}
              style={getStyles(platform, platformtype, theme)}
            >
              {platform}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
     
  <input placeholder='Profit'  onChange={(e)=>handleInputChange(e,"profit")} className="form-input" type="text"/>
 

  <FormControl sx={{ m: 1, mt: 2,  borderRadius: "5px", background: "transparent",border: "none",
    backgroundColor: "bisque",opacity:0.5,width: "280px",height:"40px",color:"black",fontSize: "large" }}>
    <InputLabel id="demo-multiple-checkbox-label" sx={{color:"black",fontSize: "large",height:"42px"}}>Holdings</InputLabel>
        <Select
     
        multiple
          displayEmpty
          value={holdingType}
          onChange={handleChangeHolding}
        
          MenuProps={MenuProps}
          renderValue={(selected) => selected.join(', ')}
          inputProps={{ 'aria-label': 'Without label' , border:"none"}}
          sx={{ width: "280px",height:"42px", width: "284px",borderColor: "#b9b8c6","&:focus": { borderColor: "#b9b8c6"}}}
        >
            
          {holdings.map((holding) => (
            <MenuItem
              key={holding}
              value={holding}
              style={getStyles(holding, holdingType, theme)}
            >
              <Checkbox checked={holdingType.indexOf(holding) > -1} />
              <ListItemText primary={holding} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
  <div className="button-form">
  <Button type="button" sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif","&:hover": { color: 'black',backgroundColor:"#E69D72"}}} onClick={()=>{handleSubmit()}}>Create</Button>

  </div>
  </>
  :  <div style={{paddingTop:"5%"}}>
  <img src={loadingDog} width={"140px"} height={"160px"} alt="loadinnng"></img>
  </div>}
  </div>
 
</form>
</div>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={isNickName}
        onClose={handleCloseNick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={stylesNick}>
        
          <Typography id="modal-modal-description" sx={{ mt: 2,height:"200px" }}>
          <div className="form-main">
<form className="convert-form-nick">
<label className="form-head">Add Nick Name</label>
<div className="form-content">
  <input placeholder="Nick Name"  onChange={(e)=>handleNickChange(e,"nick")} className="form-input" type="text"/>
  <div className="button-form" style={{paddingTop:"1%"}}>
  <Button type="button" sx={{backgroundColor:"#E69D72",color:"black" ,fontWeight:700,fontFamily:"'Kalnia', serif","&:hover": { color: 'black',backgroundColor:"#E69D72",}}} onClick={()=>{handleSubmitNick()}}>Submit</Button>
  </div>
  </div>
 
</form>
</div>
          </Typography>
        </Box>
      </Modal>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
  <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
    Proof successfully created!
  </Alert>
</Snackbar>
      </div>
    );
  }
  
  export default Navigation;

  