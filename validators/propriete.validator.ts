import { z } from "zod";

const ProprieteSchemaValidator = z.object({
    nom : z.string().min(1, "Le nom de la propriété est requis"),
    adresse : z.string().min(1, "L'adresse de la propriété est requis"),
    ville : z.string().min(1, "La ville de localisation de la propriété est requise"),
    codePostal : z.string().min(3, "Le code postal de la propriété est requis"),
    pays : z.string().min(2, "Le nom du pays est requis"),
    localisation : z.object({
        longitude : z.number().min(1, "La longitude est requise"),
        latitude : z.number().min(1, "La lagitude est requise")
    })
})

const ProprieteUpdateSchemaValidator = z.object({
    nom : z.string().optional(),
    adresse : z.string().optional(),
    ville : z.string().optional(),
    codePostal : z.string().optional(),
    pays : z.string().optional(),
    localisation : z.object({
        longitude : z.number().optional(),
        latitude : z.number().optional()
    }).optional()
})

export default {ProprieteSchemaValidator, ProprieteUpdateSchemaValidator}