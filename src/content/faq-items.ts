export type FaqPlace = {
  title: string;
  description: string;
};

export type FaqSection =
  | { kind: "bullets"; title: string; bullets: string[] }
  | { kind: "places"; title: string; places: FaqPlace[] };

export type FaqItemContent = {
  question: string;
  paragraphs?: string[];
  bullets?: string[];
  sections?: FaqSection[];
};

const faqFr: FaqItemContent[] = [
  {
    question: "Le bain nordique est-il privatif ?",
    paragraphs: [
      "Oui. Chaque cocon a son propre bain nordique, avec vue directe sur les vignes. Vous pouvez vous y détendre en toute intimité.",
    ],
  },
  {
    question: "Le sauna est-il privatif ?",
    paragraphs: ["Le sauna est partagé entre les deux cocons."],
  },
  {
    question: "Comment fonctionne la chauffe du wellness ?",
    paragraphs: [
      "Le sauna et le bain nordique chauffent au bois. Nous les allumons juste avant votre arrivée pour que vous puissiez en profiter dès votre installation.",
      "Du bois, du petit bois et des allume-feux sont à votre disposition dans le sauna et sous votre cocon. Vous pouvez ainsi régler la température comme vous le souhaitez.",
      "Un QR code explicatif vous attend dans la cuisine de votre cocon.",
    ],
  },
  {
    question: "Le wellness est-il inclus dans la nuitée ?",
    paragraphs: [
      "Oui. Vous y avez accès pendant tout votre séjour, et le bois est fourni.",
    ],
  },
  {
    question: "Y a-t-il une différence entre les deux cocons du Domaine de Mehaignoul ?",
    paragraphs: [
      "Non. Les deux cocons sont identiques : ils ont été conçus avec le même soin et ont la même vue panoramique sur le vignoble.",
      "Ils sont espacés et orientés pour préserver pleinement votre intimité. Vous n'aurez même pas l'impression d'avoir des voisins.",
    ],
  },
  {
    question: "Est-il possible d'arriver plus tôt ou de partir plus tard ?",
    paragraphs: [
      "Oui. Il suffit d'ajouter l'option « Early check-in » et/ou « Late check-out » à la fin de votre réservation.",
    ],
  },
  {
    question: "Qu'est-ce qui est compris dans la nuitée ?",
    bullets: [
      "Une bouteille de bienvenue du vignoble (Les Jolies de Mehaignoul)",
      "L'accès complet au wellness (bain nordique et sauna)",
      "Le bois de chauffe",
      "Un panier bien-être : huile de massage Siprès Cosmétique, thés et tisanes",
      "Du café de spécialité signé Wideawake et du lait d'avoine Oatly",
      "Des peignoirs et serviettes de bain signé Kalani.Home",
      "Des sandales d'extérieur",
    ],
  },
  {
    question: "Peut-on cuisiner dans le cocon ?",
    paragraphs: [
      "Oui. Chaque cocon a une petite cuisine équipée : airfryer, taque de cuisson, poêle, casserole et ustensiles.",
      "Notre conseil : l'espace n'est pas prévu pour de grandes préparations. Pour profiter sans y penser, choisissez plutôt l'une de nos options food, 100 % locales et préparées par la Ferme de Warichet : une planche apéritive ou une planche gourmande dînatoire.",
    ],
  },
  {
    question: "Les peignoirs et serviettes de bain sont-ils inclus ?",
    paragraphs: [
      "Oui, tout est compris dans la nuitée. Tout notre linge de lit et de bain vient de chez Kalani Home : 100 % coton, belge et éco-responsable, pour dormir comme sur un nuage.",
    ],
  },
  {
    question: "Comment fonctionne le mini-bar ?",
    paragraphs: [
      "Vous trouverez dans votre cocon un menu avec les produits et leurs prix. Vous réglez vos consommations directement via le QR code Payconiq by Bancontact sécurisé, depuis votre application bancaire ou via Wero.",
    ],
  },
  {
    question: "Quelles activités faire sur place et dans les environs ?",
    sections: [
      {
        kind: "bullets",
        title: "Sur place",
        bullets: [
          "Visite du chai du Domaine de Mehaignoul : à réserver par mail ou au moment de votre réservation. Le paiement se fait sur place.",
          "Le bain nordique privatif, avec vue sur les vignes",
          "Le sauna avec vue panoramique, partagé avec l'autre cocon",
        ],
      },
      {
        kind: "places",
        title: "Balades et visites dans les environs",
        places: [
          {
            title: "La promenade de la Voie romaine (Meux / La Bruyère)",
            description:
              "Une balade facile qui suit le tracé de l'ancienne voie romaine, entre champs et prairies, avec de belles vues dégagées. Elle fait de 4 à 7 km et elle est idéale au coucher du soleil.",
          },
          {
            title: "La réserve naturelle de Tailfer (à 20 min)",
            description:
              "Des points de vue sur la Meuse et de très beaux spots pour vos photos nature.",
          },
          {
            title: "Le Bois de Bothey (à 10 min)",
            description:
              "Une petite forêt apaisante, parfaite pour une marche tranquille ou un footing matinal.",
          },
          {
            title: "Les Jardins d'Annevoie (à 20 min)",
            description:
              "Des jardins et des fontaines du XVIIIᵉ siècle, dans un cadre très romantique. Une sortie idéale à deux.",
          },
          {
            title: "Les bords de Sambre et de Meuse à Namur (à 15 min)",
            description:
              "Une balade au fil de l'eau, entre la citadelle et le vieux centre. Elle est très photogénique et accessible à tous.",
          },
          {
            title: "La Citadelle de Namur (à 15 min)",
            description:
              "Des panoramas à couper le souffle, des restaurants et le téléphérique pour y monter.",
          },
        ],
      },
    ],
  },
];

