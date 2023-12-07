import './navigation.css';
import Button from '@mui/material/Button';
// import ethers from "ethers";
import { useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormControl, FormLabel, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
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
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const platforms = [
  "One",
  "Two",
  "Three"
];
const holdings = [
  "Four",
  "Five",
  "Six"
];

function getStyles(platform, platformName, theme) {
  return {
    fontWeight:
      platformName.indexOf(platform) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
function Navigation({setIsConnected}) {
  const [account,setAccount]=useState();
  const [open, setOpen] = React.useState(false);
  const [signedValue, setSignedValue] = useState('');
  const [waladdress, setWalAddress] = useState('');
  const [isNickName,setIsNickName] = useState(false);
  const [nickName,setNickName] = useState('');
  const [waladdressNick, setWalAddressNick] = useState('');
  const [platformtype, setPlatformType] = useState('');
  const [holdingType, setHoldingType] = useState([]);
  const ethers = require("ethers");
  

  const theme = useTheme();
  const connectWallet=async()=>{      
    if (window.ethereum) {
     const accounts= await window.ethereum.request({ method: 'eth_requestAccounts' });
     console.log(accounts,"accounts")
     setAccount(accounts[0])
     localStorage.setItem("walletAddress",accounts[0]);
    let response= await axios.post('http://localhost:3001/checkUser',{wallet_address:accounts[0]})
    console.log(response,"res")
      if(response.data.res===true){
        setNickName(response.data.nick_name)
        setIsConnected(true);
        setIsNickName(false);
      }else{
        setIsNickName(true);
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
    console.log(localStorage.getItem("walletAddress"))
    if(localStorage.getItem("walletAddress")!==''){
      let accountValue= localStorage.getItem("walletAddress")
      setAccount(accountValue);
      if(accountValue!==null){
      setIsConnected(true)
      }
    }
  },[])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseNick = () => setIsNickName(false);

 console.log(account,"account")
    

  // Event handler for input
  const handleInputChange = (event,type) => {
    setSignedValue(event.target.value);
  };

  const handleNickChange = (event,type) => {
    if(type==='nick')
    setNickName(event.target.value);
  else 
  setWalAddressNick(event.target.value);
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
  
  //Event handler for nick name form
  const handleSubmitNick = async(event) => {
    // event.preventDefault();
    // Do something with the input values, for example, log them
    console.log('Input 1:', nickName);
    console.log('Input 2:', waladdressNick);
    setIsNickName(false);
    let response=await axios.post('http://localhost:3001/addUser',{wallet_address:waladdressNick,nick_name:nickName})
    //API to send nickname
    if(response.data.res===true){
      setNickName(response.data.nick_name)
    }
   
  };

    return (
      <div className="mainHeader">
        <div className='main-logo'>
         Incognito
         </div>
         <div className='connect-button'>
          {account==='' || account===undefined || account===null?
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'},}} onClick={connectWallet}>CONNECT WALLET</Button>
        : <Button sx={{backgroundColor:"#E69D72",color:"black","&:hover": { color: 'blue'},}} onClick={handleOpen}>ADD</Button>}
        </div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="form-main">
<form className="convert-form">
<label className="form-head">Create Challenge</label>
<div className="form-content">

<FormControl sx={{ m: 1, mt: 2,  borderRadius: "5px", background: "transparent",border: "none",
    backgroundColor: "#b9b8c6",opacity:0.5,width: "280px",height:"38px",color:"#2B2A3A",fontSize: "large" }}>
       <InputLabel id="demo-multiple-checkbox-label" sx={{color:"#2B2A3A",fontSize: "large",}}>Platform</InputLabel>
        <Select
          displayEmpty
          value={platformtype}
          onChange={handleChange}
          input={<OutlinedInput />}
         
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' , border:"none"}}
          sx={{ width: "280px",height:"38px",borderColor: "#b9b8c6","&:focus": { borderColor: "#b9b8c6"}}}
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
    backgroundColor: "#b9b8c6",opacity:0.5,width: "280px",height:"38px",color:"#2B2A3A",fontSize: "large" }}>
    <InputLabel id="demo-multiple-checkbox-label" sx={{color:"#2B2A3A",fontSize: "large",height:"38px"}}>Holdings</InputLabel>
        <Select
     
        multiple
          displayEmpty
          value={holdingType}
          onChange={handleChangeHolding}
         
          input={<OutlinedInput />}
          MenuProps={MenuProps}
          renderValue={(selected) => selected.join(', ')}
          inputProps={{ 'aria-label': 'Without label' , border:"none"}}
          sx={{ width: "280px",height:"38px",borderColor: "#b9b8c6","&:focus": { borderColor: "#b9b8c6"}}}
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
  <Button type="button" sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmit()}}>Send</Button>
  </div>
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
        <Box sx={style}>
        
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="form-main">
<form className="convert-form">
<label className="form-head">Add Nick Name</label>
<div className="form-content">
  <input placeholder="nick"  onChange={(e)=>handleNickChange(e,"nick")} className="form-input" type="text"/>
  <input placeholder="Address" onChange={(e)=>handleNickChange(e,"address")} className="form-input" type="text"/>
  <div className="button-form">
  <Button type="button" sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmitNick()}}>Submit</Button>
  </div>
  </div>
 
</form>
</div>
          </Typography>
        </Box>
      </Modal>
      </div>
    );
  }
  
  export default Navigation;

  