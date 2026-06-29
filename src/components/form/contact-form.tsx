"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslations } from "next-intl";
import ErrorMsg from "../error-msg";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type IProps = {
  btnCls?: string;
};

export default function ContactForm({ btnCls = "" }: IProps) {
  const t = useTranslations("contact.form");
  const [showSuccess, setShowSuccess] = useState(false);

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required().label(t("fields.name")),
        email: yup
          .string()
          .required()
          .email(t("errors.invalidEmail"))
          .label(t("fields.email")),
        message: yup.string().required().label(t("fields.message")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit((data: FormData) => {
    const emailSubject = t("mailto.subject");
    const emailBody = t("mailto.body", {
      name: data.name,
      email: data.email,
      message: data.message,
    });

    const mailtoLink = `mailto:info@ibu-experience.be?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(mailtoLink);

    setShowSuccess(true);
    reset();

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  });

  return (
    <>
      {showSuccess && (
        <div
          className="success-message"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {t("success")}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="cn-contactform-input mb-25">
          <label htmlFor="name">{t("fields.name")}</label>
          <input
            id="name"
            {...register("name")}
            type="text"
            placeholder={t("placeholders.name")}
          />
          <ErrorMsg msg={errors.name?.message!} />
        </div>
        <div className="cn-contactform-input mb-25">
          <label htmlFor="email">{t("fields.email")}</label>
          <input
            id="email"
            {...register("email")}
            type="email"
            placeholder={t("placeholders.email")}
          />
          <ErrorMsg msg={errors.email?.message!} />
        </div>
        <div className="cn-contactform-input mb-25">
          <label htmlFor="message">{t("fields.message")}</label>
          <textarea
            id="message"
            {...register("message")}
            placeholder={t("placeholders.message")}
          />
          <ErrorMsg msg={errors.message?.message!} />
        </div>
        <div className="cn-contactform-btn">
          <button className={`tp-btn-black-md ${btnCls} w-100`} type="submit">
            {t("submit")}
          </button>
        </div>
      </form>
    </>
  );
}