const faqNl: FaqItemContent[] = [
  {
    question: "Is het Noors bad privé?",
    paragraphs: [
      "Ja. Elke cocon heeft een eigen Noors bad met rechtstreeks zicht op de wijngaard. Zo kunt u er in alle privacy van genieten.",
    ],
  },
  {
    question: "Is de sauna privé?",
    paragraphs: ["De sauna wordt gedeeld door de twee cocons."],
  },
  {
    question: "Hoe worden de wellnessvoorzieningen verwarmd?",
    paragraphs: [
      "De sauna en het Noors bad worden met hout gestookt. We steken ze aan vlak voor uw aankomst, zodat u er meteen van kunt genieten.",
      "In de sauna en onder uw cocon vindt u brandhout, aanmaakhout en aanmaakblokjes. Zo kunt u de temperatuur zelf regelen.",
      "In de keuken van uw cocon vindt u een QR-code met uitleg.",
    ],
  },
  {
    question: "Is de wellness inbegrepen in de overnachting?",
    paragraphs: [
      "Ja. U kunt er tijdens uw hele verblijf gebruik van maken, en het brandhout is voorzien.",
    ],
  },
  {
    question: "Is er een verschil tussen de twee cocons van het Domaine de Mehaignoul?",
    paragraphs: [
      "Nee. De twee cocons zijn identiek. Ze werden met dezelfde zorg ontworpen en hebben hetzelfde panoramische zicht op de wijngaard.",
      "Ze liggen ver genoeg uit elkaar en zijn zo georiënteerd dat uw privacy volledig gerespecteerd wordt. U zult niet eens het gevoel hebben dat u buren hebt.",
    ],
  },
  {
    question: "Kan ik vroeger aankomen of later vertrekken?",
    paragraphs: [
      'Ja. Voeg gewoon de optie "Early check-in" en/of "Late check-out" toe op het einde van uw reservatie.',
    ],
  },
  {
    question: "Wat is inbegrepen in de overnachting?",
    bullets: [
      "Een welkomstfles van de wijngaard (Les Jolies de Mehaignoul)",
      "Volledige toegang tot de wellness (Noors bad en sauna)",
      "Brandhout",
      "Een wellnessmandje: massageolie van Siprès Cosmétique, thee en kruidenthee",
      "Specialty coffee van Wideawake en havermelk van Oatly",
      "Badjassen en badhanddoeken van Kalani Home",
      "Buitenslippers",
    ],
  },
  {
    question: "Kan ik koken in de cocon?",
    paragraphs: [
      "Ja. Elke cocon heeft een kleine, uitgeruste keuken met airfryer, kookplaat, pan, kookpot en keukengerei.",
      "Onze tip: de ruimte is niet bedoeld voor uitgebreide bereidingen. Wilt u zich nergens zorgen over maken? Kies dan voor een van onze food-opties, 100 % lokaal en bereid door de Ferme de Warichet: een aperitiefplank of een gourmet dinerplank.",
    ],
  },
  {
    question: "Zijn badjassen en badhanddoeken inbegrepen?",
    paragraphs: [
      "Ja, alles is inbegrepen in de overnachting. Al ons bed- en badlinnen komt van Kalani Home: 100 % katoen, Belgisch en duurzaam, om te slapen als op een wolk.",
    ],
  },
  {
    question: "Hoe werkt de minibar?",
    paragraphs: [
      "In uw cocon vindt u een menu met de producten en hun prijzen. U betaalt uw consumpties rechtstreeks via de beveiligde QR-code van Payconiq by Bancontact, met uw bankapp of via Wero.",
    ],
  },
  {
    question: "Welke activiteiten zijn er ter plaatse en in de omgeving?",
    sections: [
      {
        kind: "bullets",
        title: "Ter plaatse",
        bullets: [
          "Bezoek aan de wijnkelder van het Domaine de Mehaignoul: te reserveren per mail of bij uw reservatie. U betaalt ter plaatse.",
          "Het privé Noors bad met zicht op de wijngaard",
          "De sauna met panoramisch zicht, gedeeld met de andere cocon",
        ],
      },
      {
        kind: "places",
        title: "Wandelingen en uitstappen in de omgeving",
        places: [
          {
            title: "De wandeling langs de Romeinse heirbaan (Meux / La Bruyère)",
            description:
              "Een makkelijke wandeling langs het tracé van de oude Romeinse heirbaan, tussen velden en weiden, met mooie open vergezichten. Ze is 4 tot 7 km lang en ideaal bij zonsondergang.",
          },
          {
            title: "Het natuurreservaat van Tailfer (op 20 min)",
            description:
              "Uitzichtpunten over de Maas en prachtige plekjes voor natuurfoto's.",
          },
          {
            title: "Het Bois de Bothey (op 10 min)",
            description:
              "Een klein, rustgevend bos, perfect voor een rustige wandeling of een ochtendjog.",
          },
          {
            title: "De Tuinen van Annevoie (op 20 min)",
            description:
              "Tuinen en fonteinen uit de 18e eeuw in een heel romantisch kader. Een ideaal uitstapje voor twee.",
          },
          {
            title: "De oevers van de Samber en de Maas in Namen (op 15 min)",
            description:
              "Een wandeling langs het water, tussen de citadel en het oude centrum. Heel fotogeniek en voor iedereen toegankelijk.",
          },
          {
            title: "De Citadel van Namen (op 15 min)",
            description:
              "Adembenemende panorama's, restaurants en de kabelbaan om naar boven te gaan.",
          },
        ],
      },
    ],
  },
];

export function getFaqItems(locale: string): FaqItemContent[] {
  return locale === "nl-BE" ? faqNl : faqFr;
}
