import express from "express";
import { TrainModel, GenerateImage, GenerateImagesFromPack } from 'common/types'
import { prisma } from "db";
import { S3Client , write } from "bun";
import { FalAiModel } from "./models/FalAiModel";
import { fal } from "@fal-ai/client";
const USER_ID = "123";

const app = express();
app.use(express.json())

const falAIModel = new FalAiModel();

app.get('/pre-signed-url', (req, res) => {
  const key = `models/${Date.now()}_${Math.random()}.zip`
  const url = S3Client.presign(key,{
    accessKeyId:process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:process.env.S3_SECRET_KEY,
    endpoint:process.env.ENDPOINT_URL,
    bucket: process.env.BUCKET_NAME,
    expiresIn: 3000
  })
  console.log(process.env.BUCKET_NAME)
  res.json({
    url,
    key
  })
})

app.post("/ai/training", async (req, res) => {
  const body = req.body;
  const images = body.images as string[]
  const { success } = TrainModel.safeParse(body);
  if (!success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const{request_id , response_url}   = await falAIModel.trainModel(body.zipUrl, body.name)
  const model = await prisma.model.create({
    data: {
      name: body.name,
      type: body.type,
      age: body.age,
      ethnicity: body.ethnicity,
      eyeColor: body.eyeColor,
      bald: body.bald,
      zipUrl: body.zipUrl,
      userId: USER_ID,
      falAIrequestID: request_id,
    }
  })
  res.json({ id: model.id })

});


app.post("/ai/generate", async (req, res) => {
  const body = req.body;
  const { success } = GenerateImage.safeParse(body);
  if (!success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const model = await prisma.model.findUnique({
    where: {  id: body.modelID }
  })
  if(!model||!model.tensorPath){
    res.status(400).json({ error: "Model not found" });
    return

  }
  const { request_id , response_url } = await falAIModel.generateImage(body.prompt, model.tensorPath)
  const img = await prisma.outputImages.create({
    data: {
      prompt: body.prompt,
      modelID: body.modelID,
      userID: USER_ID,
      imageUrl: "",
      falAIrequestID: request_id

    }
  })
  res.json({ id: img.id })

});

app.post("/pack/generate", async (req, res) => {
  const body = req.body;
  const { success } = GenerateImagesFromPack.safeParse(body);
  if (!success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const prompts = await prisma.packPrompt.findMany({
    where: {
      packId: body.packID
    }
  })

  let requestIds: {request_id:string}[] = await  Promise.all(prompts.map(async (prompt) => falAIModel.generateImage(prompt.prompt, body.modelID)))
  const images = await prisma.outputImages.createManyAndReturn({
    data: prompts.map((prompt,index) => ({
      prompt: prompt.prompt,
      modelID: body.modelID,
      userID: USER_ID,
      imageUrl: "",
      falAIrequestID: requestIds[index]?.request_id
    }))
  })
  res.json({ images: images.map((image) => image.id) })

});

app.get("/pack/bulk", async (req, res) => {

  const packs = await prisma.packs.findMany({})
  res.json({ packs: packs })

});

app.get("/image/bulk", async (req, res) => {
  const ids = req.query.images as string[]
  const limit = req.query.limit as string ?? "10"
  const offset = req.query.offset as string ?? "0"


  const imagesData = await prisma.outputImages.findMany({
    where: {
      id: {
        in: ids
      },
      userID: USER_ID
    },
    skip: parseInt(offset),
    take: parseInt(limit)
  })
  res.json({ images: imagesData })
});

app.post('/fal-ai/webhook/train', async (req, res) => {
  const requestId = req.body.request_id;
  //update the db with the training status
  await prisma.model.updateMany({
    where: {
      falAIrequestID: requestId
    },
    data: {
      trainingStatus: "Completed",
      tensorPath: req.body.tensor_path

    }
  });
  res.json({ msg: "webhook received" })
})

app.post('/fal-ai/webhook/image', async (req, res) => {
  const requestId = req.body.request_id;
  //update the db with the training status
  await prisma.outputImages.updateMany({
    where: {
      falAIrequestID: requestId
    },
    data: {
      status: "Generated",
      imageUrl: req.body.image_url

    }
  });
  res.json({ msg: "webhook received" })
});



const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});


