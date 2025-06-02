import { PrismaClient, GestionnaireStatut, GestionnaireRole, TypeEtatDesLieux } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  // Nettoyer la base de données
  await prisma.signature.deleteMany();
  await prisma.paymentLink.deleteMany();
  await prisma.paiement.deleteMany();
  await prisma.avenant.deleteMany();
  await prisma.etatDesLieux.deleteMany();
  await prisma.chargeDetaillee.deleteMany();
  await prisma.contrat.deleteMany();
  await prisma.locataire.deleteMany();
  await prisma.uniteLocative.deleteMany();
  await prisma.propriete.deleteMany();
  await prisma.dossierGestionnaire.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.session.deleteMany();
  await prisma.company.deleteMany();
  await prisma.gestionnaire.deleteMany();

  // Créer un gestionnaire admin avec identifiants fixes
  const adminCredentials = {
    email: 'admin@gestiloc.com',
    password: 'Admin123!',
  };

  const adminGestionnaire = await prisma.gestionnaire.create({
    data: {
      email: adminCredentials.email,
      motDePasse: await bcrypt.hash(adminCredentials.password, 10),
      nom: 'Admin',
      prenom: 'Gestiloc',
      telephone: '+33612345678',
      isAdmin: true,
      statut: GestionnaireStatut.VALIDE,
      dossiergestionnaire: {
        create: {
          ifu_number: 'IFU-ADMIN-001',
          ifu_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
          carte_identite_number: 'CNI-ADMIN-001',
          carte_identite_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
          nationalite: 'Française',
          adresse: '123 Rue Principale',
          ville: 'Paris',
          code_postal: '75001',
          pays: 'France',
          date_naissance: new Date('1980-01-01'),
          registre_commerce: 'RC-ADMIN-001',
          role: GestionnaireRole.GESTIONNAIRE,
        },
      },
      company: {
        create: {
          name: 'Gestiloc SARL',
          type: 'SARL',
          registre_commerce_number: 'RC-GESTILOC-001',
          registre_commerce_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
          address: '123 Rue Principale, Paris',
          latitude: 48.8566,
          longitude: 2.3522,
          description: 'Société de gestion immobilière',
        },
      },
    },
  });

  // Log admin credentials
  console.log(`
    ╔════════════════════════════════════════════╗
    ║          Admin Credentials                 ║
    ╚════════════════════════════════════════════╝
    Email: ${adminCredentials.email}
    Password: ${adminCredentials.password}
    ----------------------------------------------
    Use these credentials to log in at /auth/login
    Gestionnaire ID: ${adminGestionnaire.id}
    ╚════════════════════════════════════════════╝
  `);

  // Créer 9 autres gestionnaires
  const gestionnaires: { id: number }[] = [adminGestionnaire];
  for (let i = 0; i < 9; i++) {
    const gestionnaire = await prisma.gestionnaire.create({
      data: {
        email: faker.internet.email(),
        motDePasse: await bcrypt.hash('password123', 10),
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        telephone: faker.phone.number(),
        isAdmin: false,
        statut: i % 2 === 0 ? GestionnaireStatut.VALIDE : GestionnaireStatut.EN_ATTENTE,
        dossiergestionnaire: {
          create: {
            ifu_number: faker.string.uuid(),
            ifu_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
            carte_identite_number: faker.string.alphanumeric({ length: 10 }),
            carte_identite_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
            nationalite: 'Française',
            adresse: faker.location.streetAddress(),
            ville: faker.location.city(),
            code_postal: faker.location.zipCode(),
            pays: 'France',
            date_naissance: faker.date.past({ years: 50 }),
            registre_commerce: i % 2 === 0 ? faker.string.uuid() : undefined,
            role: i % 2 === 0 ? GestionnaireRole.GESTIONNAIRE : GestionnaireRole.PARTICULIER,
          },
        },
        company: {
          create: {
            name: faker.company.name(),
            type: 'SARL',
            registre_commerce_number: faker.string.uuid(),
            registre_commerce_file: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
            address: faker.location.streetAddress(),
            latitude: parseFloat(faker.location.latitude().toString()),
            longitude: parseFloat(faker.location.longitude().toString()),
            description: faker.lorem.paragraph(),
          },
        },
      },
    });
    gestionnaires.push(gestionnaire);
  }

  // Créer 10 propriétés
  const proprietes: { id: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const propriete = await prisma.propriete.create({
      data: {
        nom: `Propriété ${i + 1}`,
        adresse: faker.location.streetAddress(),
        ville: faker.location.city(),
        codePostal: faker.location.zipCode(),
        pays: 'France',
        gestionnaireId: gestionnaires[i % gestionnaires.length].id,
        localisation: {
          latitude: parseFloat(faker.location.latitude().toString()),
          longitude: parseFloat(faker.location.longitude().toString()),
        },
      },
    });
    proprietes.push(propriete);
  }

  // Créer 15 unités locatives
  const unitesLocatives: { id: number }[] = [];
  for (let i = 0; i < 15; i++) {
    const unite = await prisma.uniteLocative.create({
      data: {
        nom: `Unité ${i + 1}`,
        description: faker.lorem.sentence(),
        prix: parseFloat(faker.finance.amount({ min: 500, max: 2000, dec: 2 })),
        proprieteId: proprietes[i % proprietes.length].id,
      },
    });
    unitesLocatives.push(unite);
  }

  // Créer 10 locataires
  const locataires: { id: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const locataire = await prisma.locataire.create({
      data: {
        email: faker.internet.email(),
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        telephone: faker.phone.number(),
        carte_identite : faker.string.alphanumeric({ length: 10 }),
        photo_identite: 'https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf',
        uniteLocativeId: unitesLocatives[i].id,
      },
    });
    locataires.push(locataire);

    await prisma.auditLog.create({
      data: {
        gestionnaireId: adminGestionnaire.id,
        action: 'CREATION_LOCATAIRE',
        details: `Locataire ${locataire.prenom} ${locataire.nom} (ID: ${locataire.id}) ajouté par l'admin`,
        adminId: adminGestionnaire.id,
        createdAt: new Date(),
      },
    });
  }

  // Créer 10 contrats
  const contrats: { id: number }[] = [];
  for (let i = 0; i < 10; i++) {
    const contrat = await prisma.contrat.create({
      data: {
        locataireId: locataires[i % locataires.length].id,
        uniteLocativeId: unitesLocatives[i % unitesLocatives.length].id,
        dateDebut: faker.date.recent({ days: 30 }),
        dateFin: faker.date.future({ years: 1 }),
        loyerMensuel: parseFloat(faker.finance.amount({ min: 500, max: 1500, dec: 2 })),
        typeContrat: 'Bail résidentiel',
        isLocked: false,
      },
    });
    contrats.push(contrat);

    await prisma.auditLog.create({
      data: {
        gestionnaireId: adminGestionnaire.id,
        action: 'CREATION_CONTRAT',
        details: `Contrat (ID: ${contrat.id}) créé pour le locataire ID ${locataires[i % locataires.length].id}`,
        adminId: adminGestionnaire.id,
        createdAt: new Date(),
      },
    });
  }

  // Créer 10 charges détaillées
  for (let i = 0; i < 10; i++) {
    await prisma.chargeDetaillee.create({
      data: {
        contratId: contrats[i % contrats.length].id,
        libelle: `Charge ${i + 1} (ex: ${faker.helpers.shuffle(['Entretien', 'Eau', 'Électricité', 'Chauffage'])[0]})`,
        montant: parseFloat(faker.finance.amount({ min: 50, max: 200, dec: 2 })),
      },
    });
  }

  // Créer 10 états des lieux
  for (let i = 0; i < 10; i++) {
    await prisma.etatDesLieux.create({
      data: {
        contratId: contrats[i % contrats.length].id,
        type: i < 5 ? TypeEtatDesLieux.ENTREE : TypeEtatDesLieux.SORTIE,
        date: faker.date.recent({ days: 30 }),
        details: {
          observations: faker.lorem.paragraph(),
          etat: faker.helpers.shuffle(['Bon', 'Moyen', 'À rénover'])[0],
        },
      },
    });
  }

  // Créer 10 avenants
  for (let i = 0; i < 10; i++) {
    await prisma.avenant.create({
      data: {
        contratId: contrats[i % contrats.length].id,
        titre: `Avenant ${i + 1}`,
        contenu: faker.lorem.paragraph(),
        documentUrl: ['https://gwsosglvvobbfayijeri.supabase.co/storage/v1/object/public/gestionnaire/registre_commerce/18_1748278066175.pdf'],
      },
    });
  }

  // Créer 10 paiements
  const paiements: { id : number }[] = [];
  for (let i = 0; i < 10; i++) {
    const paiement = await prisma.paiement.create({
      data: {
        contratId: contrats[i % contrats.length].id,
        locataireId: locataires[i % locataires.length].id,
        montant: parseFloat(faker.finance.amount({ min: 500, max: 1500, dec: 2 })),
        datePaiement: faker.date.recent({ days: 30 }),
        transactionId: i % 2 === 0 ? faker.string.uuid() : undefined,
        status: i % 2 === 0 ? 'completed' : 'pending',
        paymentMethod: faker.helpers.shuffle(['Carte bancaire', 'Virement bancaire', 'Chèque'])[0],
      },
    });
    paiements.push(paiement);

    await prisma.auditLog.create({
      data: {
        gestionnaireId: adminGestionnaire.id,
        action: 'CREATION_PAIEMENT',
        details: `Paiement de ${paiement.montant} EUR (ID: ${paiement.id}) créé`,
        adminId: adminGestionnaire.id,
        createdAt: new Date(),
      },
    });
  }

  // Créer 10 liens de paiement
  for (let i = 0; i < 10; i++) {
    await prisma.paymentLink.create({
      data: {
        paiementId: paiements[i % paiements.length].id,
        lien: faker.internet.url(),
        expireAt: faker.date.future({ years: 1 }),
        status: i % 2 === 0 ? 'pending' : 'completed',
      },
    });
  }

  // Créer 10 signatures
  for (let i = 0; i < 10; i++) {
    await prisma.signature.create({
      data: {
        contratId: i < 5 ? contrats[i % contrats.length].id : undefined,
        etatDesLieuxId: i >= 5 ? contrats[i % contrats.length].id : undefined,
        signataireId: locataires[i % locataires.length].id,
        signataireType: 'Locataire',
        signatureData: faker.string.alphanumeric({ length: 20 }),
      },
    });
  }

  // Créer 10 notifications
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: {
        gestionnaireId: gestionnaires[i % gestionnaires.length].id,
        type: i % 2 === 0 ? 'INFO' : 'ALERT',
        message: faker.lorem.sentence(),
        read: i % 2 === 0,
        adminId: adminGestionnaire.id,
      },
    });
  }

  // Créer 10 sessions
  for (let i = 0; i < 10; i++) {
    await prisma.session.create({
      data: {
        gestionnaireId: gestionnaires[i % gestionnaires.length].id,
        token: faker.string.uuid(),
        adminId: i === 0 ? adminGestionnaire.id : undefined,
      },
    });
  }

  console.log(`
    ╔════════════════════════════════════════════╗
    ║          Admin Credentials                 ║
    ╚════════════════════════════════════════════╝
    Email: ${adminCredentials.email}
    Password: ${adminCredentials.password}
    ----------------------------------------------
    Use these credentials to log in at /auth/login
    Gestionnaire ID: ${adminGestionnaire.id}
    ╚════════════════════════════════════════════╝
  `);

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });