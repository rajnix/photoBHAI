import { z } from "zod";

export const TrainModel=z.object({
    name:z.string(),
    type:z.enum(["man","woman","others"]),
    age:z.number(),
    ethnicity:z.enum([
        "White",
        "Black",
        "Asian",
        "Asian American",
        "East Asian",
        "South Asian",
        "Hispanic",
        "Pacific",
        "Middle Eastern",
        "South East Asian"
    ]),
    eyeColor:z.enum([
        "Brown",
        "Blue",
        "Hazel",
        "Gray"
    ]),
    bald:z.boolean(),
    images:z.array(z.string())

})

export const GenerateImage = z.object({
    prompt:z.string(),
    modelID:z.string(),
    num:z.number()
})

export const GenerateImagesFromPack = z.object({
    modelID:z.string(),
    packID:z.string(),
})