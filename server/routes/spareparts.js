
import express from "express";
import multer from "multer";
import {
    addSparepart,
    deleteSparepart, 
    getOneSparepart, 
    getSparepart,
    updateSparepart
    } from "../controllers/sparepartsController.js";

const sparepartRoutes= express.Router();
// const storage = multer.diskStorage({});
// const upload = multer({ storage });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


sparepartRoutes.post("/sparepart",upload.single("image"), addSparepart );
sparepartRoutes.get("/sparepart", getSparepart );
sparepartRoutes.get("/sparepart/:id",getOneSparepart);
sparepartRoutes.put("/sparepart/:id", upload.single("image"), updateSparepart );
sparepartRoutes.delete("/sparepart/:id", deleteSparepart);

export default sparepartRoutes;