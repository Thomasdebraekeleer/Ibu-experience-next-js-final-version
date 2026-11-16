export type CgvBlock =
  | { type: "p"; text: string }
  | { type: "labeled"; label: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type CgvArticle = {
  title: string;
  blocks: CgvBlock[];
};

export type CgvDocument = {
  pageTitle: string;
  articles: CgvArticle[];
};

const cgvFr: CgvDocument = {
  pageTitle: "Conditions générales de vente – IBÙ Experience",
  articles: [
    {
      title: "Article 1 – Identification et champ d'application",
      blocks: [
        {
          type: "p",
          text: "Le site ibu-experience.be est exploité par Mallen Jallow, dont le siège est situé à Rue de la Brasserie 1-3, 1050 Ixelles, inscrite à la Banque-Carrefour des Entreprises sous le numéro 0775.253.890, TVA BE0775.253.890, ci-après « IBÙ Experience ».",
        },
        {
          type: "p",
          text: "Contact : info@ibu-experience.be · +32 498 75 75 92",
        },
        {
          type: "p",
          text: "Les présentes conditions générales de vente (CGV) s'appliquent à toute réservation d'un séjour et des options associées effectuée auprès d'IBÙ Experience, via le site ou tout autre canal. Toute réservation implique l'acceptation pleine et entière des CGV en vigueur au jour de la réservation.",
        },
      ],
    },
    {
      title: "Article 2 – Description des séjours et options",
      blocks: [
        {
          type: "p",
          text: "IBÙ Experience propose des séjours en hébergements insolites (« cocons ») situés au sein de domaines partenaires (vignobles, châteaux, domaines). Le descriptif de chaque cocon (équipements, capacité, services inclus) figure sur le site et fait partie intégrante de l'offre.",
        },
        {
          type: "p",
          text: "Des options payantes peuvent être ajoutées au séjour (petit-déjeuner, planches, visite de chai, arrivée anticipée, départ tardif, massage, décoration, etc.). Les options disponibles varient selon le domaine et sont indiquées lors de la réservation.",
        },
        {
          type: "p",
          text: "Certaines options sont réalisées par des prestataires ou domaines partenaires et sont proposées sous réserve de leurs disponibilités. Si une option ne peut être assurée, IBÙ Experience en informe le client et lui rembourse le montant de cette option.",
        },
        {
          type: "p",
          text: "Les photos et visuels du site sont fournis à titre illustratif et n'ont pas de valeur contractuelle.",
        },
      ],
    },
    {
      title: "Article 3 – Réservation",
      blocks: [
        {
          type: "p",
          text: "La réservation s'effectue en ligne via le site ibu-experience.be. Le client choisit le domaine, les dates, le nombre de personnes et les éventuelles options, puis valide sa demande et procède au paiement.",
        },
        {
          type: "p",
          text: "La réservation est définitive dès réception du paiement. Une confirmation reprenant le détail du séjour est alors envoyée par e-mail. Un devis ou une demande non payée expire automatiquement après 72 heures.",
        },
        {
          type: "p",
          text: "Le client s'engage à fournir des informations exactes et à être majeur au moment de la réservation. La personne qui réserve est responsable du respect des CGV par l'ensemble des occupants.",
        },
        {
          type: "p",
          text: "Conformément à l'article VI.53, 12° du Code de droit économique, le droit de rétractation de 14 jours ne s'applique pas aux prestations d'hébergement fournies à une date déterminée. Seules les conditions d'annulation de l'article 5 s'appliquent.",
        },
      ],
    },
    {
      title: "Article 4 – Prix et paiement",
      blocks: [
        {
          type: "p",
          text: "Les prix sont indiqués en euros, toutes taxes comprises (TVA incluse), pour le cocon et les personnes précisées. Le prix applicable est celui affiché au moment de la réservation.",
        },
        {
          type: "p",
          text: "La taxe de séjour communale, si elle est due, [est incluse dans le prix / est facturée en supplément].",
        },
        {
          type: "p",
          text: "La totalité du montant (100 %) est due au moment de la réservation. Le paiement s'effectue en ligne par [moyens de paiement acceptés].",
        },
        {
          type: "p",
          text: "Certaines options, comme la visite de chai, peuvent être réglées directement sur place ; cela est alors indiqué dans leur descriptif.",
        },
        {
          type: "p",
          text: "Aucune caution n'est demandée. Cela n'exonère pas le client de sa responsabilité en cas de dégâts (article 7).",
        },
      ],
    },
    {
      title: "Article 5 – Annulation et modification",
      blocks: [
        {
          type: "labeled",
          label: "Annulation par le client.",
          text: "Toute annulation doit être notifiée par e-mail à info@ibu-experience.be. La date de réception de l'e-mail fait foi.",
        },
        {
          type: "ul",
          items: [
            "Annulation 7 jours ou plus avant la date d'arrivée : remboursement de 50 % du montant payé.",
            "Annulation moins de 7 jours avant la date d'arrivée : aucun remboursement.",
            "Non-présentation (no-show) ou séjour écourté : aucun remboursement.",
          ],
        },
        {
          type: "labeled",
          label: "Modification par le client.",
          text: "Une demande de changement de dates peut être adressée par e-mail. Elle est acceptée selon les disponibilités et à la discrétion d'IBÙ Experience ; une éventuelle différence de prix reste à charge du client.",
        },
        {
          type: "labeled",
          label: "Annulation par IBÙ Experience.",
          text: "Si IBÙ Experience doit annuler un séjour (force majeure, conditions météorologiques dangereuses, panne rendant le cocon inhabitable, décision du domaine partenaire, etc.), le client se voit proposer un report sans frais ou le remboursement intégral des sommes versées, à l'exclusion de toute autre indemnité.",
        },
      ],
    },
    {
      title: "Article 6 – Arrivée, départ et déroulement du séjour",
      blocks: [
        {
          type: "table",
          headers: ["Moment", "Été", "Automne / hiver"],
          rows: [
            ["Arrivée", "à partir de 17h00", "à partir de 16h30"],
            ["Arrivée anticipée (option)", "à partir de 15h30", "à partir de 15h00"],
            ["Départ", "au plus tard à 11h00", "au plus tard à 11h00"],
            ["Départ tardif (option)", "au plus tard à 13h30", "au plus tard à 13h30"],
          ],
        },
        {
          type: "p",
          text: "Les horaires d'été s'appliquent du passage à l'heure d'été (fin mars) au passage à l'heure d'hiver (fin octobre) ; les horaires d'automne / hiver s'appliquent le reste de l'année.",
        },
        {
          type: "p",
          text: "Les informations d'accès sont communiquées avant l'arrivée. Un dépassement de l'heure de départ sans option réservée peut être facturé.",
        },
        {
          type: "p",
          text: "Le cocon ne peut être occupé que par le nombre de personnes prévu à la réservation. Les jeunes enfants sont les bienvenus ; le client le signale lors de la réservation. Un lit pour bébé peut être mis à disposition sur demande, sans coût supplémentaire. Animaux : [acceptés / non acceptés].",
        },
        {
          type: "p",
          text: "Il est interdit de fumer à l'intérieur du cocon. Le client respecte la quiétude du domaine, ses règles internes et l'environnement naturel.",
        },
        {
          type: "p",
          text: "Le bain nordique et le sauna fonctionnent au bois. Ils sont préchauffés avant l'arrivée du client ; la chauffe est ensuite assurée par le client pendant son séjour, à l'aide du bois et du matériel mis à disposition sur place.",
        },
        {
          type: "p",
          text: "Pour la sécurité des occupants, chaque cocon est équipé d'un extincteur et de détecteurs de fumée. Un extincteur est également placé à l'extérieur du sauna.",
        },
        {
          type: "p",
          text: "Le sauna et le bain nordique sont utilisés sous la responsabilité du client, dans le respect des consignes affichées. Leur usage est déconseillé aux femmes enceintes et aux personnes présentant des contre-indications médicales, ainsi qu'après consommation d'alcool. Les enfants y restent sous la surveillance constante d'un adulte.",
        },
      ],
    },
    {
      title: "Article 7 – Responsabilités, données personnelles et litiges",
      blocks: [
        {
          type: "labeled",
          label: "Responsabilité du client.",
          text: "Le client est responsable de tout dommage causé au cocon, à ses équipements ou au domaine par lui-même ou ses accompagnants. Les frais de réparation, de remplacement ou de nettoyage exceptionnel peuvent lui être facturés après constat.",
        },
        {
          type: "labeled",
          label: "Responsabilité d'IBÙ Experience.",
          text: "IBÙ Experience ne peut être tenue responsable de la perte ou du vol d'effets personnels, ni des dommages résultant d'une utilisation des équipements non conforme aux consignes. Elle n'est pas responsable en cas de force majeure ou du fait d'un tiers.",
        },
        {
          type: "labeled",
          label: "Réclamations.",
          text: "Toute réclamation relative au séjour est à adresser par e-mail à info@ibu-experience.be, si possible pendant le séjour, et au plus tard dans les 7 jours suivant le départ.",
        },
        {
          type: "labeled",
          label: "Données personnelles.",
          text: "Les données communiquées lors de la réservation sont traitées par IBÙ Experience pour gérer le séjour, conformément au Règlement général sur la protection des données (RGPD). Elles peuvent être partagées avec les prestataires nécessaires à la réservation (plateforme de réservation, paiement, domaine partenaire). Le client peut exercer ses droits d'accès, de rectification et de suppression à info@ibu-experience.be. Détails dans la [politique de confidentialité].",
        },
        {
          type: "labeled",
          label: "Droit applicable et litiges.",
          text: "Les présentes CGV sont soumises au droit belge. En cas de litige, une solution amiable sera recherchée en priorité. Le client consommateur peut également s'adresser gratuitement au Service de Médiation pour le Consommateur (mediationconsommateur.be). À défaut d'accord, les tribunaux de [arrondissement du siège] sont compétents, sans préjudice des règles de compétence protectrices du consommateur.",
        },
        {
          type: "p",
          text: "IBÙ Experience peut modifier les présentes CGV à tout moment ; les CGV applicables sont celles en vigueur au jour de la réservation.",
        },
      ],
    },
  ],
};

const cgvNl: CgvDocument = {
  pageTitle: "Algemene verkoopsvoorwaarden – IBÙ Experience",
  articles: [
    {
      title: "Artikel 1 – Identificatie en toepassingsgebied",
      blocks: [
        {
          type: "p",
          text: "De website ibu-experience.be wordt beheerd door Mallen Jallow, met maatschappelijke zetel Rue de la Brasserie 1-3, 1050 Elsene, ingeschreven in de Kruispuntbank van Ondernemingen onder nummer 0775.253.890, btw BE0775.253.890, hierna « IBÙ Experience ».",
        },
        {
          type: "p",
          text: "Contact: info@ibu-experience.be · +32 498 75 75 92",
        },
        {
          type: "p",
          text: "Deze algemene verkoopsvoorwaarden (AVV) zijn van toepassing op elke reservatie van een verblijf en de bijbehorende opties bij IBÙ Experience, via de website of elk ander kanaal. Elke reservatie impliceert de volledige aanvaarding van de AVV die op de dag van de reservatie van kracht zijn.",
        },
      ],
    },
    {
      title: "Artikel 2 – Beschrijving van de verblijven en opties",
      blocks: [
        {
          type: "p",
          text: "IBÙ Experience biedt verblijven in bijzondere accommodaties (« cocons ») gelegen op partnerdomeinen (wijngaarden, kastelen, domeinen). De beschrijving van elke cocon (uitrusting, capaciteit, inbegrepen diensten) staat op de website en maakt integraal deel uit van het aanbod.",
        },
        {
          type: "p",
          text: "Betaalde opties kunnen aan het verblijf worden toegevoegd (ontbijt, planken, kelderbezoek, vervroegde aankomst, late check-out, massage, decoratie, enz.). De beschikbare opties variëren per domein en worden vermeld bij de reservatie.",
        },
        {
          type: "p",
          text: "Bepaalde opties worden uitgevoerd door partnerdienstverleners of -domeinen en worden aangeboden onder voorbehoud van hun beschikbaarheid. Kan een optie niet worden verzekerd, dan informeert IBÙ Experience de klant en vergoedt zij het bedrag van die optie.",
        },
        {
          type: "p",
          text: "Foto's en beelden op de website worden ter illustratie verstrekt en hebben geen contractuele waarde.",
        },
      ],
    },
    {
      title: "Artikel 3 – Reservatie",
      blocks: [
        {
          type: "p",
          text: "De reservatie gebeurt online via de website ibu-experience.be. De klant kiest het domein, de data, het aantal personen en eventuele opties, bevestigt zijn aanvraag en voert de betaling uit.",
        },
        {
          type: "p",
          text: "De reservatie is definitief zodra de betaling is ontvangen. Een bevestiging met de details van het verblijf wordt per e-mail verzonden. Een offerte of onbetaalde aanvraag vervalt automatisch na 72 uur.",
        },
        {
          type: "p",
          text: "De klant verbindt zich ertoe correcte gegevens te verstrekken en meerderjarig te zijn op het moment van de reservatie. De persoon die reserveert, is verantwoordelijk voor de naleving van de AVV door alle bewoners.",
        },
        {
          type: "p",
          text: "Overeenkomstig artikel VI.53, 12° van het Wetboek van economisch recht geldt het herroepingsrecht van 14 dagen niet voor overnachtingsdiensten die op een bepaalde datum worden geleverd. Alleen de annuleringsvoorwaarden van artikel 5 zijn van toepassing.",
        },
      ],
    },
    {
      title: "Artikel 4 – Prijs en betaling",
      blocks: [
        {
          type: "p",
          text: "Prijzen worden vermeld in euro, inclusief alle belastingen (btw inbegrepen), voor de opgegeven cocon en personen. De toepasselijke prijs is die welke op het moment van de reservatie wordt weergegeven.",
        },
        {
          type: "p",
          text: "Indien verschuldigd, wordt de gemeentelijke toeristenbelasting [in de prijs inbegrepen / apart aangerekend].",
        },
        {
          type: "p",
          text: "Het volledige bedrag (100 %) is verschuldigd op het moment van de reservatie. De betaling gebeurt online via [geaccepteerde betaalmethoden].",
        },
        {
          type: "p",
          text: "Bepaalde opties, zoals een kelderbezoek, kunnen ter plaatse worden betaald; dit wordt dan vermeld in de beschrijving.",
        },
        {
          type: "p",
          text: "Er wordt geen waarborg gevraagd. Dit ontslaat de klant niet van zijn aansprakelijkheid bij schade (artikel 7).",
        },
      ],
    },
    {
      title: "Artikel 5 – Annulering en wijziging",
      blocks: [
        {
          type: "labeled",
          label: "Annulering door de klant.",
          text: "Elke annulering moet per e-mail worden gemeld aan info@ibu-experience.be. De datum van ontvangst van de e-mail is bepalend.",
        },
        {
          type: "ul",
          items: [
            "Annulering 7 dagen of meer vóór de aankomstdatum: terugbetaling van 50 % van het betaalde bedrag.",
            "Annulering minder dan 7 dagen vóór de aankomstdatum: geen terugbetaling.",
            "No-show of verkort verblijf: geen terugbetaling.",
          ],
        },
        {
          type: "labeled",
          label: "Wijziging door de klant.",
          text: "Een verzoek tot datumwijziging kan per e-mail worden gericht. Het wordt geaccepteerd volgens beschikbaarheid en naar goeddunken van IBÙ Experience; een eventueel prijsverschil blijft voor rekening van de klant.",
        },
        {
          type: "labeled",
          label: "Annulering door IBÙ Experience.",
          text: "Moet IBÙ Experience een verblijf annuleren (overmacht, gevaarlijke weersomstandigheden, storing die de cocon onbewoonbaar maakt, beslissing van het partnerdomein, enz.), dan krijgt de klant de keuze tussen een gratis verschuiving of volledige terugbetaling van de betaalde sommen, met uitsluiting van enige andere vergoeding.",
        },
      ],
    },
    {
      title: "Artikel 6 – Aankomst, vertrek en verloop van het verblijf",
      blocks: [
        {
          type: "table",
          headers: ["Moment", "Zomer", "Herfst / winter"],
          rows: [
            ["Aankomst", "vanaf 17u00", "vanaf 16u30"],
            ["Vervroegde aankomst (optie)", "vanaf 15u30", "vanaf 15u00"],
            ["Vertrek", "uiterlijk om 11u00", "uiterlijk om 11u00"],
            ["Late check-out (optie)", "uiterlijk om 13u30", "uiterlijk om 13u30"],
          ],
        },
        {
          type: "p",
          text: "De zomeruren gelden van de omschakeling naar de zomertijd (eind maart) tot de omschakeling naar de wintertijd (eind oktober); de herfst- / winteruren gelden de rest van het jaar.",
        },
        {
          type: "p",
          text: "Toegangsinformatie wordt vóór de aankomst meegedeeld. Overschrijding van het vertrekuur zonder gereserveerde optie kan worden aangerekend.",
        },
        {
          type: "p",
          text: "De cocon mag enkel bewoond worden door het bij de reservatie voorziene aantal personen. Jonge kinderen zijn welkom; de klant meldt dit bij de reservatie. Een babybed kan op aanvraag kosteloos ter beschikking worden gesteld. Huisdieren: [toegelaten / niet toegelaten].",
        },
        {
          type: "p",
          text: "Roken in de cocon is verboden. De klant respecteert de rust van het domein, de interne regels en de natuurlijke omgeving.",
        },
        {
          type: "p",
          text: "Het Noords bad en de sauna werken op hout. Ze worden vóór de aankomst van de klant voorverwarmd; daarna verwarmt de klant ze zelf tijdens het verblijf met het hout en materiaal dat ter plaatse beschikbaar is.",
        },
        {
          type: "p",
          text: "Voor de veiligheid van de bewoners is elke cocon uitgerust met een brandblusser en rookmelders. Een brandblusser staat ook buiten de sauna.",
        },
        {
          type: "p",
          text: "De sauna en het Noords bad worden gebruikt onder de verantwoordelijkheid van de klant, met inachtneming van de aanwijzingen. Gebruik wordt afgeraden voor zwangere vrouwen en personen met medische tegenindicaties, evenals na alcoholconsumptie. Kinderen blijven onder het constant toezicht van een volwassene.",
        },
      ],
    },
    {
      title: "Artikel 7 – Aansprakelijkheid, persoonsgegevens en geschillen",
      blocks: [
        {
          type: "labeled",
          label: "Aansprakelijkheid van de klant.",
          text: "De klant is aansprakelijk voor elke schade aan de cocon, de uitrusting of het domein door hemzelf of zijn begeleiders. Herstel-, vervangings- of uitzonderlijke schoonmaakkosten kunnen na vaststelling aan hem worden aangerekend.",
        },
        {
          type: "labeled",
          label: "Aansprakelijkheid van IBÙ Experience.",
          text: "IBÙ Experience kan niet aansprakelijk worden gesteld voor verlies of diefstal van persoonlijke bezittingen, noch voor schade door gebruik van de uitrusting in strijd met de instructies. Zij is niet aansprakelijk bij overmacht of door een derde.",
        },
        {
          type: "labeled",
          label: "Klachten.",
          text: "Elke klacht over het verblijf dient per e-mail te worden gericht aan info@ibu-experience.be, bij voorkeur tijdens het verblijf, en uiterlijk binnen 7 dagen na het vertrek.",
        },
        {
          type: "labeled",
          label: "Persoonsgegevens.",
          text: "De bij de reservatie verstrekte gegevens worden door IBÙ Experience verwerkt om het verblijf te beheren, conform de Algemene Verordening Gegevensbescherming (AVG). Ze kunnen worden gedeeld met de voor de reservatie noodzakelijke dienstverleners (reservatieplatform, betaling, partnerdomein). De klant kan zijn rechten op inzage, rectificatie en verwijdering uitoefenen via info@ibu-experience.be. Details in het [privacybeleid].",
        },
        {
          type: "labeled",
          label: "Toepasselijk recht en geschillen.",
          text: "Deze AVV zijn onderworpen aan het Belgische recht. Bij een geschil wordt eerst naar een minnelijke oplossing gezocht. De consument kan zich ook kosteloos wenden tot de Ombudsdienst voor Consumenten (consumentenombudsdienst.be). Bij gebrek aan akkoord zijn de rechtbanken van [arrondissement van de zetel] bevoegd, onverminderd de beschermende regels van rechtsbevoegdheid voor de consomateur.",
        },
        {
          type: "p",
          text: "IBÙ Experience kan deze AVV te allen tijde wijzigen; de toepasselijke AVV zijn die welke op de dag van de reservatie van kracht zijn.",
        },
      ],
    },
  ],
};

export function getCgvDocument(locale: string): CgvDocument {
  return locale === "nl-BE" ? cgvNl : cgvFr;
}