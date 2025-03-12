import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from 'common/types'
import { prisma } from "db";
const USER_ID = "123";

const app = express();
app.use(express.json())

app.post("/ai/training", async (req, res) => {
  const body = req.body;
  const { success } = TrainModel.safeParse(body);
  if (!success) {
     res.status(400).json({ error: "Invalid request body" });
     return;
  }

  const model = await prisma.model.create({
    data: {
      name: body.name,
      type: body.type,
      age: body.age,
      ethnicity: body.ethnicity,
      eyeColor: body.eyeColor,
      bald: body.bald,
      trainingImages: body.images,
      userId:USER_ID
    }
  })
   res.json({id:model.id})

});


app.post("/ai/generate", async (req, res) => {
        const body = req.body;
        const {success} = GenerateImage.safeParse(body);
        if(!success){
            res.status(400).json({error:"Invalid request body"});
            return;
        }

        const img  = await prisma.outputImages.create({
            data:{
                prompt:body.prompt,
                modelID:body.modelID,
                userID:USER_ID,
                imageUrl:"",
                
            }
        })
        res.json({id:img.id})
        
});

app.post("/pack/generate", async (req, res) => {
     const body = req.body;
     const {success} = GenerateImagesFromPack.safeParse(body);
     if(!success){
        res.status(400).json({error:"Invalid request body"});
        return;
     }
     const prompts = await prisma.packPrompt.findMany({
      where:{
        packId:body.packID
      }
     })
     const images = await prisma.outputImages.createManyAndReturn({
      data:prompts.map((prompt)=>({
        prompt:prompt.prompt,
        modelID:body.modelID,
        userID:USER_ID,
        imageUrl:"",
      }))
     })
     res.json({images:images.map((image)=>image.id)})
    
});

app.get("/pack/bulk", async (req, res) => {
 
    const packs = await prisma.packs.findMany({})
    res.json({packs:packs})
    
});

app.get("/image/bulk", async (req, res) => {
      const images = req.query.images as string[]
      const limit = req.query.limit as string ?? "10"
      const offset = req.query.offset as string ?? "0"


      const imagesData = await prisma.outputImages.findMany({
        where:{
          id:{
            in:images
          },
          userID:USER_ID
        },
        skip:parseInt(offset),
        take:parseInt(limit)
      })
      res.json({images:imagesData})
});



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});


