import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    // Récupérer les variables d'environnement
    const apiKey = process.env.BREVO_API_KEY;
    const listId = process.env.BREVO_LIST_ID;

    if (!apiKey || !listId) {
      console.error('Variables d\'environnement Brevo manquantes');
      return NextResponse.json(
        { message: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Préparer les données pour Brevo
    const brevoData = {
      email: email,
      listIds: [parseInt(listId)],
      updateEnabled: true
    };

    // Envoyer la requête à Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(brevoData),
    });

    if (brevoResponse.ok) {
      return NextResponse.json(
        { message: 'Inscription réussie' },
        { status: 200 }
      );
    } else {
      const errorData = await brevoResponse.json();
      console.error('Erreur Brevo:', errorData);
      
      // Si l'email existe déjà, c'est considéré comme un succès
      if (brevoResponse.status === 400 && errorData.code === 'duplicate_parameter') {
        return NextResponse.json(
          { message: 'Inscription réussie' },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { message: 'Erreur lors de l\'inscription' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
