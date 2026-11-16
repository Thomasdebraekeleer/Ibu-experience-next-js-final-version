"use client";

import React from "react";
import type { CgvDocument as CgvDoc } from "@/content/cgv";
import styles from "./cgv.module.scss";

function linkifyContact(text: string): React.ReactNode {
  const email = "info@ibu-experience.be";
  const parts = text.split(email);
  if (parts.length === 1) return text;
  const out: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) out.push(part);
    if (i < parts.length - 1) {
      out.push(
        <a key={`mail-${i}`} href={`mailto:${email}`} className={styles.link}>
          {email}
        </a>
      );
    }
  });
  return out;
}

type Props = {
  document: CgvDoc;
};

export default function CgvDocument({ document }: Props) {
  return (
    <article className={styles.doc}>
      <h1 className={styles.pageTitle}>{document.pageTitle}</h1>
      {document.articles.map((article) => (
        <section key={article.title} className={styles.article}>
          <h2 className={styles.articleTitle}>{article.title}</h2>
          {article.blocks.map((block, index) => {
            if (block.type === "p") {
              return (
                <p key={index} className={styles.paragraph}>
                  {linkifyContact(block.text)}
                </p>
              );
            }
            if (block.type === "labeled") {
              return (
                <p key={index} className={styles.paragraph}>
                  <strong className={styles.inlineLabel}>{block.label}</strong>{" "}
                  {linkifyContact(block.text)}
                </p>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index} className={styles.list}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <div key={index} className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {block.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell) => (
                          <td key={cell}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}