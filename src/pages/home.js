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

function Home(){
  const [open, setOpen] = React.useState(false);
  const [isPrivate, setIsPrivate] = React.useState(true);
  const [isConnected, setIsConnected] = React.useState(false);
  const [proverAddress,setProverAddress] =  React.useState('');
  const [openProof, setOpenProof] = React.useState(false);

      const handleOpen= () => setOpen(true);
      const handleClose = () => setOpen(false);

      const handleOpenProof= () => setOpenProof(true);
      const handleCloseProof = () => setOpenProof(false);

      const handleInputChange = (event,type) => {
        setProverAddress(event.target.value);
      };

      const handleSubmit = (event) => {
        console.log(proverAddress,"proverAddress")
        // Do something with the input values, for example, log them
        
      };

      const handleSubmitVerify=()=>{
        console.log("verify")
      }

      React.useEffect(()=>{
        console.log(localStorage.getItem("walletAddress"),"local")
        if(localStorage.getItem("walletAddress")!==null){
          setIsConnected(true);
        }
        else{
          setIsConnected(false);
        }
      },[isConnected])
      console.log(isConnected,"connect")
    return (
        <header className="main-detail-header">
            <Grid container  rowSpacing={{ xs: 1, sm: 2, md: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
      <Navigation setIsConnected={(isConnected)=>setIsConnected(isConnected)}/>
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
  <Grid item xs={4}>
<Button onClick={handleOpenProof}>
<Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
<CardContent sx={{ fontSize: 14, }}>
<Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary" gutterBottom>
Address: 
</Typography>
<Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
Chain:
</Typography>
<Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
Estimated Profit
</Typography>
<Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
Name:
</Typography>
</CardContent>
<CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
<Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get All Proofs</Button>
</CardActions>
</Card>
</Button>
</Grid>

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
<Grid item xs={4}>
    <Button onClick={handleOpen}>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary" gutterBottom>
          Address: 
        </Typography>
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Chain:
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Estimated Profit
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Name:
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get My Profit</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
  <Grid item xs={4}>
    <Button>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary" gutterBottom>
          Address: 
        </Typography>
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Chain:
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Estimated Profit
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Name:
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get My Profit</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
  <Grid item xs={4}>
    <Button>
    <Card sx={{ minWidth: 375 ,backgroundColor:"#2B2A3A",boxShadow:"4px 6px 4px 6px black",padding:"2%"}} >
      <CardContent sx={{ fontSize: 14, }}>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary" gutterBottom>
          Address: 
        </Typography>
        <Typography sx={{ fontSize: 14 , textAlign:"left",color:"#b9b8c6"}} color="text.secondary">
         Chain:
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Estimated Profit
        </Typography>
        <Typography sx={{ fontSize: 14, textAlign:"left",color:"#b9b8c6" }} color="text.secondary">
          Name:
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Button sx={{backgroundColor:"#E69D72",color:"black" ,"&:hover": { color: 'blue'}}} size="small">Get My Profit</Button>
      </CardActions>
    </Card>
    </Button>
  </Grid>
 
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
    OK, lets get the profit!
  </div>
  <input placeholder='Address'  onChange={(e)=>handleInputChange(e)} className="form-input" type="text"/>
  <div className="button-verify">
  <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmit()}}>Get My Profit</Button>
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
        

  <div className="verify-content-flex">
    <div> Proof:</div>
   
    <div> Proof:</div>
  </div>
 
  <div className="button-verify">
  <Button type="button" sx={{backgroundColor:"#E69D72",padding:"2%",color:"black" ,"&:hover": { color: 'blue'}}} onClick={()=>{handleSubmitVerify()}}>Verify</Button>
  </div>


          </Typography>
        </Box>
      </Modal>
</Grid>  
            </header>
    )
}
export default Home;





