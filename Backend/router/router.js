const express = require('express')
const router = express.Router();
const multer=require('multer')
const path=require('path')
const fs = require('fs');

const templateController=require('../controller/templateController')
const loginController=require('../controller/authController') 
const placeholderController=require('../controller/placeholderController')
const otpController=require('../controller/otpController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        
        
        // Check if directory exists; if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        
        
        cb(null, uploadPath);
       
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const upload = multer({ storage: storage });

// Define routes
router.post('/upload/:id', upload.single('file'), templateController.uploadFile);
router.get('/template_list/:id', templateController.getFiles);
router.get('/document_list/:id', templateController.getDocument);
router.post('/extract_placeholder',placeholderController.extractPlaceholders );
router.post('/replace_placeholder',placeholderController.replacePlaceholders );
router.post('/sign_up',loginController.userSignUp)
router.post('/reset_password',loginController.resetPassword)
router.post('/log_in',loginController.userLogIn)
router.post('/otp',otpController.sendEmail);
router.get('/:otp/:email',otpController.verifyOtp);
router.put('/update',otpController.updatePassword);


module.exports= router