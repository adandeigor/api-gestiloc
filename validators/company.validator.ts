import { z } from "zod";

const CompanyValidator = z.object({
    name : z.string().min(1, "Le nom est requis"),
    type : z.string().min(1, "Le type est requis"),
    registre_commerce_number : z.string().min(2, "Le numéro du registre de commerce est requis"),
    registre_commerce_file : z.string().min(1, "Le fichier du registre de commerce est requis"),
    address : z.string().min(1, "L'adresse est requise"),
    latitude : z.number().min(1, "La latitude est requise"),
    longitude : z.number().min(1, "La longitude est requise"),
    description : z.string().min(1, "La description est requise"),
})

const CompanyUpdateValidator = z.object({
    name : z.string().optional().nullable(),
    type : z.string().optional().nullable(),
    registre_commerce_number : z.string().optional().nullable(),
    registre_commerce_file : z.string().optional().nullable(),
    address : z.string().optional().nullable(),
    latitude : z.string().optional().nullable(),
    longitude : z.string().optional().nullable(),
    description : z.string().optional().nullable(),
})
export  {CompanyValidator, CompanyUpdateValidator}