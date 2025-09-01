'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../error-msg';

type FormData = {
  name: string;
  subject: string;
  message: string;
};

const schema = yup.object().shape({
  name: yup.string().required().label("Name"),
  subject: yup.string().required().label("subject"),
  message: yup.string().required().label("Message"),
});

// prop type 
type IProps = {
  btnCls?:string;
}

export default function ContactForm({btnCls=''}:IProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const {register,handleSubmit,reset,formState: { errors }} = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = handleSubmit((data:FormData) => {
    // Préparer le contenu de l'email
    const emailSubject = `Contact IBÙ EXPERIENCE - ${data.subject}`;
    const emailBody = `
Nom: ${data.name}
Email: ${data.subject}
Sujet: ${data.subject}
Message: ${data.message}

---
Ce message a été envoyé depuis le formulaire de contact du site IBÙ EXPERIENCE.
    `;
    
    // Créer le lien mailto
    const mailtoLink = `mailto:info@ibu-experience.be?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Ouvrir le client email par défaut
    window.open(mailtoLink);
    
    // Afficher le message de succès
    setShowSuccess(true);
    reset();
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  });

  return (
    <>
      {showSuccess && (
        <div className="success-message" style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          ✨ Thanks for reaching out! We&apos;ll get back to you as soon as possible.
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="cn-contactform-input mb-25">
          <label>Name</label>
          <input id='name' {...register("name")} type="text" placeholder="Your name" />
          <ErrorMsg msg={errors.name?.message!} />
        </div>
        <div className="cn-contactform-input mb-25">
          <label>Subject</label>
          <input id='subject' {...register("subject")} type="text" placeholder="Your@email.com" />
          <ErrorMsg msg={errors.subject?.message!} />
        </div>
        <div className="cn-contactform-input mb-25">
          <label>Message</label>
          <textarea id='message' {...register("message")} placeholder="Any questions? Tell us about your request or experience needs..."></textarea>
          <ErrorMsg msg={errors.message?.message!} />
        </div>
        <div className="cn-contactform-btn">
          <button className={`tp-btn-black-md ${btnCls} w-100`} type="submit">
            Send Message
          </button>
        </div>
      </form>
    </>
  );
}
