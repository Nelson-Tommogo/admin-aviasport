import Sparepart from "../models/Sparepart.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});

const addSparepart = async (req, res) => {
  try {
    const { name, brand, category, price, stock, description} = req.body;
    let image = req.body.image;
   
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }
    // save
    const part = new Sparepart({
      name,
      brand,      
      category,
      price,
      stock,
      description,
      image,
    });
    await part.save();
    res.json({ message: "SparePart uploaded!", part });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
   
  }
};

const getSparepart = async (req, res) => {
    try{
        const sparepart= await Sparepart.find();    
        if (sparepart) {
        res.json(sparepart);
        } else {
        res.status(401).json({ message: "No sparepart" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
  }
  };

  const updateSparepart = async (req, res) => {    
    try {
      const { id } = req.params;
      const { name, brand, category, price, stock, description } = req.body;
      let image = req.body.image;     
    
      let sparepart = await Sparepart.findById(id);
      if (!sparepart) {
        return res.status(404).json({ message: "Spare part not found" });
      }
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        image = result.secure_url;
      }
  
      sparepart = await Sparepart.findByIdAndUpdate(
        id,
        { name, brand, category, price, stock, description, image },
        { new: true } 
      );
  
      res.json({ message: "Part updated!", sparepart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getOneSparepart = async (req, res) => {
    try {
      const sparepart = await Sparepart.findById(req.params.id); 
  
      if (!sparepart) {
        return res.status(404).json({ message: "No spare part found" });
      }  
      res.json(sparepart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  const deleteSparepart = async (req, res) => {
    try {
      const sparepart = await Sparepart.findById(req.params.id); 
  
      if (!sparepart) {
        return res.status(404).json({ message: "No spare part found" });
      }
     
  
      await Sparepart.findByIdAndDelete(req.params.id);
  
      res.json({ message: "Spare part deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export  {addSparepart,getSparepart,deleteSparepart, updateSparepart, getOneSparepart};
